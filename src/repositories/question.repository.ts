
import { AppDataSource } from '../db';
import { Question } from '../entities/Question';

export class QuestionRepository {
    private repo = AppDataSource.getRepository(Question);
    findByCategory(category: string): Promise<Question[]> {
        return this.repo.find({
            where: { category },
            relations: ['options']
        });
    }

    findByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<Question[]> {
        return this.repo.find({
            where: { difficulty },
            relations: ['options']
        });
    }
}
