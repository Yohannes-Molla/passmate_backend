
import express from 'express';
import { statsController } from '../controllers/stats.controller';

export const statsRoutes = express.Router();

// Get user statistics
statsRoutes.get('/user/:userId', statsController.getUserStats);

// Get exam statistics
statsRoutes.get('/user/:userId/exam/:examId', statsController.getExamStats);

// Get category statistics
statsRoutes.get('/user/:userId/category/:category', statsController.getCategoryStats);

// New unified statistics endpoint
statsRoutes.get('/user/:userId/unified', statsController.getUnifiedUserStats);
