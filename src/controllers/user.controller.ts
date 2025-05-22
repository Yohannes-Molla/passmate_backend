import { Request, Response } from 'express';
import { UserService } from '../services';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../utils/response';

export const userController = {
    getUserProfile: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userService = new UserService();
            const user = await userService.findById(id);

            if (!user) return sendError(res, 'User not found', 404);

            const { password, ...userProfile } = user as any;
            sendSuccess(res, userProfile);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    getUserById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userService = new UserService();
            const user = await userService.findById(id);

            if (!user) return sendError(res, 'User not found', 404);
            sendSuccess(res, {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                departmentId: user.department?.id
            });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    updateUserProfile: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const {
                firstName,
                lastName,
                email,
                phoneNumber,
                avatarUrl,
                departmentId,
            } = req.body;

            const userService = new UserService();
            const updatedUser = await userService.updateUser(id, {
                firstName,
                lastName,
                email,
                phoneNumber,
                avatarUrl,
                departmentId,
            });

            sendSuccess(res, {
                ...updatedUser,
                departmentId: updatedUser.department?.id,
            });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    getUserProgress: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userService = new UserService();
            const progress = await userService.getUserProgress(id);

            if (!progress) return sendError(res, 'Progress data not found', 404);

            sendSuccess(res, progress);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    updateUserStats: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const service = new UserService();
            const updatedStats = await service.updateUserProgress(id, updatedData);

            return sendSuccess(res, updatedStats);
        } catch (error) {
            return sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    getCurrentUserProgress: async (req: Request, res: Response) => {
        try {
            const userId = req.headers['user-id'] as string;

            if (!userId) return sendError(res, 'Authentication required', 401);

            const userService = new UserService();
            const progress = await userService.getUserProgress(userId);

            if (!progress) return sendError(res, 'Progress data not found', 404);

            sendSuccess(res, {
                userId: progress.userId,
                completedExams: progress.completedExams,
                completedPractice: progress.completedPractice,
                totalCorrect: progress.correctAnswers,
                totalQuestions: progress.totalAnswers,
                strengths: progress.strengths || [],
                weaknesses: progress.weaknesses || [],
                answeredQuestions: progress.answeredQuestions || [],
                streakDays: progress.streakDays || 0,
                correctAnswers: progress.correctAnswers || 0,
                totalAnswers: progress.totalAnswers || 0,
                lastActivity: progress.lastActivity ? progress.lastActivity.getTime() : null
            });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    getUserQuestionStatus: async (req: Request, res: Response) => {
        try {
            const userId = req.headers['user-id'] as string;

            if (!userId) return sendError(res, 'Authentication required', 401);

            const questionStatus = [
                { userId, questionId: 'q1', status: 'answered', attemptCount: 2, lastAttemptAt: new Date().toISOString() },
                { userId, questionId: 'q2', status: 'flagged', attemptCount: 1, lastAttemptAt: new Date().toISOString() },
                { userId, questionId: 'q3', status: 'seen', attemptCount: 0, lastAttemptAt: null }
            ];

            sendSuccess(res, questionStatus);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    updateQuestionStatus: async (req: Request, res: Response) => {
        try {
            const { questionId, status } = req.body;
            const userId = req.headers['user-id'] as string;

            if (!userId) return sendError(res, 'Authentication required', 401);
            if (!questionId || !status) return sendError(res, 'Question ID and status are required', 400);

            sendSuccess(res, { message: `Status for question ${questionId} updated to ${status}` });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    submitAnswer: async (req: Request, res: Response) => {
        try {
            const { questionId, selectedOptionId } = req.body;
            const userId = req.headers['user-id'] as string;

            if (!userId) return sendError(res, 'Authentication required', 401);
            if (!questionId || !selectedOptionId) return sendError(res, 'Question ID and selected option ID are required', 400);

            const userService = new UserService();

            const isCorrect = await userService.checkSubmittedAnswer(questionId, selectedOptionId)

            sendSuccess(res, { isCorrect, timestamp: Date.now() });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const userService = new UserService();
            const user = await userService.validateCredentials(email, password);

            if (!user) return sendError(res, 'Invalid credentials', 401);

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '1d' }
            );

            sendSuccess(res, {
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    departmentId: user.department?.id
                },
                token
            });
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    register: async (req: Request, res: Response) => {
        try {
            const { email, password, fullName, phoneNumber } = req.body;
            const nameParts = fullName.trim().split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            const userService = new UserService();
            const newUser = await userService.createUser({ email, password, firstName, lastName, phoneNumber });

            sendSuccess(res, {
                success: true,
                message: 'Registration successful',
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    phoneNumber: newUser.phoneNumber
                }
            }, 201);
        } catch (error) {
            if (error instanceof Error && error.message === 'User already exists') {
                return sendError(res, 'User already exists', 400);
            }
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    getUserUnifiedStat: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const userService = new UserService();
            const userStat = await userService.getUserUnifiedStat(id);

            if (!userStat) return sendError(res, 'Unified statistics not found for this user', 404);

            sendSuccess(res, userStat);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    },

    getCurrentUserUnifiedStat: async (req: Request, res: Response) => {
        try {
            const userId = req.headers['user-id'] as string;

            if (!userId) return sendError(res, 'Authentication required', 401);

            const userService = new UserService();
            const userStat = await userService.getUserUnifiedStat(userId);

            if (!userStat) return sendError(res, 'Unified statistics not found for this user', 404);

            sendSuccess(res, userStat);
        } catch (error) {
            sendError(res, error instanceof Error ? error.message : String(error), 500);
        }
    }
};
