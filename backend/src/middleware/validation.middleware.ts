import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (req: Request, res: Response, next:NextFunction) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({
            success:false,
            message: 'Validation failed',
            errors: error.array().map(error => ({
                field: error.type === 'field' ? error.path : undefined,
                message: error.msg,
            })),
        });
    }

    next();
};