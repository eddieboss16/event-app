import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { Cart } from './pages/user/Cart';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <DashboardLayout>
                        <Routes>
                          <Route path="/" element={<AdminDashboard />} />
                          <Route path="/events" element={<div>Admin Events</div>} />
                          <Route path="/users" element={<div>User Management</div>} />
                          <Route path="/analytics" element={<div>Analytics</div>} />
                        </Routes>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* User Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRole="USER">
                      <DashboardLayout>
                        <UserDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute requiredRole="USER">
                      <DashboardLayout>
                        <div>Events List</div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute requiredRole="USER">
                      <DashboardLayout>
                        <Cart />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredRole="USER">
                      <DashboardLayout>
                        <div>Profile</div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;