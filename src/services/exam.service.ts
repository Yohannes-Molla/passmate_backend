// services/exam.service.ts
import {AppDataSource} from '../db';
import {Exam, User, UserExam, UserStats} from '../entities';
import {In, Not} from "typeorm";

export class ExamService {
    private examRepo = AppDataSource.getRepository(Exam);
    private userRepo = AppDataSource.getRepository(User);
    private userExamRepo = AppDataSource.getRepository(UserExam);
    private userStatsRepo = AppDataSource.getRepository(UserStats);

    /** Get all exams, optionally filtered by departmentId */
    async getExam(departmentId?: string, id?: string): Promise<Exam | null> {

        // Get exam IDs the user has already taken
        const userExams = await this.userExamRepo.find({
            where: { userId: id },
            select: ['examId'],
        });

        const takenExamIds = userExams.map(ue => ue.examId);
        // Get exams that match the department and were not taken by the user
        return await this.examRepo.findOne({
            where: {
                id: takenExamIds.length > 0 ? Not(In(takenExamIds)) : undefined,
                department: {id: departmentId},
            },
            relations: ['department', 'questions'],
        });
    }

    /** Get a single exam by ID (always loads department) */
    async getExamById(id: string): Promise<Exam | null> {
        return this.examRepo.findOne({
            where: { id },
            relations: ['department'],
        });
    }

    /**
     * Load an exam with its questions and options,
     * and optionally ensure it belongs to a given department
     */
    async getExamWithQuestions(
        id: string,
        departmentId?: string
    ): Promise<Exam | null> {
        const exam = await this.examRepo.findOne({
            where: { id },
            relations: ['department', 'questions', 'questions.options'],
        });

        if (!exam) return null;
        if (departmentId && exam.department.id !== departmentId) {
            return null;
        }
        return exam;
    }

    /**
     * Submit an exam: calculates score, saves UserExam,
     * and updates UserStats, enforcing department if provided.
     */
    async submitExamResults(
        examId: string,
        userId: string,
        answers: Array<{
            questionId: string;
            selectedOptionId: string;
            isCorrect: boolean;
        }>,
        timeTaken: number,
        departmentId?: string
    ): Promise<{ id: string; score: number }> {
        // 1. Load exam (with department) and validate
        const exam = await this.examRepo.findOne({
            where: { id: examId },
            relations: ['department'],
        });
        if (!exam) throw new Error('Exam not found');
        if (departmentId && exam.department.id !== departmentId) {
            throw new Error('Exam does not belong to the provided department');
        }

        // 2. Load user
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new Error('User not found');

        // 3. Calculate score
        const correctCount = answers.filter(a => a.isCorrect).length;
        const total = answers.length;
        const score = (correctCount / total) * 100;

        // 4. Save UserExam
        const ue = this.userExamRepo.create({
            user,
            exam,
            score,
            timeTaken,
            answers,
        });
        const savedUE = await this.userExamRepo.save(ue);

        // 5. Update UserStats
        const stats = await this.userStatsRepo.findOne({
            where: { user: { id: userId } },
        });
        if (stats) {
            // update per-exam stats
            const idx = stats.examStats.findIndex(es => es.examId === examId);
            if (idx >= 0) {
                const es = stats.examStats[idx];
                es.attempts += 1;
                es.bestScore = Math.max(es.bestScore, score);
                es.averageScore =
                    (es.averageScore * (es.attempts - 1) + score) / es.attempts;
                es.lastAttemptDate = new Date();
                stats.examStats[idx] = es;
            } else {
                stats.examStats.push({
                    examId,
                    attempts: 1,
                    bestScore: score,
                    averageScore: score,
                    lastAttemptDate: new Date(),
                });
            }

            // update overall stats
            stats.completedExams += 1;
            stats.correctAnswers += correctCount;
            stats.totalAnswers += total;
            stats.overallProgress.totalExams += 1;
            if (score >= 70) stats.overallProgress.examsPassed += 1;
            stats.overallProgress.overallAccuracy =
                stats.correctAnswers / stats.totalAnswers;
            stats.lastExamEnd = new Date();
            stats.lastActivity = new Date();

            await this.userStatsRepo.save(stats);
        }

        return { id: savedUE.id, score };
    }
}
