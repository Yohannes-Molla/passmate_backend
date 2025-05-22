// services/question.service.ts (extended)
import { AppDataSource } from '../db';
import { Question, Option } from '../entities';

export class QuestionService {
    private questionRepository = AppDataSource.getRepository(Question);

    async getAllQuestions(departmentId?: string): Promise<Question[]> {
        return this.questionRepository.find({
            where: departmentId ? { department: { id: departmentId } } : {},
            relations: ['options', 'department'],
        });
    }

    async getQuestionById(id: string): Promise<Question | null> {
        return this.questionRepository.findOne({
            where: { id },
            relations: ['options', 'department'],
        });
    }

    async getQuestionsByCategory(category: string, departmentId?: string): Promise<Question[]> {
        return this.questionRepository.find({
            where: departmentId
                ? { categoryId: category, department: { id: departmentId } }
                : { categoryId: category },
            relations: ['options', 'department'],
        });
    }

    async getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard', departmentId?: string): Promise<Question[]> {
        return this.questionRepository.find({
            where: departmentId
                ? { difficulty, department: { id: departmentId } }
                : { difficulty },
            relations: ['options', 'department'],
        });
    }

    async addQuestionsBulk(questionsData: Array<{
        text: string;
        categoryId: string;
        difficulty: 'easy' | 'medium' | 'hard';
        explanation: string;
        correctAnswerIndex: number;
        departmentId: string;
        options: string[];
    }>): Promise<Question[]> {
        const questions = questionsData.map(q => {
            const question = new Question();
            question.text = q.text;
            question.categoryId = q.categoryId;
            question.difficulty = q.difficulty;
            question.explanation = q.explanation;
            question.department = { id: q.departmentId } as any;

            question.options = q.options.map((optionText, idx) => {
                const option = new Option();
                option.text = optionText;
                return option;
            });

            // temporarily assign correctAnswerId using index, resolved after save
            const correctAnswerIndex = q.correctAnswerIndex;
            (question as any)._correctAnswerIndex = correctAnswerIndex;

            return question;
        });

        const savedQuestions = await this.questionRepository.save(questions);

        // resolve correctAnswerId after options are saved with IDs
        for (const question of savedQuestions) {
            const correctIndex = (question as any)._correctAnswerIndex;
            if (question.options && question.options[correctIndex]) {
                question.correctAnswerId = question.options[correctIndex].id;
            }
        }

        return this.questionRepository.save(savedQuestions);
    }
}
