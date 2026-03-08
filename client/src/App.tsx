import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from '@/components/ui';
import { Header, Footer } from '@/components/layout';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProductListPage } from '@/features/products/ProductListPage';
import { ProductDetailPage } from '@/features/products/ProductDetailPage';
import { CartPage } from '@/features/cart/CartPage';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { PaymentPage } from '@/features/checkout/PaymentPage';
import { OrderListPage } from '@/features/orders/OrderListPage';
import { OrderDetailPage } from '@/features/orders/OrderDetailPage';
import { ProfilePage } from '@/features/auth/ProfilePage';
import { AdminRoute } from '@/features/admin/components/AdminRoute';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/features/admin/AdminProductsPage';
import { AdminProductFormPage } from '@/features/admin/AdminProductFormPage';
import { AdminOrdersPage } from '@/features/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from '@/features/admin/AdminOrderDetailPage';
import { AdminUsersPage } from '@/features/admin/AdminUsersPage';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

// Create React Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

/**
 * Root Application Component
 * Phase 2: Visual & Security - Design System + Auth Flow
 */
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
                    {/* Toast Container */}
                    <ToastContainer />

                    {/* Main Content */}
                    <Routes>
                        {/* Public Routes (No Header/Footer) */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Protected Routes (With Layout) */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <HomePage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />

                        {/* Products */}
                        <Route
                            path="/products"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <ProductListPage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/products/:id"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <ProductDetailPage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />

                        {/* Profile */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <ProfilePage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />

                        {/* Cart */}
                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <CartPage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />

                        {/* Checkout */}
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <CheckoutPage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />

                        {/* Bank Transfer Payment */}
                        <Route
                            path="/payment/:orderId"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <PaymentPage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />

                        {/* Orders */}
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <OrderListPage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders/:id"
                            element={
                                <ProtectedRoute>
                                    <>
                                        <Header />
                                        <main className="flex-1">
                                            <OrderDetailPage />
                                        </main>
                                        <Footer />
                                    </>
                                </ProtectedRoute>
                            }
                        />

                        {/* ════════════════════════════════════════════ */}
                        {/* ADMIN ROUTES (protected: admin/superadmin)  */}
                        {/* ════════════════════════════════════════════ */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <AdminDashboardPage />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <AdminProductsPage />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products/new"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <AdminProductFormPage />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products/:id/edit"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <AdminProductFormPage />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <AdminOrdersPage />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/orders/:id"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <AdminOrderDetailPage />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <AdminLayout>
                                        <AdminUsersPage />
                                    </AdminLayout>
                                </AdminRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

/**
 * Homepage - Quick access to main features
 */
function HomePage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-3 bg-green-500/20 border border-green-500/50 rounded-full px-6 py-2 mb-6">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 font-medium">Phase 2: Visual & Security ✨</span>
                </div>

                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
                    Chào mừng đến TTDN Market
                </h1>
                <p className="text-xl text-gray-400">
                    Thực phẩm tươi ngon mỗi ngày 🥦🍎🥩
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.a
                    href="/products"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-primary-500/50 transition-all hover:-translate-y-1"
                >
                    <ShoppingBag className="w-12 h-12 text-primary-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Sản phẩm</h3>
                    <p className="text-gray-400">Khám phá thực phẩm tươi sống</p>
                </motion.a>

                <motion.a
                    href="/cart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-primary-500/50 transition-all hover:-translate-y-1"
                >
                    <div className="text-4xl mb-4">🛒</div>
                    <h3 className="text-xl font-bold text-white mb-2">Giỏ hàng</h3>
                    <p className="text-gray-400">Xem giỏ hàng của bạn</p>
                </motion.a>

                <motion.a
                    href="/orders"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-primary-500/50 transition-all hover:-translate-y-1"
                >
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-white mb-2">Đơn hàng</h3>
                    <p className="text-gray-400">Theo dõi đơn hàng</p>
                </motion.a>
            </div>
        </div>
    );
}

/**
 * 404 Not Found Page
 */
function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-xl text-gray-400 mb-8">Không tìm thấy trang</p>
                <a
                    href="/"
                    className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    Về trang chủ
                </a>
            </div>
        </div>
    );
}

export default App;
