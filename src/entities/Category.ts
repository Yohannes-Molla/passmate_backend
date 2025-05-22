import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Department } from './Department';
import { Question } from './Question';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Department, dept => dept.categories, {
        nullable: false,
        onDelete: 'CASCADE',
        eager: false,
    })
    @JoinColumn({ name: 'departmentId' })
    department: Department;

    @Column('uuid')
    departmentId: string;

    @OneToMany(() => Question, question => question.category, {
        cascade: true,
    })
    questions: Question[];
}
