import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react';
import { getOrderById, cancelOrder } from '@/lib/api/orders';
import { GlassCard, Button, toast } from '@/components/ui';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// ORDER DETAIL PAGE
// ═══════════════════════════════════════════════════════════════

export const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cancelling, setCancelling] = useState(false);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['order', id],
        queryFn: () => getOrderById(id!),
        enabled: !!id,
    });

    const order = data?.order;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleCancel = async () => {
        if (!order || !window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

        setCancelling(true);
        try {
            await cancelOrder(order._id);
            toast.success('Đã hủy đơn hàng');
            refetch();
        } catch (error: any) {
            const message = error.response?.data?.error || 'Không thể hủy đơn';
            toast.error(message);
        } finally {
            setCancelling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <GlassCard variant="dark" padding="lg" className="text-center">
                    <p className="text-red-400">Không tìm thấy đơn hàng</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/orders')}>
                        Quay lại
                    </Button>
                </GlassCard>
            </div>
        );
    }

    const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/orders')}
                className="mb-6"
            >
                Quay lại
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <GlassCard variant="dark" padding="lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Package className="w-6 h-6 text-primary-400" />
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Đơn hàng #{order._id.slice(-6)}
                                    </h1>
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
                            </div>
                            {canCancel && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancel}
                                    loading={cancelling}
                                >
                                    Hủy đơn
                                </Button>
                            )}
                        </div>
                    </GlassCard>

                    {/* Items */}
                    <GlassCard variant="dark" padding="lg">
                        <h3 className="text-xl font-bold text-white mb-4">Sản phẩm</h3>
                        <div className="space-y-4">
                            {order.items.map((item: any, index: number) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product?.images?.[0] ? (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                🛒
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">{item.product?.name || 'N/A'}</h4>
                                        <p className="text-sm text-gray-400">
                                            {formatPrice(item.price)} x {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-white font-bold">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Shipping */}
                    <GlassCard variant="dark" padding="lg">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary-400" />
                            <h3 className="text-xl font-bold text-white">Địa chỉ giao hàng</h3>
                        </div>
                        <div className="text-gray-300">
                            <p className="font-medium text-white">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p className="mt-2">
                                {order.shippingAddress.street}, {order.shippingAddress.ward},{' '}
                                {order.shippingAddress.district}, {order.shippingAddress.city}
                            </p>
                        </div>
                    </GlassCard>

                    {/* Timeline */}
                    <GlassCard variant="dark" padding="lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-primary-400" />
                            <h3 className="text-xl font-bold text-white">Lịch sử đơn hàng</h3>
                        </div>
                        <div className="space-y-4">
                            {order.timeline.map((event: any, index: number) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary-400 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-white font-medium">{event.status}</p>
                                        <p className="text-sm text-gray-400">
                                            {new Date(event.timestamp).toLocaleString('vi-VN')}
                                        </p>
                                        {event.note && <p className="text-sm text-gray-500">{event.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <GlassCard variant="dark" padding="lg" className="sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-4">Tổng cộng</h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-300">
                                <span>Tạm tính</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Phí vận chuyển</span>
                                <span>{formatPrice(order.shippingFee)}</span>
                            </div>
                            <hr className="border-white/10" />
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span>Tổng</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">
                                    {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
                                </span>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
