export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
    updatedAt: string; 
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'USER' | 'ADMIN';
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user:User;
        accessToken: string;
    };
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}