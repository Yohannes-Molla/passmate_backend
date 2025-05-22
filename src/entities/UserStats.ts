
import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User';

@Entity('user_stats')
export class UserStats {
    @PrimaryColumn()
    userId: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'json' })
    examStats: {
        examId: string;
        attempts: number;
        bestScore: number;
        averageScore: number;
        lastAttemptDate: Date;
    }[];

    @Column({ type: 'json' })
    practiceStats: {
        totalSessions: number;
        questionsAnswered: number;
        correctAnswers: number;
        averageAccuracy: number;
        byCategory: {
            category: string;
            accuracy: number;
            questionsAttempted: number;
        }[];
        byDifficulty: {
            difficulty: 'easy' | 'medium' | 'hard';
            accuracy: number;
            questionsAttempted: number;
        }[];
    };

    @Column({ type: 'json' })
    overallProgress: {
        totalExams: number;
        examsPassed: number;
        totalPractice: number;
        overallAccuracy: number;
    };

    @Column({ type: 'json' })
    strengths: {
        category: string;
        accuracy: number;
        questionsAttempted: number;
    }[];

    @Column({ type: 'json' })
    weaknesses: {
        category: string;
        accuracy: number;
        questionsAttempted: number;
    }[];

    @Column({ default: 0 })
    completedPractice: number;

    @Column({ default: 0 })
    completedExams: number;

    @Column({ default: 0 })
    correctAnswers: number;

    @Column({ default: 0 })
    totalAnswers: number;

    @Column({ default: 0 })
    streakDays: number;

    @Column({ nullable: true, type: 'timestamp' })
    lastActivity: any;

    @Column({ type: 'json' })
    answeredQuestions: {
        questionId: string;
        selectedOptionId: string;
        isCorrect: boolean;
        timestamp: number;
    }[];

    @Column({ nullable: true, type: 'timestamp' })
    lastExamStart: any;

    @Column({ nullable: true, type: 'timestamp' })
    lastExamEnd: any;
}
