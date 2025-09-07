import jwt, { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { prisma } from './database';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export const generateTokens = (payload: JWTPayload) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error('JWT secrets are not configured');
  }

  const accessTokenOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as StringValue,
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as StringValue,
  };

  const accessToken = jwt.sign(payload, jwtSecret, accessTokenOptions);
  const refreshToken = jwt.sign(payload, jwtRefreshSecret, refreshTokenOptions);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JWTPayload => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.verify(token, jwtSecret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  
  if (!jwtRefreshSecret) {
    throw new Error('JWT refresh secret is not configured');
  }

  return jwt.verify(token, jwtRefreshSecret) as JWTPayload;
};

export const saveRefreshToken = async (userId: string, token: string): Promise<void> => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

export const removeRefreshToken = async (token: string): Promise<void> => {
  try {
    await prisma.refreshToken.delete({
      where: { token },
    });
  } catch (error) {
    // Token might not exist, which is okay
    console.log('Refresh token not found or already deleted');
  }
};