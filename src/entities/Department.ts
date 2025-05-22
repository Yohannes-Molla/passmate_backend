// src/entities/Department.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';
import { Exam } from './Exam';
import { Question } from './Question';
import {Category} from "./Category";


@Entity('departments')
export class Department {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @OneToMany(() => User, user => user.department)
    users!: User[];

    @OneToMany(() => Exam, exam => exam.department)
    exams!: Exam[];

    @OneToMany(() => Question, question => question.department)
    questions!: Question[];

    @OneToMany(() => Category, category => category.department, {
        cascade: true,    // optionally auto-save new categories
        eager: true       // automatically load them
    })
    categories!: Category[];
}
