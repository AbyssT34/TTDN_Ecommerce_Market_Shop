import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Copy, Check, Clock, QrCode, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Button, Input, GlassCard, toast } from '@/components/ui';
import { createOrder, Order } from '@/lib/api/orders';

// ═══════════════════════════════════════════════════════════════
// BANK CONFIG (for VietQR fallback)
// ═══════════════════════════════════════════════════════════════
const BANK_CONFIG = {
    bankId: 'MB',
    accountNo: '0389892547',
    accountName: 'BUI NGOC THU',
    template: 'compact2',
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// ═══════════════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);

    // Bank transfer inline payment state
    const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(15 * 60);
    const bankTransferRef = useRef(false); // Sync flag to prevent redirect race

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        ward: '',
        district: '',
        province: '',
        paymentMethod: 'COD' as 'COD' | 'BANK_TRANSFER',
    });

    // Countdown timer for bank transfer
    useEffect(() => {
        if (!createdOrder || countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [createdOrder, countdown]);

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        toast.success(`Đã sao chép ${label}`);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                items: items.map((item) => ({
                    product: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    ward: formData.ward,
                    district: formData.district,
                    province: formData.province,
                },
                paymentMethod: formData.paymentMethod,
            };

            const response = await createOrder(orderData);

            // If BANK_TRANSFER → show inline QR panel
            if (formData.paymentMethod === 'BANK_TRANSFER') {
                // Set ref FIRST (synchronous, survives re-render)
                bankTransferRef.current = true;
                setCreatedOrder(response.order);
                setCheckoutUrl(response.checkoutUrl || null);
                clearCart();
                toast.success('Đơn hàng đã tạo! Vui lòng thanh toán.');
                return;
            }

            clearCart();

            // COD: Navigate to order detail
            toast.success('Đặt hàng thành công!');
            navigate(`/orders/${response.order._id}`);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Đặt hàng thất bại';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // INLINE QR PAYMENT VIEW (after order created with BANK_TRANSFER)
    // ═══════════════════════════════════════════════════════════════

    if (createdOrder) {
        const transferContent = createdOrder.orderNumber || `DH${createdOrder._id.slice(-8).toUpperCase()}`;
        const orderTotal = createdOrder.total;

        // If SePay returned a checkout URL, embed it as iframe. Otherwise use VietQR
        const qrImageUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-${BANK_CONFIG.template}.png?amount=${orderTotal}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;

        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 mb-4">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span className="text-sm font-medium">
                            Vui lòng thanh toán trong {minutes}:{seconds.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Thanh toán chuyển khoản</h1>
                    <p className="text-gray-400 mt-1">
                        Đơn hàng <span className="text-primary-400 font-mono font-bold">#{transferContent}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* QR Code Panel */}
                    <GlassCard variant="dark" padding="lg" className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-4">
                            <QrCode className="w-5 h-5 text-primary-400" />
                            <h3 className="text-lg font-bold text-white">Quét mã QR</h3>
                        </div>

                        {/* If SePay has checkout URL, show as iframe, else show VietQR image */}
                        {checkoutUrl ? (
                            <div className="w-full rounded-xl overflow-hidden border border-white/10">
                                <iframe
                                    src={checkoutUrl}
                                    className="w-full h-[500px]"
                                    title="SePay Payment"
                                    frameBorder="0"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-xl p-3 mb-4 shadow-lg">
                                    <img
                                        src={qrImageUrl}
                                        alt="VietQR Payment"
                                        className="w-64 h-64 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-${BANK_CONFIG.template}.png`;
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 text-center px-4">
                                    Mở app ngân hàng → Quét mã QR → Xác nhận thanh toán
                                </p>
                            </>
                        )}
                    </GlassCard>

                    {/* Payment Details */}
                    <GlassCard variant="dark" padding="lg">
                        <div className="flex items-center gap-2 mb-5">
                            <CreditCard className="w-5 h-5 text-primary-400" />
                            <h3 className="text-lg font-bold text-white">Thông tin chuyển khoản</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Bank */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ngân hàng</p>
                                <p className="text-white font-medium">MB Bank (Ngân hàng Quân đội)</p>
                            </div>

                            {/* Account Number */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Số tài khoản</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-mono text-lg font-bold tracking-wider">{BANK_CONFIG.accountNo}</p>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(BANK_CONFIG.accountNo, 'STK')}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {copied === 'STK' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Account Name */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Chủ tài khoản</p>
                                <p className="text-white font-medium">{BANK_CONFIG.accountName}</p>
                            </div>

                            {/* Amount */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Số tiền</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-emerald-400 font-bold text-xl">{formatPrice(orderTotal)}</p>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(orderTotal.toString(), 'Số tiền')}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {copied === 'Số tiền' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Transfer Content */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nội dung chuyển khoản</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-yellow-400 font-mono font-bold text-lg">{transferContent}</p>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(transferContent, 'Nội dung')}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {copied === 'Nội dung' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Warning Note */}
                        <div className="mt-6 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-xs text-yellow-300">
                                ⚠️ Vui lòng nhập <strong>chính xác</strong> nội dung chuyển khoản để đơn hàng được xác nhận tự động.
                            </p>
                        </div>

                        {/* Order Summary Recap */}
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>Tạm tính</span>
                                <span>{formatPrice(createdOrder.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Phí vận chuyển</span>
                                <span>{formatPrice(createdOrder.shippingFee)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white">
                                <span>Tổng cộng</span>
                                <span className="text-emerald-400">{formatPrice(orderTotal)}</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={() => navigate(`/orders/${createdOrder._id}`)}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Xem chi tiết đơn hàng
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => navigate('/products')}
                    >
                        Tiếp tục mua sắm
                    </Button>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════
    // NORMAL CHECKOUT FORM
    // ═══════════════════════════════════════════════════════════════

    if (items.length === 0 && !createdOrder && !bankTransferRef.current) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <GlassCard variant="dark" padding="lg" className="max-w-md mx-auto">
                    <p className="text-gray-400 mb-4">Giỏ hàng trống</p>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                        Khám phá sản phẩm
                    </Button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Thanh toán</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Shipping & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <GlassCard variant="dark" padding="lg">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-primary-400" />
                                <h3 className="text-xl font-bold text-white">Địa chỉ giao hàng</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="fullName"
                                    label="Họ và tên"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="phone"
                                    label="Số điện thoại"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        name="address"
                                        label="Địa chỉ"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Input
                                    name="ward"
                                    label="Phường/Xã"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    name="district"
                                    label="Quận/Huyện"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        name="province"
                                        label="Tỉnh/Thành phố"
                                        value={formData.province}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        {/* Payment Method */}
                        <GlassCard variant="dark" padding="lg">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5 text-primary-400" />
                                <h3 className="text-xl font-bold text-white">Phương thức thanh toán</h3>
                            </div>

                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.paymentMethod === 'COD'
                                    ? 'bg-primary-500/10 border-primary-500/50'
                                    : 'bg-white/5 border-white/10 hover:border-primary-500/30'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === 'COD'}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-primary-500"
                                    />
                                    <div>
                                        <p className="text-white font-medium">Thanh toán khi nhận hàng (COD)</p>
                                        <p className="text-sm text-gray-400">
                                            Thanh toán bằng tiền mặt khi nhận hàng
                                        </p>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.paymentMethod === 'BANK_TRANSFER'
                                    ? 'bg-primary-500/10 border-primary-500/50'
                                    : 'bg-white/5 border-white/10 hover:border-primary-500/30'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="BANK_TRANSFER"
                                        checked={formData.paymentMethod === 'BANK_TRANSFER'}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-primary-500"
                                    />
                                    <div>
                                        <p className="text-white font-medium">Chuyển khoản ngân hàng</p>
                                        <p className="text-sm text-gray-400">Quét mã QR để thanh toán nhanh</p>
                                    </div>
                                </label>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <GlassCard variant="dark" padding="lg" className="sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-4">Đơn hàng</h3>

                            <div className="space-y-3 mb-4">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-gray-300">
                                            {item.name} x{item.quantity}
                                        </span>
                                        <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-white/10 mb-4" />

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

                            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                                Đặt hàng
                            </Button>
                        </GlassCard>
                    </div>
                </div>
            </form>
        </div>
    );
};
