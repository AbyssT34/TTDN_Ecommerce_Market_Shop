import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ToastContainer } from '@/components/ui';
import { translate } from '@/lib/displayPreferences';
import { useThemeStore } from '@/stores/themeStore';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProfilePage } from '@/features/auth/ProfilePage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
import { AdminOrderDetailPage } from '@/features/admin/AdminOrderDetailPage';
import { AdminOrdersPage } from '@/features/admin/AdminOrdersPage';
import { AdminProductFormPage } from '@/features/admin/AdminProductFormPage';
import { AdminProductsPage } from '@/features/admin/AdminProductsPage';
import { AdminRecipeFormPage } from '@/features/admin/AdminRecipeFormPage';
import { AdminRecipesPage } from '@/features/admin/AdminRecipesPage';
import { AdminUsersPage } from '@/features/admin/AdminUsersPage';
import { AdminVouchersPage } from '@/features/admin/AdminVouchersPage';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AdminRoute } from '@/features/admin/components/AdminRoute';
import { CartPage } from '@/features/cart/CartPage';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { PaymentPage } from '@/features/checkout/PaymentPage';
import { OrderDetailPage } from '@/features/orders/OrderDetailPage';
import { OrderListPage } from '@/features/orders/OrderListPage';
import { ProductDetailPage } from '@/features/products/ProductDetailPage';
import { ProductListPage } from '@/features/products/ProductListPage';
import { RecipeDetailPage } from '@/features/recipes/RecipeDetailPage';
import { RecipesPage } from '@/features/recipes/RecipesPage';
import { StorefrontLayout } from '@/features/storefront/components/StorefrontLayout';
import { StorefrontHomePage } from '@/features/storefront/StorefrontHomePage';

function StorefrontProtectedOutlet() {
    return (
        <ProtectedRoute>
            <Outlet />
        </ProtectedRoute>
    );
}

function NotFoundPage() {
    const language = useThemeStore((state) => state.language);

    return (
        <div className="min-h-screen d-flex align-items-center justify-content-center px-4">
            <div className="ttdn-empty-state text-center" style={{ maxWidth: 520 }}>
                <h1 className="display-5 fw-bold text-dark mb-3">404</h1>
                <p className="text-muted mb-4">
                    {translate(
                        {
                            vi: 'Trang bạn cần hiện không tồn tại hoặc đường dẫn đã thay đổi.',
                            en: 'The page you are looking for no longer exists or the link has changed.',
                        },
                        language
                    )}
                </p>
                <a href="/" className="btn theme-bg-color text-white rounded-pill px-4">
                    {translate({ vi: 'Về trang chủ', en: 'Back to home' }, language)}
                </a>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ToastContainer />
            <ChatBubble />

            <Routes>
                <Route element={<StorefrontLayout />}>
                    <Route path="/" element={<StorefrontHomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<StorefrontProtectedOutlet />}>
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/payment/:orderId" element={<PaymentPage />} />
                        <Route path="/orders" element={<OrderListPage />} />
                        <Route path="/orders/:id" element={<OrderDetailPage />} />
                    </Route>
                </Route>

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
                    path="/admin/recipes"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminRecipesPage />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/recipes/new"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminRecipeFormPage />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/recipes/:id/edit"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminRecipeFormPage />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/vouchers"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminVouchersPage />
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

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
