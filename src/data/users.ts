import { User, UserProgress } from '../types/user.types';

export const users: User[] = [
    {
        id: "user1",
        email: "john@example.com",
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        createdAt: "2024-04-15T10:30:00Z",
        subscription: {
            active: true,
            plan: "premium",
            expiresAt: "2025-04-15T10:30:00Z"
        }
    },
    {
        id: "user2",
        email: "jane@example.com",
        username: "janesmith",
        firstName: "Jane",
        lastName: "Smith",
        role: "admin",
        createdAt: "2024-03-10T14:15:00Z",
        subscription: {
            active: true,
            plan: "pro",
            expiresAt: "2025-03-10T14:15:00Z"
        }
    }
];

export const userProgress: UserProgress[] = [
    {
        userId: "user1",
        completedExams: 2,
        completedPractice: 5,
        totalCorrect: 15,
        totalQuestions: 20,
        strengths: ["React Basics", "React Hooks"],
        weaknesses: ["TypeScript", "React Performance"]
    },
    {
        userId: "user2",
        completedExams: 3,
        completedPractice: 8,
        totalCorrect: 25,
        totalQuestions: 28,
        strengths: ["TypeScript", "React Performance"],
        weaknesses: ["React Hooks"]
    }
];
