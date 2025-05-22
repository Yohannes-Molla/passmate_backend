
import { AppDataSource } from '../db';
import { Category } from '../entities';

export class CategoryRepository{
    private repo = AppDataSource.getRepository(Category);
    findWithQuestions(id: string): Promise<Category | undefined | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['questions', 'questions.options']
        });
    }
}
