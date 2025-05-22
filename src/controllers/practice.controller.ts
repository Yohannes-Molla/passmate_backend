import { Request, Response } from 'express';
import { PracticeService } from '../services';
import { sendSuccess, sendError } from '../utils/response';

const practiceService = new PracticeService();

export const practiceController = {
    // Get practice sessions for a user
    getUserPracticeSessions: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const sessions = await practiceService.getUserPracticeSessions(userId);
            sendSuccess(res, { sessions });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get details of a specific practice session
    getPracticeSession: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const session = await practiceService.getPracticeSession(id);
            if (!session) {
                return sendError(res, 'Practice session not found', 404);
            }
            sendSuccess(res, session);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Create a new practice session
    createPracticeSession: async (req: Request, res: Response) => {
        try {
            const { userId, settings } = req.body;
            const newSession = await practiceService.createPracticeSession(userId, settings);
            sendSuccess(res, newSession, 201);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Submit practice session results
    submitPracticeResults: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { userId, answers, timeTaken } = req.body;
            const results = await practiceService.submitPracticeResults(
                id,
                userId,
                answers,
                timeTaken
            );
            sendSuccess(res, { results });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    // Get practice questions for a specific session
    getPracticeQuestions: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const session = await practiceService.getPracticeSession(id);
            if (!session) {
                return sendError(res, 'Practice session not found', 404);
            }
            sendSuccess(res, { questions: session.questions });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },
};
