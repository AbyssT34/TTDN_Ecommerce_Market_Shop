import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Eye, AlertCircle } from 'lucide-react';
import { adminGetAllOrders } from './services/adminApi';

const formatCurrency = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'preparing', label: 'Đang chuẩn bị' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
];

const statusStyle: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-400/10',
    confirmed: 'text-blue-400 bg-blue-400/10',
    preparing: 'text-purple-400 bg-purple-400/10',
    shipping: 'text-orange-400 bg-orange-400/10',
    completed: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
};

export function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async (pg = page, s = status, q = search) => {
        setLoading(true);
        try {
            const data = await adminGetAllOrders({
                page: pg,
                limit: 15,
                status: s || undefined,
                search: q || undefined,
            });
            setOrders(data.orders || []);
            setTotal(data.pagination?.total || 0);
            setTotalPages(data.pagination?.totalPages || 1);
        } catch {
            setError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchOrders(1, status, search);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Quản lý Đơn hàng</h1>
                    <p className="text-gray-400 text-sm mt-1">Tổng: {total} đơn hàng</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm mã đơn hàng..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 text-sm"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white text-sm">Tìm</button>
                </form>
                <div className="flex gap-2">
                    <select
                        value={status}
                        onChange={(e) => { setStatus(e.target.value); setPage(1); fetchOrders(1, e.target.value, search); }}
                        className="bg-gray-900 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50"
                    >
                        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button
                        onClick={() => { setSearch(''); setStatus(''); setPage(1); fetchOrders(1, '', ''); }}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                        title="Làm mới"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm">
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
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Mã đơn</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Khách hàng</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Ngày đặt</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Tổng tiền</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Khung giờ</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Trạng thái</th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7} className="px-5 py-4">
                                            <div className="h-5 bg-white/5 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-gray-400 py-12">Không có đơn hàng nào</td>
                                </tr>
                            ) : (
                                orders.map((order, i) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/3 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-mono text-white">{order.orderNumber}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-white">{order.user?.name || '—'}</p>
                                            <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-gray-300">{formatDate(order.createdAt)}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-semibold text-white">{formatCurrency(order.total)}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs text-gray-300 bg-white/5 px-2 py-1 rounded-lg">{order.deliverySlot}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[order.orderStatus] || 'text-gray-400 bg-gray-400/10'}`}>
                                                {STATUS_OPTIONS.find(o => o.value === order.orderStatus)?.label || order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <a
                                                href={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center gap-1.5 p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </a>
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
                        <p className="text-sm text-gray-400">Trang {page} / {totalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => { const p = Math.max(1, page - 1); setPage(p); fetchOrders(p); }} disabled={page === 1} className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-40">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => { const p = Math.min(totalPages, page + 1); setPage(p); fetchOrders(p); }} disabled={page === totalPages} className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white disabled:opacity-40">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
