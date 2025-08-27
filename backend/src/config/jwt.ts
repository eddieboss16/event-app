import jwt from 'jsonwebtoken';
import { prisma } from "./database";

export interface JWTPayload {
    userId: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export const generateTokens = (payload: JWTPayload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload => {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JWTPayload;
};

export const saveRefreshToken = async (userId: string, token: string) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); //7 days

    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });
};

export const removeRefreshToken = async (token: string) => {
    await prisma.refreshToken.delete({
        where: { token },
    });
};