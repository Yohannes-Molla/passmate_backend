
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { UserExam } from './UserExam';
import { UserPractice } from './UserPractice';
import { Department } from './Department';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: ['user', 'admin'],
        default: 'user'
    })
    role: 'user' | 'admin';

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'boolean', default: true })
    subscriptionActive: boolean;

    @Column({
        type: 'enum',
        enum: ['free', 'premium', 'pro'],
        default: 'free'
    })
    subscriptionPlan: 'free' | 'premium' | 'pro';

    @Column({ nullable: true })
    subscriptionExpiresAt: Date;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @OneToMany(() => UserExam, userExam => userExam.user)
    exams: UserExam[];

    @OneToMany(() => UserPractice, userPractice => userPractice.user)
    practices: UserPractice[];

    @ManyToOne(() => Department, department => department.users, { eager: true, nullable: true })
    department: Department | null;
}
