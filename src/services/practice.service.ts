import { In } from 'typeorm';
import { AppDataSource } from '../db';
import {Practice, Question, User, UserStats, UserPractice, Category} from '../entities';

export class PracticeService {
    private practiceRepo = AppDataSource.getRepository(Practice);
    private questionRepo = AppDataSource.getRepository(Question);
    private userRepo = AppDataSource.getRepository(User);
    private userStatsRepo = AppDataSource.getRepository(UserStats);
    private userPracticeRepo = AppDataSource.getRepository(UserPractice);

    async getUserPracticeSessions(userId: string): Promise<UserPractice[]> {
        return this.userPracticeRepo.find({
            where: { userId },
            relations: ['practice'],
        });
    }

    async getPracticeSession(id: string): Promise<Practice | null> {
        return this.practiceRepo.findOne({
            where: { id },
            relations: ['questions'],
        });
    }

    async createPracticeSession(userId: string, settings: {
        categories: Category[];
        difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
        questionCount: number;
        timeLimit?: number;
    }): Promise<Practice> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        let query = this.questionRepo.createQueryBuilder('question')
            .leftJoinAndSelect('question.options', 'options');

        if (settings.difficulty !== 'mixed') {
            query = query.andWhere('question.difficulty = :difficulty', {
                difficulty: settings.difficulty,
            });
        }

        const questions = await query.getMany();
        const selectedQuestions = questions
            .sort(() => 0.5 - Math.random())
            .slice(0, settings.questionCount);

        const practice = this.practiceRepo.create({
            settings,
            questions: selectedQuestions,
        });

        const savedPractice = await this.practiceRepo.save(practice);

        const userPractice = this.userPracticeRepo.create({
            userId,
            practiceId: savedPractice.id,
            date: new Date(),
        });

        await this.userPracticeRepo.save(userPractice);

        const userStats = await this.userStatsRepo.findOne({ where: { userId } });
        if (userStats) {
            userStats.lastActivity = new Date();
            await this.userStatsRepo.save(userStats);
        }

        return savedPractice;
    }

    async submitPracticeResults(
        practiceId: string,
        userId: string,
        answers: Array<{ questionId: string; correct: boolean }>,
        timeTaken: number
    ): Promise<{ score: number; totalQuestions: number }> {
        const userPractice = await this.userPracticeRepo.findOne({
            where: { practiceId, userId },
        });

        if (!userPractice) throw new Error('Practice session not found for this user');

        const correctAnswers = answers.filter((a) => a.correct).length;
        const totalQuestions = answers.length;
        const score = (correctAnswers / totalQuestions) * 100;

        userPractice.score = score;
        userPractice.totalQuestions = totalQuestions;
        userPractice.timeTaken = timeTaken;
        userPractice.questionStatuses = answers;

        await this.userPracticeRepo.save(userPractice);

        const practice = await this.practiceRepo.findOne({
            where: { id: practiceId },
            relations: ['questions'],
        });
        if (!practice) throw new Error('Practice not found');

        const questionIds = answers.map((a) => a.questionId);
        const questions = await this.questionRepo.find({
            where: { id: In(questionIds) },
        });

        const userStats = await this.userStatsRepo.findOne({ where: { userId } });
        if (!userStats) return { score, totalQuestions };

        // Update stats
        userStats.practiceStats.totalSessions += 1;
        userStats.practiceStats.questionsAnswered += totalQuestions;
        userStats.practiceStats.correctAnswers += correctAnswers;
        userStats.practiceStats.averageAccuracy =
            userStats.practiceStats.correctAnswers / userStats.practiceStats.questionsAnswered;

        userStats.completedPractice += 1;
        userStats.correctAnswers += correctAnswers;
        userStats.totalAnswers += totalQuestions;
        userStats.lastActivity = new Date();

        const categoryMap = new Map<string, { correct: number; total: number }>();
        const difficultyMap = new Map<string, { correct: number; total: number }>();

        for (const answer of answers) {
            const question = questions.find((q) => q.id === answer.questionId);
            if (!question) continue;

            const { category, difficulty } = question;

            const cat = categoryMap.get(category.id) || { correct: 0, total: 0 };
            const diff = difficultyMap.get(difficulty) || { correct: 0, total: 0 };

            cat.total += 1;
            diff.total += 1;

            if (answer.correct) {
                cat.correct += 1;
                diff.correct += 1;
            }

            categoryMap.set(category.id, cat);
            difficultyMap.set(difficulty, diff);
        }

        // Category stats
        categoryMap.forEach((value, category) => {
            const index = userStats.practiceStats.byCategory.findIndex((c) => c.category === category);
            const accuracy = value.correct / value.total;

            if (index >= 0) {
                const existing = userStats.practiceStats.byCategory[index];
                const totalAttempted = existing.questionsAttempted + value.total;
                const totalCorrect = existing.accuracy * existing.questionsAttempted + value.correct;
                existing.questionsAttempted = totalAttempted;
                existing.accuracy = totalCorrect / totalAttempted;
            } else {
                userStats.practiceStats.byCategory.push({
                    category,
                    accuracy,
                    questionsAttempted: value.total,
                });
            }
        });

        // Difficulty stats
        difficultyMap.forEach((value, difficulty) => {
            const index = userStats.practiceStats.byDifficulty.findIndex((d) => d.difficulty === difficulty);
            const accuracy = value.correct / value.total;

            if (index >= 0) {
                const existing = userStats.practiceStats.byDifficulty[index];
                const totalAttempted = existing.questionsAttempted + value.total;
                const totalCorrect = existing.accuracy * existing.questionsAttempted + value.correct;
                existing.questionsAttempted = totalAttempted;
                existing.accuracy = totalCorrect / totalAttempted;
            } else {
                userStats.practiceStats.byDifficulty.push({
                    difficulty: difficulty as 'easy' | 'medium' | 'hard',
                    accuracy,
                    questionsAttempted: value.total,
                });
            }
        });

        // Overall progress
        userStats.overallProgress.totalPractice += 1;
        userStats.overallProgress.overallAccuracy =
            userStats.correctAnswers / userStats.totalAnswers;

        // Strengths & weaknesses
        userStats.strengths = [...userStats.practiceStats.byCategory]
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, 3);

        userStats.weaknesses = [...userStats.practiceStats.byCategory]
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 3);

        await this.userStatsRepo.save(userStats);

        return { score, totalQuestions };
    }
}
