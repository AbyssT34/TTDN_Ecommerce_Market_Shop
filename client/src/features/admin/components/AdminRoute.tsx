import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface AdminRouteProps {
    children: React.ReactNode;
}

/**
 * AdminRoute – Bảo vệ route chỉ cho admin/superadmin
 * Nếu chưa đăng nhập → /login
 * Nếu không phải admin → /
 */
export function AdminRoute({ children }: AdminRouteProps) {
    const { user, isAuthenticated, checkAuth } = useAuthStore();

    if (!isAuthenticated || !checkAuth()) {
        return <Navigate to="/login" replace />;
    }

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
