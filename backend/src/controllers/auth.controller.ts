import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import {
    generateTokens, 
    removeRefreshToken, 
    saveRefreshToken,
    verifyRefreshToken,
} from "../config/jwt";
import { AuthRequest } from "../middleware/auth.middleware";

export const register = async (req:Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, role = 'USER' } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        //Hash password
        const saltRounds = 12;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                firstName,
                lastName,
                role: role as 'USER' | 'ADMIN',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createAt: true,
            },
        });

        // Create cart for user
        await prisma.cart.create({
            data: {
                userId: user.id,
            },
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const login = async (req: Request, res: Response)=> {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message:'Invalid credentials',
            }); 
        }

        //Generate tokens
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        const { accessToken, refreshToken } = generateTokens(payload);
        await saveRefreshToken(user.id, refreshToken);

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                accessToken,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: 'Internal server error',
        });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required',
            });
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);

        // Check if refresh token exists in database
        const tokenRecord = await prisma.refreshToken.findUnique({
            where: { token: refreshToken}, 
        });

        if(!tokenRecord) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }

        //Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload);

        //Save new refresh token and remove old one
        await Promise.all([
            saveRefreshToken(payload.userId, newRefreshToken),
            removeRefreshToken(refreshToken),
        ]);

        // Set new cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: { accessToken },
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token',
        });
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await removeRefreshToken(refreshToken);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};