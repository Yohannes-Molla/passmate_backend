
import { AppDataSource } from '../db';
import { Exam } from '../entities';

export class ExamRepository{
    private repo = AppDataSource.getRepository(Exam);
    findWithQuestions(id: string): Promise<Exam | undefined | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['questions', 'questions.options']
        });
    }
}
