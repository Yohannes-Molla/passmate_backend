
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Question } from './Question';
import { UserExam } from './UserExam';
import { Department } from './Department';

@Entity('exams')
export class Exam {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column()
    timeLimit!: number;

    @Column()
    totalQuestions!: number;

    @ManyToMany(() => Question)
    @JoinTable({
        name: 'exam_questions',
        joinColumn: { name: 'examId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'questionId', referencedColumnName: 'id' }
    })
    questions!: Question[];

    @OneToMany(() => UserExam, userExam => userExam.exam)
    userExams!: UserExam[];

    @ManyToOne(() => Department, department => department.exams, { eager: true })
    department!: Department;
}
