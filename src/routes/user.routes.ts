
import express from 'express';
import { userController } from '../controllers/user.controller';

export const userRoutes = express.Router();

// Authentication routes
userRoutes.post('/login', userController.login);
userRoutes.post('/register', userController.register);

// User profile routes
userRoutes.get('/:id', userController.getUserProfile);
userRoutes.get('/get/:id', userController.getUserById);
userRoutes.put('/:id', userController.updateUserProfile);
userRoutes.get('/:id/progress', userController.getUserProgress);
userRoutes.put('/:id/progress', userController.updateUserStats);

// Current user endpoints
userRoutes.get('/current/progress', userController.getCurrentUserProgress);
userRoutes.get('/question-status', userController.getUserQuestionStatus);
userRoutes.put('/question-status', userController.updateQuestionStatus);
userRoutes.post('/answer', userController.submitAnswer);

// New unified stats endpoints
userRoutes.get('/:id/unified', userController.getUserUnifiedStat);
userRoutes.get('/current/unified', userController.getCurrentUserUnifiedStat);
