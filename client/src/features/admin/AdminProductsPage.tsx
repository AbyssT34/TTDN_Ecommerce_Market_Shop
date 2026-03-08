import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminGetAllProducts, adminDeleteProduct } from './services/adminApi';

const formatCurrency = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchProducts = async (pg = page, q = search) => {
        setLoading(true);
        try {
            const data = await adminGetAllProducts({ page: pg, limit: 15, search: q || undefined });
            setProducts(data.products || []);
            setTotal(data.pagination?.total || 0);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch {
            setError('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProducts(1, search);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn chắc chắn muốn ẩn sản phẩm này?')) return;
        try {
            await adminDeleteProduct(id);
            setDeleteId(id);
            fetchProducts();
        } catch {
            alert('Xóa sản phẩm thất bại');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quản lý Sản phẩm</h1>
                    <p className="text-gray-400 text-sm mt-1">Tổng: {total} sản phẩm</p>
                </div>
                <a
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                </a>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white hover:bg-white/15 transition-colors text-sm font-medium"
                >
                    Tìm
                </button>
                <button
                    type="button"
                    onClick={() => { setSearch(''); setPage(1); fetchProducts(1, ''); }}
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Làm mới"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Sản phẩm</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Giá</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Tồn kho</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Trạng thái</th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-5 py-4">
                                            <div className="h-6 bg-white/5 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-400 py-12">
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, i) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: deleteId === product._id ? 0 : 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/3 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-10 h-10 rounded-lg object-cover bg-white/5 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-gray-500 text-xs">N/A</span>
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{product.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{product.category?.name || '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-white font-medium">{formatCurrency(product.price)}</span>
                                            <span className="text-xs text-gray-400 ml-1">/{product.unit}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-sm font-medium ${product.stockQuantity === 0 ? 'text-red-400' : product.stockQuantity < 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                                                {product.stockQuantity}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                                                {product.isActive ? 'Đang bán' : 'Đã ẩn'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={`/admin/products/${product._id}/edit`}
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                    title="Ẩn sản phẩm"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
                        <p className="text-sm text-gray-400">
                            Trang {page} / {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { const p = Math.max(1, page - 1); setPage(p); fetchProducts(p); }}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-40 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => { const p = Math.min(totalPages, page + 1); setPage(p); fetchProducts(p); }}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-40 transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
