import { Request, Response } from 'express';
import { QuestionService } from '../services';
import { sendSuccess, sendError } from '../utils/response';

export const questionsController = {
    // Get all questions
    getAllQuestions: async (req: Request, res: Response) => {
        try {
            const { departmentId } = req.query;
            const questionService = new QuestionService();
            const questions = await questionService.getAllQuestions(departmentId as string | undefined);

            return res.status(200).json({
                success: true,
                data: questions,
            });
        } catch (error) {
            return sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get a question by ID
    getQuestionById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const questionService = new QuestionService();
            const question = await questionService.getQuestionById(id);

            if (!question) {
                return sendError(res, `Question with ID ${id} not found`, 404);
            }

            return res.status(200).json({
                success: true,
                data: question,
            });
        } catch (error) {
            return sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get questions by category
    getQuestionsByCategory: async (req: Request, res: Response) => {
        try {
            const { category } = req.params;
            const { departmentId } = req.query;
            const questionService = new QuestionService();
            const filteredQuestions = await questionService.getQuestionsByCategory(
                category,
                departmentId as string | undefined
            );

            return res.status(200).json({
                success: true,
                data: filteredQuestions,
            });
        } catch (error) {
            return sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get questions by difficulty
    getQuestionsByDifficulty: async (req: Request, res: Response) => {
        try {
            const { difficulty } = req.params;
            const { departmentId } = req.query;
            const questionService = new QuestionService();
            const filteredQuestions = await questionService.getQuestionsByDifficulty(
                difficulty as 'easy' | 'medium' | 'hard',
                departmentId as string | undefined
            );

            return res.status(200).json({
                success: true,
                data: filteredQuestions,
            });
        } catch (error) {
            return sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Add questions in bulk
    addQuestionsBulk: async (req: Request, res: Response) => {
        try {
            const questions = req.body;

            if (!Array.isArray(questions) || questions.length === 0) {
                return sendError(res, 'Request body must be a non-empty array of questions', 400);
            }

            const questionService = new QuestionService();
            const createdQuestions = await questionService.addQuestionsBulk(questions);

            return sendSuccess(res, createdQuestions, 201);
        } catch (error) {
            return sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    }
};
