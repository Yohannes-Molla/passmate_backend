
import express from 'express';
import { practiceController } from '../controllers/practice.controller';

export const practiceRoutes = express.Router();

// Get all practice sessions for a user
practiceRoutes.get('/user/:userId', practiceController.getUserPracticeSessions);

// Get specific practice session
practiceRoutes.get('/:id', practiceController.getPracticeSession);

// Create new practice session
practiceRoutes.post('/', practiceController.createPracticeSession);

// Submit practice results
practiceRoutes.post('/:id/submit', practiceController.submitPracticeResults);

// Get questions for a specific practice session
practiceRoutes.get('/:id/questions', practiceController.getPracticeQuestions);
