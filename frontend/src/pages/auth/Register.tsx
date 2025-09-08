import React, { useState } from "react"
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { RegisterRequest } from "../../types/auth.types";
import { Link, Navigate } from "react-router-dom";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
import { Loading } from "../../components/common/Loading";

export const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register: registerUser, isLoading, error, isAuthenticated, user } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterRequest & { confirmPassword: string }>();

    const watchPassword = watch('password');

    // Redirect if already authenticated
    if (isAuthenticated && user) {
        const RedirectPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
        return <Navigate to={RedirectPath} replace />;
    }

    const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
        try {
            const { confirmPassword, ...registerData } = data;
            await registerUser(registerData);
        } catch (error) {
            // Error is handled by useAuth hook
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

        <div className="max-w-md w-full space-y-8">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8">
            {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
                        <UserPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Create Account
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Join us to discover amazing events
                    </p>
                </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
                </div>
            )}

            {/* Register Form */}
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('firstName', {
                            required: 'First name is required',
                            minLength: { value: 2, message: 'First name must be at least 2 characters' },
                            })}
                            type="text"
                            className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="John"
                        />
                        </div>
                        {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</p>
                        )}
                    </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        {...register('lastName', {
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                        })}
                        type="text"
                        className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Doe"
                    />
                    </div>
                    {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</p>
                    )}
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="john@example.com"
                    />
                </div>
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain at least one uppercase letter, lowercase letter, and number',
                        },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Create a strong password"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === watchPassword || 'Passwords do not match',
                    })}
                    type="password"
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg bg-white dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Confirm your password"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
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
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                    </>
                    )}
                </button>
                </div>

                <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                    Sign in
                    </Link>
                </p>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
};