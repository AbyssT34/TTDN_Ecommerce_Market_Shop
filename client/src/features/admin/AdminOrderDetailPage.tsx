import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle,
    AlertCircle, Loader2,
} from 'lucide-react';
import { adminGetOrderDetail, adminUpdateOrderStatus } from './services/adminApi';

const formatCurrency = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const formatDate = (d: string) =>
    new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// Status flow for progression
const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'shipping', 'completed'];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: 'Chờ xác nhận', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', icon: CheckCircle },
    preparing: { label: 'Đang chuẩn bị', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30', icon: Package },
    shipping: { label: 'Đang giao', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: Truck },
    completed: { label: 'Hoàn thành', color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: XCircle },
};

export function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchOrder = () => {
        setLoading(true);
        adminGetOrderDetail(id!)
            .then((d) => setOrder(d.order))
            .catch(() => setError('Không thể tải đơn hàng'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrder(); }, [id]);

    const handleUpdateStatus = async (nextStatus: string) => {
        setUpdating(true);
        setError('');
        try {
            await adminUpdateOrderStatus(id!, nextStatus);
            setSuccessMsg(`Đã cập nhật trạng thái → ${STATUS_CONFIG[nextStatus]?.label}`);
            fetchOrder();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Cập nhật thất bại');
        } finally {
            setUpdating(false);
        }
    };

    const getNextStatus = (current: string) => {
        const idx = STATUS_FLOW.indexOf(current);
        return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
    };

    const canCancel = (status: string) => ['pending', 'confirmed'].includes(status);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-16 text-gray-400">
                Không tìm thấy đơn hàng
            </div>
        );
    }

    const currentCfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG['pending'];
    const nextStatus = getNextStatus(order.orderStatus);

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">Đơn hàng #{order.orderNumber}</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Đặt lúc: {formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${currentCfg.color}`}>
                    {currentCfg.label}
                </span>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {successMsg}
                </div>
            )}

            {/* Action Buttons */}
            {order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled' && (
                <div className="flex flex-wrap gap-3">
                    {nextStatus && (
                        <button
                            onClick={() => handleUpdateStatus(nextStatus)}
                            disabled={updating}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                            Chuyển sang: {STATUS_CONFIG[nextStatus]?.label}
                        </button>
                    )}
                    {canCancel(order.orderStatus) && (
                        <button
                            onClick={() => {
                                if (window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) {
                                    handleUpdateStatus('cancelled');
                                }
                            }}
                            disabled={updating}
                            className="flex items-center gap-2 px-5 py-2.5 border border-red-500/40 text-red-400 rounded-xl font-semibold text-sm hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                            <XCircle className="w-4 h-4" />
                            Hủy đơn
                        </button>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Items + Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-5 border-b border-white/10">
                            <h2 className="font-semibold text-white">Sản phẩm ({order.items?.length})</h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {(order.items || []).map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    {item.product?.images?.[0] && (
                                        <img src={item.product.images[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-white/5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{item.name}</p>
                                        <p className="text-xs text-gray-400">x{item.quantity} {item.product?.unit || ''}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-white">{formatCurrency(item.subtotal)}</p>
                                        <p className="text-xs text-gray-400">{formatCurrency(item.price)}/đv</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-white/10 space-y-1.5">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Tạm tính</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Phí giao hàng</span>
                                <span>{formatCurrency(order.shippingFee)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-400">
                                    <span>Giảm giá</span>
                                    <span>-{formatCurrency(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                                <span>Tổng cộng</span>
                                <span className="text-green-400">{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <h2 className="font-semibold text-white mb-5">Lịch sử trạng thái</h2>
                        <div className="space-y-4">
                            {(order.timeline || []).slice().reverse().map((entry: any, i: number) => {
                                const cfg = STATUS_CONFIG[entry.status];
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg?.color || 'bg-gray-400/10 text-gray-400'}`}>
                                            {cfg ? <cfg.icon className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{cfg?.label || entry.status}</p>
                                            {entry.note && <p className="text-xs text-gray-400 mt-0.5">{entry.note}</p>}
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(entry.timestamp)}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Customer + Shipping + Payment */}
                <div className="space-y-4">
                    {/* Customer */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                        <h2 className="font-semibold text-white text-sm">Khách hàng</h2>
                        <p className="text-white font-medium">{order.user?.name || '—'}</p>
                        <p className="text-gray-400 text-sm">{order.user?.email}</p>
                        <p className="text-gray-400 text-sm">{order.user?.phone}</p>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                        <h2 className="font-semibold text-white text-sm">Địa chỉ giao hàng</h2>
                        <div className="text-sm text-gray-300 space-y-1">
                            <p className="font-medium text-white">{order.shippingAddress?.fullName}</p>
                            <p>{order.shippingAddress?.phone}</p>
                            <p>{order.shippingAddress?.street}</p>
                            <p>{[order.shippingAddress?.ward, order.shippingAddress?.district, order.shippingAddress?.city].filter(Boolean).join(', ')}</p>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                            <span className="text-xs text-gray-400">Khung giờ giao: </span>
                            <span className="text-sm text-green-400 font-medium">{order.deliverySlot}</span>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                        <h2 className="font-semibold text-white text-sm">Thanh toán</h2>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Phương thức</span>
                            <span className="text-white font-medium">
                                {order.paymentMethod === 'cod' ? '💵 COD' : '🏦 Chuyển khoản'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Trạng thái TT</span>
                            <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ TT'}
                            </span>
                        </div>
                        {order.sepayTransactionId && (
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-xs text-gray-500">Mã GD SePay</p>
                                <p className="text-xs font-mono text-gray-300 mt-0.5">{order.sepayTransactionId}</p>
                            </div>
                        )}
                        {order.notes && (
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-xs text-gray-500">Ghi chú</p>
                                <p className="text-sm text-gray-300 mt-0.5">{order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
