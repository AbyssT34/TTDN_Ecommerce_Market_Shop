import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { getProductById } from '@/lib/api/products';
import { Button, GlassCard, toast } from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { reserveStock } from '@/lib/api/cart';

// ═══════════════════════════════════════════════════════════════
// PRODUCT DETAIL PAGE
// ═══════════════════════════════════════════════════════════════

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const setReservationExpiry = useCartStore((state) => state.setReservationExpiry);

    const { data, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id!),
        enabled: !!id,
    });

    const product = data?.product;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            const response = await reserveStock({
                productId: product._id,
                quantity,
            });

            addItem({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity,
                unit: product.unit,
                image: product.images[0]?.url || '',
            });

            setReservationExpiry(new Date(response.expiresAt));
            toast.success(`Đã thêm ${quantity} ${product.unit} ${product.name} vào giỏ!`);
            navigate('/cart');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Không thể thêm vào giỏ';
            toast.error(message);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <GlassCard variant="dark" padding="lg" className="text-center">
                    <p className="text-red-400">Không tìm thấy sản phẩm</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/products')}>
                        Quay lại danh sách
                    </Button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Button
                variant="ghost"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate('/products')}
                className="mb-6"
            >
                Quay lại
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <GlassCard variant="dark" padding="none">
                        <div className="aspect-square bg-gray-800">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0].url}
                                    alt={product.images[0].alt || product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-6xl">
                                    🛒
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Product Info */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <GlassCard variant="dark" padding="lg">
                        {/* Category */}
                        {product.category && (
                            <p className="text-sm text-primary-400 mb-2">{product.category.name}</p>
                        )}

                        {/* Name */}
                        <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-bold text-primary-400">
                                {formatPrice(product.price)}
                            </span>
                            <span className="text-gray-400">/ {product.unit}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 mb-6">{product.description}</p>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-500">Tình trạng</p>
                                {product.stockQuantity > 0 ? (
                                    <p className="text-green-400">Còn {product.stockQuantity} {product.unit}</p>
                                ) : (
                                    <p className="text-red-400">Hết hàng</p>
                                )}
                            </div>
                            {product.origin && (
                                <div>
                                    <p className="text-sm text-gray-500">Nguồn gốc</p>
                                    <p className="text-white">{product.origin}</p>
                                </div>
                            )}
                            {product.expiryDate && (
                                <div>
                                    <p className="text-sm text-gray-500">Hạn sử dụng</p>
                                    <p className="text-white">
                                        {new Date(product.expiryDate).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            )}
                            {product.storageType && (
                                <div>
                                    <p className="text-sm text-gray-500">Bảo quản</p>
                                    <p className="text-white">{product.storageType}</p>
                                </div>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-400 mb-2">Số lượng</p>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-2xl font-bold text-white w-16 text-center">
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                                    disabled={quantity >= product.stockQuantity}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            leftIcon={<ShoppingCart className="w-5 h-5" />}
                            onClick={handleAddToCart}
                            disabled={product.stockQuantity === 0}
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
};
