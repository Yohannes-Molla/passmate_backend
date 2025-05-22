
import express from 'express';
import { questionsController } from '../controllers/questions.controller';

export const questionsRoutes = express.Router();

// Get all questions
questionsRoutes.get('/', questionsController.getAllQuestions);

// Get a question by ID
questionsRoutes.get('/:id', questionsController.getQuestionById);

// Get questions by category
questionsRoutes.get('/category/:category', questionsController.getQuestionsByCategory);

// Get questions by difficulty
questionsRoutes.get('/difficulty/:difficulty', questionsController.getQuestionsByDifficulty);

questionsRoutes.post('/bulk', questionsController.addQuestionsBulk);
