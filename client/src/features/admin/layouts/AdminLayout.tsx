import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      {/* Admin Sidebar - Phase 4 */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-dark-900 text-white p-4">
          <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            <a href="/admin" className="block px-4 py-2 rounded-lg hover:bg-dark-800">
              Dashboard
            </a>
            <a href="/admin/products" className="block px-4 py-2 rounded-lg hover:bg-dark-800">
              Products
            </a>
            <a href="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-dark-800">
              Orders
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
