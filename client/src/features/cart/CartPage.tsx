import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Button, GlassCard } from '@/components/ui';
import { useEffect, useState } from 'react';
import { validateCart } from '@/lib/api/cart';

// ═══════════════════════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════════════════════

export const CartPage = () => {
    const navigate = useNavigate();
    const { items, subtotal, reservationExpiresAt, removeItem, updateQuantity, calculateSubtotal } =
        useCartStore();
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [wholesaleWarning, setWholesaleWarning] = useState<boolean>(false);
    const [perishableWeight, setPerishableWeight] = useState<number>(0);

    useEffect(() => {
        calculateSubtotal();
    }, [calculateSubtotal]);

    // Fetch cart validation for warnings
    useEffect(() => {
        if (items.length > 0) {
            validateCart().then(res => {
                setWholesaleWarning(res.requiresWholesaleContact || false);
                setPerishableWeight(res.totalPerishableWeight || 0);
            }).catch(console.error);
        }
    }, [items]);

    // Countdown timer
    useEffect(() => {
        if (!reservationExpiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(reservationExpiresAt).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeLeft('Hết hạn');
                clearInterval(interval);
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reservationExpiresAt]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <GlassCard variant="dark" padding="lg" className="text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h2 className="text-2xl font-bold text-white mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm</p>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                        Khám phá sản phẩm
                    </Button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Giỏ hàng của bạn</h1>

            {/* Reservation Timer */}
            {reservationExpiresAt && (
                <GlassCard variant="dark" padding="md" className="mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div>
                        <p className="text-white font-medium">Hàng được giữ trong: {timeLeft}</p>
                        <p className="text-sm text-gray-400">
                            Vui lòng thanh toán trước khi hết thời gian
                        </p>
                    </div>
                </GlassCard>
            )}

            {/* Wholesale Warning */}
            {wholesaleWarning && (
                <GlassCard variant="dark" padding="md" className="mb-6 flex items-center gap-3 border-orange-500/50">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <div>
                        <p className="text-white font-medium">Cảnh báo: Khối lượng hàng tươi sống lớn ({perishableWeight}kg)</p>
                        <p className="text-sm text-gray-400">
                            Bạn đang mua vượt quá 50kg hàng hóa cần bảo quản lạnh/đông. Vui lòng liên hệ bán buôn để được hỗ trợ giao hàng số lượng lớn.
                        </p>
                    </div>
                </GlassCard>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <GlassCard key={item.productId} variant="dark" padding="md">
                            <div className="flex gap-4">
                                {/* Image */}
                                <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                            🛒
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h3 className="text-white font-medium mb-1">{item.name}</h3>
                                    <p className="text-primary-400 font-bold">
                                        {formatPrice(item.price)} / {item.unit}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                                        >
                                            -
                                        </button>
                                        <span className="text-white w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Price & Remove */}
                                <div className="text-right">
                                    <p className="text-xl font-bold text-white mb-2">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="text-red-400 hover:text-red-300 p-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <GlassCard variant="dark" padding="lg" className="sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-4">Tổng cộng</h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-300">
                                <span>Tạm tính</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Phí vận chuyển</span>
                                <span>{formatPrice(30000)}</span>
                            </div>
                            <hr className="border-white/10" />
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span>Tổng</span>
                                <span>{formatPrice(subtotal + 30000)}</span>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={() => navigate('/checkout')}
                        >
                            Tiến hành thanh toán
                        </Button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
