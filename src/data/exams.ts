import { Exam } from '../types/exam.types';

export const exams: Exam[] = [
    {
        id: "exam1",
        title: "React Fundamentals",
        description: "Test your knowledge of React core concepts and basic principles",
        timeLimit: 30, // 30 minutes
        questions: ["q1", "q2", "q4", "q5"],
        totalQuestions: 4
    },
    {
        id: "exam2",
        title: "Advanced TypeScript",
        description: "Challenging questions about TypeScript's more complex features",
        timeLimit: 45, // 45 minutes
        questions: ["q3", "q5"],
        totalQuestions: 2
    },
    {
        id: "exam3",
        title: "Full Stack Development",
        description: "Comprehensive assessment of frontend and backend technologies",
        timeLimit: 60, // 60 minutes
        questions: ["q1", "q2", "q3", "q4", "q5"],
        totalQuestions: 5
    }
];