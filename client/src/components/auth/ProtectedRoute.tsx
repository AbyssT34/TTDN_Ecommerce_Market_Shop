import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin' && user.role !== 'superadmin') {
        // Not admin, redirect to home
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
