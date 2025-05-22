// src/utils/response.ts
import { Response } from 'express';

export function sendSuccess<T extends object = any>(
    res: Response,
    payload: T,
    statusCode = 200
) {
    // If there is a nested `department`, pull out its id
    const departmentId = (payload as any).department?.id;
    res.status(statusCode).json({
        success: true,
        data: {
            ...payload
        },
    });
}

export function sendError(
    res: Response,
    message: string,
    statusCode = 400
) {
    res.status(statusCode).json({
        success: false,
        message,
    });
}
