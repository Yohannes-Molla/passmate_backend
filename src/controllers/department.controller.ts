// controllers/department.controller.ts
import { Request, Response } from 'express';
import { DepartmentService } from '../services';
import { sendSuccess, sendError } from '../utils/response';
import {addAbortSignal} from "node:stream";

const deptService = new DepartmentService();

export const departmentController = {
    create: async (req: Request, res: Response) => {
        try {
            const { name, categories } = req.body as {
                name: string;
                categories?: string[];
            };
            const dept = await deptService.createDepartment(name, categories);
            sendSuccess(res, dept, 201);
        } catch (err) {
            sendError(res, err instanceof Error ? err.message : String(err));
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, categories } = req.body as {
                name: string;
                categories?: string[];
            };
            const updated = await deptService.updateDepartment(id, name, categories);
            sendSuccess(res, updated);
        } catch (err) {
            sendError(res, err instanceof Error ? err.message : String(err));
        }
    },

    list: async (_req: Request, res: Response) => {
        const all = await deptService.getAllDepartments();
        res.status(201).json({
            success: true,
            data: all,
        });
    },

    get: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const dept = await deptService.getDepartmentById(id);
            if (!dept) return sendError(res, 'Not found', 404);
            sendSuccess(res, dept);
        } catch (err) {
            sendError(res, err instanceof Error ? err.message : String(err));
        }
    },

    delete: async (req: Request, res: Response) => {
        try {
            await deptService.deleteDepartment(req.params.id);
            // still wrap a 204 if you want consistency, or just send 204
            res.status(204).json({ success: true, data: null });
        } catch (err) {
            sendError(res, err instanceof Error ? err.message : String(err));
        }
    },

    createDepartmentWithQuestionsAndExams: async (req: Request, res: Response) => {
        try {
            const payload = req.body;
            const service = new DepartmentService();
            const result = await service.createDepartmentWithQuestionsAndExams(payload);
            return sendSuccess(res, result);
        } catch (err) {
            return sendError(res, err instanceof Error ? err.message : String(err), 500);
        }
    }
};
