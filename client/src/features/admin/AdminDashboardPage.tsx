import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, ShoppingBag, Package, Users,
    Clock, CheckCircle, Truck, XCircle, AlertCircle,
} from 'lucide-react';
import { getDashboardStats } from './services/adminApi';

const formatCurrency = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: 'Chờ xác nhận', color: 'text-yellow-400 bg-yellow-400/10' },
    confirmed: { label: 'Đã xác nhận', color: 'text-blue-400 bg-blue-400/10' },
    preparing: { label: 'Đang chuẩn bị', color: 'text-purple-400 bg-purple-400/10' },
    shipping: { label: 'Đang giao', color: 'text-orange-400 bg-orange-400/10' },
    completed: { label: 'Hoàn thành', color: 'text-green-400 bg-green-400/10' },
    cancelled: { label: 'Đã hủy', color: 'text-red-400 bg-red-400/10' },
};

export function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getDashboardStats()
            .then(setData)
            .catch(() => setError('Không thể tải dữ liệu dashboard'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
            </div>
        );
    }

    const { stats, recentOrders, topProducts } = data || {};

    const statCards = [
        {
            label: 'Tổng doanh thu',
            value: formatCurrency(stats?.totalRevenue || 0),
            icon: TrendingUp,
            color: 'from-green-400 to-emerald-600',
            bg: 'bg-green-500/10 border-green-500/20',
            sub: `Tháng này: ${formatCurrency(stats?.monthlyRevenue || 0)}`,
        },
        {
            label: 'Đơn hàng hôm nay',
            value: stats?.todayOrders || 0,
            icon: ShoppingBag,
            color: 'from-blue-400 to-blue-600',
            bg: 'bg-blue-500/10 border-blue-500/20',
            sub: `Tổng: ${Object.values(stats?.ordersByStatus || {}).reduce((a: any, b: any) => a + b, 0)} đơn`,
        },
        {
            label: 'Sản phẩm',
            value: stats?.activeProducts || 0,
            icon: Package,
            color: 'from-purple-400 to-purple-600',
            bg: 'bg-purple-500/10 border-purple-500/20',
            sub: `Tổng: ${stats?.totalProducts || 0} sản phẩm`,
        },
        {
            label: 'Người dùng',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'from-orange-400 to-orange-600',
            bg: 'bg-orange-500/10 border-orange-500/20',
            sub: 'Tài khoản khách hàng',
        },
    ];

    const orderStatusCards = [
        { status: 'pending', icon: Clock },
        { status: 'confirmed', icon: CheckCircle },
        { status: 'preparing', icon: Package },
        { status: 'shipping', icon: Truck },
        { status: 'completed', icon: CheckCircle },
        { status: 'cancelled', icon: XCircle },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Tổng quan hoạt động cửa hàng</p>
            </div>

            {/* Main Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`rounded-2xl border p-5 ${card.bg}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-gray-400 text-sm font-medium">{card.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                            </div>
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Order Status Row */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Trạng thái đơn hàng</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                    {orderStatusCards.map(({ status, icon: Icon }) => {
                        const cfg = statusConfig[status];
                        const count = stats?.ordersByStatus?.[status] || 0;
                        return (
                            <div key={status} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-full mb-2 ${cfg.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <p className="text-xl font-bold text-white">{count}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{cfg.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-semibold text-white">Đơn hàng mới nhất</h2>
                        <a href="/admin/orders" className="text-xs text-green-400 hover:text-green-300">Xem tất cả →</a>
                    </div>
                    <div className="divide-y divide-white/5">
                        {(recentOrders || []).slice(0, 6).map((order: any) => (
                            <a
                                key={order._id}
                                href={`/admin/orders/${order._id}`}
                                className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{order.orderNumber}</p>
                                    <p className="text-xs text-gray-400 truncate">{order.user?.name || '—'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-white">{formatCurrency(order.total)}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[order.orderStatus]?.color || 'text-gray-400 bg-gray-400/10'}`}>
                                        {statusConfig[order.orderStatus]?.label || order.orderStatus}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-semibold text-white">Sản phẩm bán chạy</h2>
                        <a href="/admin/products" className="text-xs text-green-400 hover:text-green-300">Quản lý →</a>
                    </div>
                    <div className="divide-y divide-white/5">
                        {(topProducts || []).map((p: any, i: number) => (
                            <div key={p._id} className="flex items-center gap-4 p-4">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-600/20 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm flex-shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                                    <p className="text-xs text-gray-400">Đã bán: {p.totalSold} sản phẩm</p>
                                </div>
                                <p className="text-sm font-semibold text-green-400 flex-shrink-0">
                                    {formatCurrency(p.totalRevenue || 0)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
