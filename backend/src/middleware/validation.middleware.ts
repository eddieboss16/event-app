import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.array().map(e => ({
                field: e.type === 'field' ? e.path : undefined,
                message: e.msg,
            })),
        });
        return;
    }

    next();
    return;
};