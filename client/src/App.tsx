import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/ui/LoadingScreen';

// Eager loaded pages (critical path)
import HomePage from './features/shop/pages/HomePage';

// Lazy loaded pages (code splitting)
const ShopPage = lazy(() => import('./features/shop/pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./features/shop/pages/ProductDetailPage'));
const CartPage = lazy(() => import('./features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('./features/checkout/pages/CheckoutPage'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'));
const RecipeHubPage = lazy(() => import('./features/recipe/pages/RecipeHubPage'));
const RecipeDetailPage = lazy(() => import('./features/recipe/pages/RecipeDetailPage'));

// Admin pages (separate chunk)
const AdminLayout = lazy(() => import('./features/admin/layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./features/admin/pages/DashboardPage'));

// Error pages
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/recipes" element={<RecipeHubPage />} />
          <Route path="/recipe/:slug" element={<RecipeDetailPage />} />
        </Route>

        {/* Auth routes (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin routes (separate layout + chunk) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* More admin routes will be added in Phase 4 */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
