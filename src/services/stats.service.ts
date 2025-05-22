import { AppDataSource } from '../db'; // make sure this is your DataSource instance
import { UserStats } from '../entities';

export class StatsService {
    private userStatsRepository = AppDataSource.getRepository(UserStats);

    async getUserStats(userId: string): Promise<UserStats | null> {
        return this.userStatsRepository.findOne({ where: { userId } });
    }

    async getExamStats(userId: string, examId: string): Promise<any | null> {
        const userStats = await this.getUserStats(userId);
        if (!userStats) return null;

        return userStats.examStats.find(e => e.examId === examId) || null;
    }

    async getCategoryStats(userId: string, category: string): Promise<any | null> {
        const userStats = await this.getUserStats(userId);
        if (!userStats) return null;

        return userStats.practiceStats.byCategory.find(
            c => c.category.toLowerCase() === category.toLowerCase()
        ) || null;
    }

    async getUnifiedUserStats(userId: string): Promise<UserStats | null> {
        return this.getUserStats(userId);
    }
}
