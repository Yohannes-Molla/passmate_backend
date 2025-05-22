
import { AppDataSource } from '../db';
import { Practice } from '../entities';

export class PracticeRepository{
    private repo = AppDataSource.getRepository(Practice);
    findWithQuestions(id: string): Promise<Practice | undefined | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['questions', 'questions.options']
        });
    }
}
