import { apiService } from "./api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from "../types/auth.types";

export class AuthService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return apiService.post<LoginResponse['data']>('/auth/login', credentials);
    }

    async register(userData: RegisterRequest): Promise<RegisterResponse> {
        return apiService.post<RegisterResponse['data']>('/auth/register', userData);
    }

    async logout(): Promise<void> {
        await apiService.post('/auth/logout');
    }

    async getCurrentUser(): Promise<User> {
        const response = await apiService.get<{ user: User }>('/auth/me');
        return response.data!.user;
    }

    async refreshToken(): Promise<void> {
        await apiService.post('/auth/refresh');
    }
}

export const authService = new AuthService();