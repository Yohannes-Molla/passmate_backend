
import { UserStat } from "../types/user.types";
import { users } from "./users";
import { userProgress } from "./users";
import { userStats } from "./stats";

// Create combined UserStat objects from existing data sources
export const unifiedUserStats: UserStat[] = users.map(user => {
    // Find corresponding progress
    const progress = userProgress.find(p => p.userId === user.id);
    // Find corresponding stats
    const stats = userStats.find(s => s.userId === user.id);
    
    return {
        userId: user.id,
        profile: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatarUrl: null,
            role: user.role,
            createdAt: user.createdAt
        },
        subscription: user.subscription,
        progress: {
            completedPractice: progress?.completedPractice || 0,
            completedExams: progress?.completedExams || 0,
            correctAnswers: progress?.totalCorrect || 0,
            totalAnswers: progress?.totalQuestions || 0,
            streakDays: 0, // Default value
            lastActivity: null,
            answeredQuestions: [], // We would need to build this from actual answer data
            lastExamStart: null,
            lastExamEnd: null
        },
        stats: stats ? {
            examStats: stats.examStats,
            practiceStats: stats.practiceStats,
            overallProgress: stats.overallProgress,
            strengths: stats.strengths,
            weaknesses: stats.weaknesses
        } : {
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
            weaknesses: []
        }
    };
});

// Helper function to get unified user stats by ID
export function getUserStatById(userId: string): UserStat | undefined {
    return unifiedUserStats.find(us => us.userId === userId);
}
