import express from 'express';
import { departmentController } from '../controllers/department.controller';

export const departmentRoutes = express.Router();

// Get all departments
departmentRoutes.get('/', departmentController.list);

// Get a specific department by ID
departmentRoutes.get('/:id', departmentController.get);

// Create a new department
departmentRoutes.post('/', departmentController.create);

// Update an existing department
departmentRoutes.put('/:id', departmentController.update);

// Delete a department
departmentRoutes.delete('/:id', departmentController.delete);

departmentRoutes.post('/bulk', departmentController.createDepartmentWithQuestionsAndExams);
