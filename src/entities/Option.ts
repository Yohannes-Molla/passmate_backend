
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './Question';

@Entity('options')
export class Option {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text' })
    text!: string;

    @ManyToOne(() => Question, q => q.options, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'questionId' })
    question!: Question;

    @Column({ type: 'uuid' })
    questionId!: string;
}
