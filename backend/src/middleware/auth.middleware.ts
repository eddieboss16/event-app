import { Request, Response, NextFunction } from "express";
import { JWTPayload, verifyAccessToken } from "../config/jwt";

export interface AuthRequest extends Request {
    user?: JWTPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies?.accessToken || authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }

        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
        return;
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
        return;
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }

    if (req.user.role !== 'ADMIN') {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
        return;
    }

    next();
    return;
};

export const requireUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'User access only'
        });
        return;
    }

    next();
    return;
};