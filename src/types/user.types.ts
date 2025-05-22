
export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: string;
    subscription: SubscriptionStatus;
}

export interface SubscriptionStatus {
    active: boolean;
    plan: 'free' | 'premium' | 'pro';
    expiresAt?: string;
}

export interface UserProgress {
    userId: string;
    completedExams: number;
    completedPractice: number;
    totalCorrect: number;
    totalQuestions: number;
    strengths: string[];
    weaknesses: string[];
}

// New unified UserStat interface that combines all user information
export interface UserStat {
    userId: string;
    profile: {
        name: string;
        email: string;
        avatarUrl: string | null;
        phoneNumber?: string;
        role?: 'user' | 'admin';
        createdAt?: string;
    };
    subscription: {
        active: boolean;
        plan: 'free' | 'premium' | 'pro';
        expiresAt?: string;
    };
    progress: {
        completedPractice: number;
        completedExams: number;
        correctAnswers: number;
        totalAnswers: number;
        streakDays: number;
        lastActivity: number | null;
        answeredQuestions: Array<{
            questionId: string;
            selectedOptionId: string;
            isCorrect: boolean;
            timestamp: number;
        }>;
        lastExamStart: number | null;
        lastExamEnd: number | null;
    };
    stats: {
        examStats: Array<{
            examId: string;
            attempts: number;
            bestScore: number;
            averageScore: number;
            lastAttemptDate: string;
        }>;
        practiceStats: {
            totalSessions: number;
            questionsAnswered: number;
            correctAnswers: number;
            averageAccuracy: number;
            byCategory: Array<{
                category: string;
                accuracy: number;
                questionsAttempted: number;
            }>;
            byDifficulty: Array<{
                difficulty: 'easy' | 'medium' | 'hard';
                accuracy: number;
                questionsAttempted: number;
            }>;
        };
        overallProgress: {
            totalExams: number;
            examsPassed: number;
            totalPractice: number;
            overallAccuracy: number;
        };
        strengths: Array<{
            category: string;
            accuracy: number;
            questionsAttempted: number;
        }>;
        weaknesses: Array<{
            category: string;
            accuracy: number;
            questionsAttempted: number;
        }>;
    };
}
