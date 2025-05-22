
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Exam } from './Exam';

@Entity('user_exams')
export class UserExam {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, user => user.exams)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    userId!: string;

    @ManyToOne(() => Exam, exam => exam.userExams)
    @JoinColumn({ name: 'examId' })
    exam!: Exam;

    @Column()
    examId!: string;

    @Column({ type: 'float' })
    score!: number;

    @Column()
    timeTaken!: number;

    @CreateDateColumn()
    takenAt!: Date;

    @Column({ type: 'json' })
    answers!: {
        questionId: string;
        selectedOptionId: string;
        isCorrect: boolean;
    }[];
}
