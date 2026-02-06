import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '@/lib/api/auth';
import { toast } from '@/components/ui';

// ═══════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════

export const Header = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser();
            logout();
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="sticky top-0 z-40 backdrop-blur-md bg-gray-900/75 border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-3xl group-hover:scale-110 transition-transform">🛒</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-orange bg-clip-text text-transparent">
                            Food Market
                        </span>
                    </Link>

                    {/* Navigation (Desktop) */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                            Products
                        </Link>
                        <Link to="/recipes" className="text-gray-300 hover:text-white transition-colors">
                            Recipes
                        </Link>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                {/* Cart */}
                                <Link
                                    to="/cart"
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white relative"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full text-xs flex items-center justify-center">
                                        0
                                    </span>
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full border-2 border-primary-500"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-primary-500/20 border-2 border-primary-500 flex items-center justify-center">
                                                <User className="w-4 h-4 text-primary-500" />
                                            </div>
                                        )}
                                        <span className="text-sm text-white hidden lg:block">{user?.name}</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl py-2"
                                            >
                                                <Link
                                                    to="/profile"
                                                    className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/orders"
                                                    className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Orders
                                                </Link>
                                                <Link
                                                    to="/wishlist"
                                                    className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    Wishlist
                                                </Link>
                                                <hr className="my-2 border-white/10" />
                                                <button
                                                    onClick={() => {
                                                        handleLogout();
                                                        setShowUserMenu(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-white transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
