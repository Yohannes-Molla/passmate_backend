
export interface UserStats {
    userId: string;
    examStats: ExamStats[];
    practiceStats: PracticeStats;
    overallProgress: Progress;
    strengths: CategoryPerformance[];
    weaknesses: CategoryPerformance[];
}

export interface ExamStats {
    examId: string;
    attempts: number;
    bestScore: number;
    averageScore: number;
    lastAttemptDate: string;
}

export interface PracticeStats {
    totalSessions: number;
    questionsAnswered: number;
    correctAnswers: number;
    averageAccuracy: number;
    byCategory: CategoryPerformance[];
    byDifficulty: DifficultyPerformance[];
}

export interface CategoryPerformance {
    category: string;
    accuracy: number;
    questionsAttempted: number;
}

export interface DifficultyPerformance {
    difficulty: 'easy' | 'medium' | 'hard';
    accuracy: number;
    questionsAttempted: number;
}

export interface Progress {
    totalExams: number;
    examsPassed: number;
    totalPractice: number;
    overallAccuracy: number;
}

// Define interface for the new unified UserStat (maintaining compatibility)
export interface UnifiedUserStat {
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
        examStats: ExamStats[];
        practiceStats: PracticeStats;
        overallProgress: Progress;
        strengths: CategoryPerformance[];
        weaknesses: CategoryPerformance[];
    };
}
