export interface Question {
    id: string;
    text: string;
    options: Option[];
    correctAnswer: string;
    explanation: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Option {
    id: string;
    text: string;
}

export interface Exam {
    id: string;
    title: string;
    description: string;
    timeLimit: number; // in minutes
    questions: string[]; // question ids
    totalQuestions: number;
}

export interface QuestionStatus {
    questionId: string;
    status: 'answered' | 'flagged' | 'seen' | 'unseen';
    selectedOption?: string;
}

export interface ExamResult {
    id: string;
    examId: string;
    userId: string;
    score: number;
    totalQuestions: number;
    timeTaken: number; // in seconds
    date: string;
    questionStatuses: QuestionStatus[];
}