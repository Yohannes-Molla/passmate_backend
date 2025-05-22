import { Request, Response } from 'express';
import { ExamService } from '../services';
import { sendSuccess, sendError } from '../utils/response';

export const examController = {
    // Get all exams (optionally filter by department)
    getExam: async (req: Request, res: Response) => {
        try {
            const { department } = req.query;
            const { id } = req.params;
            const examService = new ExamService();
            const exam = await examService.getExam(department?.toString(), id?.toString());

            // wrap array under a key
            res.status(200).json({
                success: true,
                data: exam,
            });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get single exam by id
    getExamById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const examService = new ExamService();
            const exam = await examService.getExamById(id);

            if (!exam) {
                return sendError(res, 'Exam not found', 404);
            }

            sendSuccess(res, exam);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get questions for specific exam (optionally check department match)
    getExamQuestions: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { department } = req.query;
            const examService = new ExamService();
            const exam = await examService.getExamWithQuestions(id, department?.toString());

            if (!exam) {
                return sendError(res, 'Exam not found or does not belong to the department', 404);
            }

            res.status(200).json({
                success: true,
                data: exam.questions,
            });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Submit exam results
    submitExam: async (req: Request, res: Response) => {
        try {
            const { examId, userId, answers, timeTaken, department } = req.body;
            const examService = new ExamService();
            const result = await examService.submitExamResults(
                examId,
                userId,
                answers,
                timeTaken,
                department
            );

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },
};
