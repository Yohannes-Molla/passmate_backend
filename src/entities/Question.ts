
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Option } from './Option';
import { Department } from './Department';
import { Category } from './Category';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text' })
    text!: string;

    @Column('uuid', {nullable: true})
    categoryId!: string;

    @ManyToOne(() => Category, cat => cat.questions, {
        nullable: false,
        eager: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'categoryId' })
    category!: Category;

    @Column({
        type: 'enum',
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    })
    difficulty!: 'easy' | 'medium' | 'hard';

    @Column({ type: 'text' })
    explanation!: string;

    @Column({nullable: true})
    correctAnswerId!: string;

    @OneToMany(() => Option, option => option.question, { cascade: true, eager: true })
    options!: Option[];

    @ManyToOne(() => Department, department => department.questions, { eager: true })
    department!: Department;
}
