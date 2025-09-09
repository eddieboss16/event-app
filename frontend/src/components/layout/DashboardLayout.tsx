import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useIdle } from "../../hooks/useIdle";
import { 
    Calendar, 
    Home, 
    LogOut, 
    Menu, 
    Settings, 
    ShoppingCart, 
    User, 
    Users, 
    X 
} from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Auto logout on idle (15 minutes)
    useIdle({
        timeout: 15 * 60 * 1000, // 15 minutes
        onIdle: async () => {
            await logout();
            navigate('/login');
        },
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const adminNavigation = [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Analytics', href: '/admin/analytics', icon: Settings },
    ];

    const userNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Cart', href: '/cart', icon: ShoppingCart },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const navigation = user?.role === 'ADMIN' ? adminNavigation : userNavigation;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 shadow-lg transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-700">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.role === 'ADMIN' ? 'Admin Panel' : 'Event Hub'}
            </h1>
            <button
                type="button"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
            >
                <X className="w-6 h-6 text-gray-400" />
            </button>
            </div>

            <nav className="mt-6 px-3">
            <ul className="space-y-1">
                {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                    <li key={item.name}>
                    <Link
                        to={item.href}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                    </Link>
                    </li>
                );
                })}
            </ul>
            </nav>

            {/* User info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                </div>
                <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role}
                </p>
                </div>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
            </button>
            </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
            {/* Top bar */}
            <div className="sticky top-0 z-40 bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                <button
                type="button"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                >
                <Menu className="w-6 h-6 text-gray-400" />
                </button>
                
                <div className="flex items-center space-x-4">
                <ThemeToggle />
                </div>
            </div>
            </div>

            {/* Page content */}
            <main className="p-4 sm:p-6">
            {children}
            </main>
        </div>

        {/* Sidebar overlay */}
        {sidebarOpen && (
            <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            />
        )}
        </div>
    );
};