import { motion } from 'framer-motion';
import { ShoppingCart, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/api/products';
import { Button } from '@/components/ui';

// ═══════════════════════════════════════════════════════════════
// PRODUCT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all"
        >
            {/* Near Expiry Badge */}
            {product.isNearExpiry && (
                <div className="absolute top-2 right-2 z-10 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Sắp hết hạn
                </div>
            )}

            {/* Image */}
            <Link to={`/products/${product._id}`} className="block">
                <div className="aspect-square bg-gray-800 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
                            🛒
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                {product.category && (
                    <p className="text-xs text-primary-400 mb-1">{product.category.name}</p>
                )}

                {/* Name */}
                <Link to={`/products/${product._id}`}>
                    <h3 className="text-white font-medium mb-2 line-clamp-2 hover:text-primary-400 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price & Unit */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-primary-400">{formatPrice(product.price)}</span>
                    <span className="text-sm text-gray-400">/ {product.unit}</span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between mb-3">
                    {product.stockQuantity > 0 ? (
                        <span className="text-xs text-green-400">Còn {product.stockQuantity} {product.unit}</span>
                    ) : (
                        <span className="text-xs text-red-400">Hết hàng</span>
                    )}
                </div>

                {/* Add to Cart */}
                <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    leftIcon={<ShoppingCart className="w-4 h-4" />}
                    onClick={() => onAddToCart?.(product)}
                    disabled={product.stockQuantity === 0}
                >
                    Thêm vào giỏ
                </Button>
            </div>
        </motion.div>
    );
};
