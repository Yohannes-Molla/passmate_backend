
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Practice } from './Practice';

@Entity('user_practices')
export class UserPractice {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User, user => user.practices)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    userId!: string;

    @ManyToOne(() => Practice)
    @JoinColumn({ name: 'practiceId' })
    practice!: Practice;

    @Column()
    practiceId!: string;

    @CreateDateColumn()
    date!: Date;

    @Column({ nullable: true })
    score!: number;

    @Column({ nullable: true })
    totalQuestions!: number;

    @Column({ nullable: true })
    timeTaken!: number;

    @Column({ type: 'json', nullable: true })
    questionStatuses!: {
        questionId: string;
        correct: boolean;
    }[];
}
