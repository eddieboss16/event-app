import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User, LoginRequest, RegisterRequest } from "../types/auth.types";
import { authService } from "../services/auth.service";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout:() => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!user;

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setError(null);
        } catch (error) {
            setUser(null);
            // Don't set error for initial auth check
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginRequest) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authService.login(credentials);
            setUser(response.data.user);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: RegisterRequest) => {
        try{
            setIsLoading(true);
            setError(null);
            const response = await authService.register(userData);
            setUser(response.data.user);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Even if logout on backend, clear local state
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setError(null);
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        error,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};