import { PracticeSession } from '../types/practice.types';

export const practiceSessions: PracticeSession[] = [
    {
        id: "practice1",
        userId: "user1",
        questions: ["q1", "q2", "q5"],
        settings: {
            categories: ["React Basics", "React Hooks"],
            difficulty: "easy",
            questionCount: 3
        },
        date: "2024-04-15T14:30:00Z",
        results: {
            score: 2,
            totalQuestions: 3,
            timeTaken: 420, // 7 minutes
            questionStatuses: [
                { questionId: "q1", correct: true },
                { questionId: "q2", correct: true },
                { questionId: "q5", correct: false }
            ]
        }
    },
    {
        id: "practice2",
        userId: "user1",
        questions: ["q3", "q4"],
        settings: {
            categories: ["TypeScript", "React Performance"],
            difficulty: "medium",
            questionCount: 2
        },
        date: "2024-04-16T10:15:00Z",
        results: {
            score: 1,
            totalQuestions: 2,
            timeTaken: 300, // 5 minutes
            questionStatuses: [
                { questionId: "q3", correct: false },
                { questionId: "q4", correct: true }
            ]
        }
    }
];