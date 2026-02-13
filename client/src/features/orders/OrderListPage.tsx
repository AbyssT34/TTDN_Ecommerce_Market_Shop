import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag } from 'lucide-react';
import { getMyOrders } from '@/lib/api/orders';
import { GlassCard, Button } from '@/components/ui';

// ═══════════════════════════════════════════════════════════════
// ORDER LIST PAGE
// ═══════════════════════════════════════════════════════════════

export const OrderListPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['my-orders'],
        queryFn: getMyOrders,
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'text-yellow-400 bg-yellow-400/10',
            confirmed: 'text-blue-400 bg-blue-400/10',
            preparing: 'text-purple-400 bg-purple-400/10',
            shipping: 'text-indigo-400 bg-indigo-400/10',
            completed: 'text-green-400 bg-green-400/10',
            cancelled: 'text-red-400 bg-red-400/10',
        };
        return colors[status] || 'text-gray-400 bg-gray-400/10';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Chờ xác nhận',
            confirmed: 'Đã xác nhận',
            preparing: 'Đang chuẩn bị',
            shipping: 'Đang giao',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
        };
        return labels[status] || status;
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <GlassCard variant="dark" padding="lg" className="text-center">
                    <p className="text-red-400">Không thể tải đơn hàng</p>
                </GlassCard>
            </div>
        );
    }

    const orders = data?.orders || [];

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <GlassCard variant="dark" padding="lg" className="text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h2 className="text-2xl font-bold text-white mb-2">Chưa có đơn hàng</h2>
                    <p className="text-gray-400 mb-6">Bạn chưa có đơn hàng nào</p>
                    <Link to="/products">
                        <Button variant="primary">Mua sắm ngay</Button>
                    </Link>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Đơn hàng của tôi</h1>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
            >
                {orders.map((order: any) => (
                    <GlassCard key={order._id} variant="dark" padding="lg">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Package className="w-5 h-5 text-primary-400" />
                                    <h3 className="text-white font-medium">Đơn #{order._id.slice(-6)}</h3>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                                {getStatusLabel(order.orderStatus)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">
                                    {order.items.length} sản phẩm
                                </p>
                                <p className="text-xl font-bold text-primary-400">
                                    {formatPrice(order.total)}
                                </p>
                            </div>
                            <Link to={`/orders/${order._id}`}>
                                <Button variant="outline" size="sm">
                                    Xem chi tiết
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>
                ))}
            </motion.div>
        </div>
    );
};
