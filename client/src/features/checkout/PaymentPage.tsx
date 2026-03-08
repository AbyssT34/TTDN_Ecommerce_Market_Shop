import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Copy, Check, Clock, ArrowLeft, QrCode, CreditCard } from 'lucide-react';
import { getOrderById } from '@/lib/api/orders';
import { GlassCard, Button, toast } from '@/components/ui';

// ═══════════════════════════════════════════════════════════════
// BANK TRANSFER PAYMENT PAGE
// Shows VietQR code + payment details for bank transfer orders
// ═══════════════════════════════════════════════════════════════

// Bank config — Can be moved to env/config later
const BANK_CONFIG = {
    bankId: 'MB',           // MBBank (ngân hàng quân đội)
    accountNo: '0389892547', // Số tài khoản
    accountName: 'BUI NGOC THU', // Tên chủ tài khoản
    template: 'compact2',   // VietQR template
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export const PaymentPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [_searchParams] = useSearchParams();
    const [copied, setCopied] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(15 * 60); // 15 minutes

    const { data, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId,
    });

    const order = data?.order;

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
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
    }, []);

    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    // Build transfer content: "DH[orderNumber]"
    const transferContent = order?.orderNumber || `DH${orderId?.slice(-8).toUpperCase()}`;

    // VietQR URL (free, no API key needed)
    const qrUrl = order
        ? `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-${BANK_CONFIG.template}.png?amount=${order.total}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`
        : '';

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        toast.success(`Đã sao chép ${label}`);
        setTimeout(() => setCopied(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-400">Không tìm thấy đơn hàng</p>
                <Button variant="outline" onClick={() => navigate('/orders')} className="mt-4">
                    Về danh sách đơn hàng
                </Button>
            </div>
        );
    }

    // If already paid or COD, redirect to order detail
    if (order.paymentMethod === 'cod' || order.paymentStatus === 'paid') {
        navigate(`/orders/${orderId}`, { replace: true });
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Back button */}
            <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Về chi tiết đơn hàng</span>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        Thanh toán trong {minutes}:{seconds.toString().padStart(2, '0')}
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-white">Thanh toán chuyển khoản</h1>
                <p className="text-gray-400 mt-1">
                    Đơn hàng <span className="text-primary-400 font-mono">#{transferContent}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code */}
                <GlassCard variant="dark" padding="lg" className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                        <QrCode className="w-5 h-5 text-primary-400" />
                        <h3 className="text-lg font-bold text-white">Quét mã QR</h3>
                    </div>

                    <div className="bg-white rounded-xl p-3 mb-4">
                        <img
                            src={qrUrl}
                            alt="VietQR Payment"
                            className="w-64 h-64 object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-${BANK_CONFIG.template}.png`;
                            }}
                        />
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        Mở app ngân hàng → Quét mã QR → Xác nhận thanh toán
                    </p>
                </GlassCard>

                {/* Payment Details */}
                <GlassCard variant="dark" padding="lg">
                    <div className="flex items-center gap-2 mb-4">
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
                                <p className="text-white font-mono text-lg font-bold">{BANK_CONFIG.accountNo}</p>
                                <button
                                    onClick={() => copyToClipboard(BANK_CONFIG.accountNo, 'số tài khoản')}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied === 'số tài khoản' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
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
                                <p className="text-emerald-400 font-bold text-xl">{formatPrice(order.total)}</p>
                                <button
                                    onClick={() => copyToClipboard(order.total.toString(), 'số tiền')}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied === 'số tiền' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Transfer Content */}
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nội dung chuyển khoản</p>
                            <div className="flex items-center gap-2">
                                <p className="text-yellow-400 font-mono font-bold text-lg">{transferContent}</p>
                                <button
                                    onClick={() => copyToClipboard(transferContent, 'nội dung CK')}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied === 'nội dung CK' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="mt-6 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-xs text-yellow-300">
                            ⚠️ Vui lòng nhập <strong>chính xác</strong> nội dung chuyển khoản để đơn hàng được xác nhận tự động.
                        </p>
                    </div>
                </GlassCard>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(`/orders/${orderId}`)}
                >
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
};
