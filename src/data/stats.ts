import { UserStats, CategoryPerformance, DifficultyPerformance } from '../types/stats.types';

export const userStats: UserStats[] = [
    {
        userId: "user1",
        examStats: [
            {
                examId: "exam1",
                attempts: 2,
                bestScore: 85,
                averageScore: 80,
                lastAttemptDate: "2024-04-20T15:30:00Z"
            },
            {
                examId: "exam2",
                attempts: 1,
                bestScore: 70,
                averageScore: 70,
                lastAttemptDate: "2024-04-18T11:20:00Z"
            }
        ],
        practiceStats: {
            totalSessions: 5,
            questionsAnswered: 25,
            correctAnswers: 18,
            averageAccuracy: 72,
            byCategory: [
                {
                    category: "React Basics",
                    accuracy: 90,
                    questionsAttempted: 8
                },
                {
                    category: "React Hooks",
                    accuracy: 85,
                    questionsAttempted: 7
                },
                {
                    category: "TypeScript",
                    accuracy: 60,
                    questionsAttempted: 5
                },
                {
                    category: "React Performance",
                    accuracy: 40,
                    questionsAttempted: 5
                }
            ],
            byDifficulty: [
                {
                    difficulty: "easy",
                    accuracy: 90,
                    questionsAttempted: 10
                },
                {
                    difficulty: "medium",
                    accuracy: 65,
                    questionsAttempted: 10
                },
                {
                    difficulty: "hard",
                    accuracy: 40,
                    questionsAttempted: 5
                }
            ]
        },
        overallProgress: {
            totalExams: 2,
            examsPassed: 1,
            totalPractice: 5,
            overallAccuracy: 75
        },
        strengths: [
            {
                category: "React Basics",
                accuracy: 90,
                questionsAttempted: 8
            },
            {
                category: "React Hooks",
                accuracy: 85,
                questionsAttempted: 7
            }
        ],
        weaknesses: [
            {
                category: "React Performance",
                accuracy: 40,
                questionsAttempted: 5
            },
            {
                category: "TypeScript",
                accuracy: 60,
                questionsAttempted: 5
            }
        ]
    }
];
