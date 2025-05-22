
import { AppDataSource } from '../db';
import { UserStats } from '../entities';

export class UserStatsRepository  {
    private repo = AppDataSource.getRepository(UserStats);
    findByUserId(userId: string): Promise<UserStats | undefined | null> {
        return this.repo.findOne({ where: { userId } });
    }
}
