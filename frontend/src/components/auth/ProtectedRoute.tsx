import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Loading } from "../common/Loading";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'USER' | 'ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole
}) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading size="lg" text="Checking authentication..."/>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        // Redirect based on user role
        const RedirectPath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
        return <Navigate to={RedirectPath} replace />; 
    }

    return <>{children}</>;
};