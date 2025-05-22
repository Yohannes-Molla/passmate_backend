import express from 'express';
import { examController } from '../controllers/exam.controller';

export const examRoutes = express.Router();

// Get all exams
examRoutes.get('/:id', examController.getExam);

// Get exam by id
examRoutes.get('/:id', examController.getExamById);

// Get questions for a specific exam
examRoutes.get('/:id/questions', examController.getExamQuestions);

// Submit exam results
examRoutes.post('/submit', examController.submitExam);