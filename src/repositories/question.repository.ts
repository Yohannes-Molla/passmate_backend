
import { AppDataSource } from '../db';
import { Question } from '../entities';

export class QuestionRepository {
    private repo = AppDataSource.getRepository(Question);
}
