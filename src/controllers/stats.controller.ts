import { Request, Response } from 'express';
import { StatsService } from '../services';
import { sendSuccess, sendError } from '../utils/response';

const statsService = new StatsService();

export const statsController = {
    // Get user statistics
    getUserStats: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const stats = await statsService.getUserStats(userId);
            if (!stats) {
                return sendError(res, 'Statistics not found for this user', 404);
            }
            sendSuccess(res, stats);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get exam statistics
    getExamStats: async (req: Request, res: Response) => {
        try {
            const { userId, examId } = req.params;
            const examStat = await statsService.getExamStats(userId, examId);
            if (!examStat) {
                return sendError(res, 'Exam statistics not found', 404);
            }
            sendSuccess(res, examStat);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get category performance
    getCategoryStats: async (req: Request, res: Response) => {
        try {
            const { userId, category } = req.params;
            const categoryStats = await statsService.getCategoryStats(userId, category);
            if (!categoryStats) {
                return sendError(res, 'Category statistics not found', 404);
            }
            sendSuccess(res, categoryStats);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get unified user statistics
    getUnifiedUserStats: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const unifiedStat = await statsService.getUnifiedUserStats(userId);
            if (!unifiedStat) {
                return sendError(res, 'Unified statistics not found for this user', 404);
            }
            sendSuccess(res, unifiedStat);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },
};
