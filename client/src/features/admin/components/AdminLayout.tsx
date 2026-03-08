import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    LogOut,
    Store,
    ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { to: '/admin/users', icon: Users, label: 'Người dùng' },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-40"
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm leading-tight">TTDN Market</p>
                            <p className="text-xs text-green-400 font-medium">Admin Panel</p>
                        </div>
                    </a>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-green-400' : ''}`} />
                                    <span className="flex-1 font-medium text-sm">{item.label}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 text-green-400" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Info + Logout */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 py-2 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-green-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
