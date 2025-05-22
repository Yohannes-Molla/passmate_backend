
import { AppDataSource } from '../db';
import { Department } from '../entities';

export class DepartmentRepository{
    private repo = AppDataSource.getRepository(Department);
    findWithQuestions(id: string): Promise<Department | undefined | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['questions', 'questions.options']
        });
    }
}
