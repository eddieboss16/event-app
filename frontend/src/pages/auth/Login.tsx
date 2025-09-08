import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, Navigate, useLocation } from "react-router-dom";
import { LoginRequest } from "../../types/auth.types";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Loading } from "../../components/common/Loading";

export const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, isAuthenticated, user } = useAuth();
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>();

    // Redirect if already authenticated
    if (isAuthenticated && user) {
        const from = location.state?.from?.pathname || (user.role === 'ADMIN' ? '/admin' : '/dashboard');
        return <Navigate to={from} replace />;
    }

    const onSubmit = async (data: LoginRequest) => {
        try {
            await login(data);
        } catch (error) {
            // Error is handled by useAuth hook
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle/>
            </div>

            <div className="max-w-md w-full space-y-8">
                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                                <LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400"/>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Welcome Back  
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                    },
                                })}
                                type="email"
                                autoComplete="email"
                                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10"
                                placeholder="Enter your email"
                                />
                            </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                        )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                            {...register('password', {
                                required: 'Password is required',
                            })}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10"
                            placeholder="Enter your password"
                            />
                            <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                        )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                <Loading size="sm" text="" />
                                ) : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Sign In
                                </>
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <Link
                                to="/register"
                                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                                Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};