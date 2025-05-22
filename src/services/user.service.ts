import { AppDataSource } from '../db';
import {Question, User} from '../entities';
import { UserStats } from '../entities';
import { Department } from '../entities';
import bcrypt from 'bcrypt';
import { UserStat as UnifiedUserStats } from "../types/user.types";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);
    private userStatsRepository = AppDataSource.getRepository(UserStats);
    private deptRepository = AppDataSource.getRepository(Department);
    private questionRepository = AppDataSource.getRepository(Question);

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id }, relations: ['department'] });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email }, relations: ['department'] });
    }

    async createUser(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string;
        departmentId?: string;
    }): Promise<User> {
        const { email, password, firstName, lastName, phoneNumber, departmentId } = userData;

        const existingUser = await this.findByEmail(email);
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            username: email.split('@')[0],
            firstName,
            lastName,
            phoneNumber,
            role: 'user',
            createdAt: new Date(),
            subscriptionActive: true,
            subscriptionPlan: 'free',
            department: departmentId
                ? await this.deptRepository.findOneBy({ id: departmentId })
                : undefined,
        });

        await this.userRepository.save(user);

        const userStats = this.userStatsRepository.create({
            userId: user.id,
            examStats: [],
            practiceStats: {
                totalSessions: 0,
                questionsAnswered: 0,
                correctAnswers: 0,
                averageAccuracy: 0,
                byCategory: [],
                byDifficulty: []
            },
            overallProgress: {
                totalExams: 0,
                examsPassed: 0,
                totalPractice: 0,
                overallAccuracy: 0
            },
            strengths: [],
            weaknesses: [],
            completedPractice: 0,
            completedExams: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            streakDays: 0,
            answeredQuestions: []
        });

        await this.userStatsRepository.save(userStats);

        return user;
    }

    async updateUser(id: string, userData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        avatarUrl?: string;
        departmentId?: string;
    }): Promise<User> {
        const user = await this.findById(id);
        if (!user) throw new Error('User not found');

        if (userData.departmentId) {
            user.department = await this.deptRepository.findOneBy({ id: userData.departmentId });
        }

        Object.assign(user, {
            firstName: userData.firstName ? userData.firstName : user.firstName,
            lastName: userData.lastName ? userData.lastName : user.lastName,
            email: userData.email ? userData.email : user.email,
            phoneNumber: userData.phoneNumber ? userData.phoneNumber : user.phoneNumber,
            avatarUrl: userData.avatarUrl ? userData.avatarUrl : user.avatarUrl
        });

        return this.userRepository.save(user);
    }

    async updateUserProgress(userId: string, updatedData: Partial<UserStats>): Promise<UserStats> {
        const userStats = await this.userStatsRepository.findOne({ where: { userId } });

        if (!userStats) {
            throw new Error('UserStats not found for userId: ' + userId);
        }
// Convert timestamps to Date objects if needed
        if (updatedData.lastActivity && typeof updatedData.lastActivity === 'number') {
            updatedData.lastActivity = new Date(updatedData.lastActivity);
        }

        if (updatedData.lastExamStart && typeof updatedData.lastExamStart === 'number') {
            updatedData.lastExamStart = new Date(updatedData.lastExamStart);
        }

        if (updatedData.lastExamEnd && typeof updatedData.lastExamEnd === 'number') {
            updatedData.lastExamEnd = new Date(updatedData.lastExamEnd);
        }
        // Merge updated fields
        const updated = this.userStatsRepository.merge(userStats, updatedData);
        return await this.userStatsRepository.save(updated);
    }

    async checkSubmittedAnswer(questionId: string, selectedOptionId: string): Promise<boolean> {
        const question = await this.questionRepository.findOne({ where: { id: questionId } });

        if (!question) {
            throw new Error('Question not found');
        }
        return question.correctAnswerId == selectedOptionId;
    }

    async validateCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'firstName', 'lastName', 'role']
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        return isValid ? user : null;
    }

    async getUserProgress(userId: string): Promise<UserStats | null> {
        return this.userStatsRepository.findOne({ where: { userId } });
    }

    async getUserUnifiedStat(userId: string): Promise<UnifiedUserStats | null> {
        return this.mapToUnifiedUserStat(
            await this.findById(userId),
            await this.getUserProgress(userId)
        );
    }

    mapToUnifiedUserStat(user: User | null, userStats: UserStats | null): UnifiedUserStats | null {
        if (user && userStats) {
            return {
                userId: user.id,
                profile: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    avatarUrl: user.avatarUrl ?? null,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    createdAt: user.createdAt.toISOString(),
                },
                subscription: {
                    active: user.subscriptionActive,
                    plan: user.subscriptionPlan,
                    expiresAt: user.subscriptionExpiresAt?.toISOString(),
                },
                progress: {
                    completedPractice: userStats.completedPractice,
                    completedExams: userStats.completedExams,
                    correctAnswers: userStats.correctAnswers,
                    totalAnswers: userStats.totalAnswers,
                    streakDays: userStats.streakDays,
                    lastActivity: userStats.lastActivity ? userStats.lastActivity.getTime() : null,
                    answeredQuestions: userStats.answeredQuestions ?? [],
                    lastExamStart: userStats.lastExamStart ? userStats.lastExamStart.getTime() : null,
                    lastExamEnd: userStats.lastExamEnd ? userStats.lastExamEnd.getTime() : null,
                },
                stats: {
                    examStats: (userStats.examStats ?? []).map(stat => ({
                        ...stat,
                        lastAttemptDate: new Date(stat.lastAttemptDate).toISOString(),
                    })),
                    practiceStats: userStats.practiceStats,
                    overallProgress: userStats.overallProgress,
                    strengths: userStats.strengths ?? [],
                    weaknesses: userStats.weaknesses ?? [],
                },
            };
        }
        return null;
    }
}
