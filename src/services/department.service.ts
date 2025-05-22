// services/department.service.ts
import { AppDataSource } from '../db';
import {Department, Question, Category, Option, Exam} from '../entities';

export class DepartmentService {
    private deptRepo = AppDataSource.getRepository(Department);
    private catRepo  = AppDataSource.getRepository(Category);
    private questionRepo = AppDataSource.getRepository(Question);
    private examRepo = AppDataSource.getRepository(Exam);

    /**
     * Create a new department, optionally with an
     * initial list of category names.
     */
    async createDepartment(
        name: string,
        categories: string[] = []
    ): Promise<Department> {
        const existing = await this.deptRepo.findOneBy({ name });
        if (existing) {
            throw new Error(`Department "${name}" already exists.`);
        }

        // Build department + its categories
        const dept = this.deptRepo.create({
            name,
            categories: categories.map(catName =>
                this.catRepo.create({ name: catName })
            ),
        });

        return this.deptRepo.save(dept);
    }

    /**
     * Update a department's name, and
     * replace its categories if a new list is given.
     */
    async updateDepartment(
        id: string,
        newName: string,
        categories?: string[]
    ): Promise<Department> {
        const dept = await this.deptRepo.findOne({
            where: { id },
            relations: ['categories'],
        });
        if (!dept) {
            throw new Error(`Department with id ${id} not found.`);
        }

        // Prevent duplicate department names
        const dup = await this.deptRepo.findOneBy({ name: newName });
        if (dup && dup.id !== id) {
            throw new Error(`Department "${newName}" already exists.`);
        }

        dept.name = newName;

        if (categories) {
            // Remove any existing categories not in the new list:
            const toRemove = dept.categories.filter(
                c => !categories.includes(c.name)
            );
            await this.catRepo.remove(toRemove);

            // Add new categories that don't already exist:
            const existingNames = new Set(dept.categories.map(c => c.name));
            const toAdd = categories
                .filter(name => !existingNames.has(name))
                .map(name => this.catRepo.create({ name, department: dept }));

            dept.categories = dept.categories.concat(toAdd);
        }

        return this.deptRepo.save(dept);
    }

    /** Get all departments, including users, exams, questions, and categories */
    async getAllDepartments(): Promise<Department[]> {
        return this.deptRepo
            .createQueryBuilder('dept')
            .leftJoinAndSelect('dept.categories', 'category')
            .getMany();
    }

    /** Get one department by id (with all relations) */
    async getDepartmentById(id: string): Promise<Department | null> {
        return this.deptRepo.findOne({
            where: { id },
            relations: ['users', 'exams', 'questions', 'categories'],
        });
    }

    /** Delete a department and (cascade) its categories */
    async deleteDepartment(id: string): Promise<void> {
        const dept = await this.deptRepo.findOneBy({ id });
        if (!dept) {
            throw new Error(`Department with id ${id} not found.`);
        }
        await this.deptRepo.remove(dept);
    }

    async createDepartmentWithQuestionsAndExams(payload: {
        name: string;
        categories: Array<{
            name: string;
            questions: Array<{
                text: string;
                difficulty: 'easy' | 'medium' | 'hard';
                explanation: string;
                correctAnswerIndex: number;
                options: string[];
            }>;
        }>;
        exams?: Array<{
            title: string;
            description: string;
            timeLimit: number;
            totalQuestions: number;
            questions: Array<{
                categoryName: string;
                text: string;
                difficulty: 'easy' | 'medium' | 'hard';
                explanation: string;
                correctAnswerIndex: number;
                options: string[];
            }>;
        }>;
    }): Promise<Department> {
        const { name, categories, exams } = payload;

        const existing = await this.deptRepo.findOneBy({ name });
        if (existing) throw new Error(`Department "${name}" already exists.`);

        const department = this.deptRepo.create({ name });
        await this.deptRepo.save(department);

        // Create categories and their questions
        for (const catPayload of categories) {
            const category = this.catRepo.create({ name: catPayload.name, department });
            await this.catRepo.save(category);

            for (const qPayload of catPayload.questions) {
                const question = this.questionRepo.create({
                    text: qPayload.text,
                    difficulty: qPayload.difficulty,
                    explanation: qPayload.explanation,
                    department,
                    category,
                    options: qPayload.options.map(optText => ({ text: optText }))
                });

                const savedQ = await this.questionRepo.save(question);
                const correctOpt = savedQ.options[qPayload.correctAnswerIndex];
                if (correctOpt) {
                    savedQ.correctAnswerId = correctOpt.id;
                    await this.questionRepo.save(savedQ);
                }
            }
        }
        // Create exams and their new questions under categories
        if (exams) {
            for (const examPayload of exams) {
                // for each exam question, create new Question under the specified category
                const examQuestions: Question[] = [];

                for (const qRef of examPayload.questions) {
                    const category = await this.catRepo.findOne({ where: { name: qRef.categoryName, department } });
                    if (!category) throw new Error(`Category ${qRef.categoryName} not found.`);

                    const question = this.questionRepo.create({
                        text: qRef.text,
                        difficulty: qRef.difficulty,
                        explanation: qRef.explanation,
                        department,
                        category,
                        options: qRef.options.map(optText => ({ text: optText }))
                    });

                    const savedQ = await this.questionRepo.save(question);

                    // Refresh to get saved options (they’re eagerly loaded)
                    const reloadedQ = await this.questionRepo.findOne({
                        where: { id: savedQ.id },
                        relations: ['options']
                    });

                    const correctOpt = reloadedQ?.options?.[qRef.correctAnswerIndex];
                    if (correctOpt) {
                        reloadedQ.correctAnswerId = correctOpt.id;
                        await this.questionRepo.save(reloadedQ);
                    }

                    examQuestions.push(reloadedQ!);
                }

                const exam = this.examRepo.create({
                    title: examPayload.title,
                    description: examPayload.description,
                    timeLimit: examPayload.timeLimit,
                    totalQuestions: examPayload.totalQuestions,
                    department,
                    questions: examQuestions
                });

                await this.examRepo.save(exam);
            }
        }
        return department;
    }
}
