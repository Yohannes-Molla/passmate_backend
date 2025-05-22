
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Question } from './Question';
import {Category} from "./Category";

@Entity('practices')
export class Practice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'json' })
    settings: {
        categories: Category[];
        difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
        questionCount: number;
        timeLimit?: number;
    };

    @ManyToMany(() => Question)
    @JoinTable({
        name: 'practice_questions',
        joinColumn: { name: 'practiceId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'questionId', referencedColumnName: 'id' }
    })
    questions: Question[];
}
