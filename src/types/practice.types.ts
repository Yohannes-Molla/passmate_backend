export interface PracticeSession {
    id: string;
    userId: string;
    questions: string[]; // question ids
    settings: PracticeSettings;
    date: string;
    results?: PracticeResults;
}

export interface PracticeSettings {
    categories: string[];
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    questionCount: number;
    timeLimit?: number; // optional time limit in minutes
}

export interface PracticeResults {
    score: number;
    totalQuestions: number;
    timeTaken: number; // in seconds
    questionStatuses: { questionId: string, correct: boolean }[];
}
