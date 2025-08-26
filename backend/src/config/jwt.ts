export interface JWTPayload {
    userId: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export const generateTokens = (payload: JWTPayload) => {
    
}