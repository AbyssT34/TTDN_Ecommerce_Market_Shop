import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { getProducts, Product } from '@/lib/api/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Input, Button, GlassCard, toast, ProductGridSkeleton } from '@/components/ui';
import { useCartStore } from '@/stores/cartStore';
import { reserveStock } from '@/lib/api/cart';

// ═══════════════════════════════════════════════════════════════
// PRODUCT LIST PAGE
// ═══════════════════════════════════════════════════════════════

export const ProductListPage = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const setReservationExpiry = useCartStore((state) => state.setReservationExpiry);

    const { data, isLoading, error } = useQuery({
        queryKey: ['products', page, search],
        queryFn: () =>
            getProducts({
                page,
                limit: 12,
                search: search || undefined,
            }),
    });

    const handleAddToCart = async (product: Product) => {
        try {
            // Reserve stock in backend
            const response = await reserveStock({
                productId: product._id,
                quantity: 1,
            });

            // Add to cart store
            addItem({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                unit: product.unit,
                image: product.images[0]?.url || '',
            });

            // Set reservation expiry
            setReservationExpiry(new Date(response.expiresAt));

            toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
        } catch (error: any) {
            const message = error.response?.data?.error || 'Không thể thêm vào giỏ';
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Sản phẩm</h1>
                <p className="text-gray-400">Khám phá thực phẩm tươi ngon mỗi ngày</p>
            </div>

            {/* Search & Filters */}
            <GlassCard variant="dark" padding="md" className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            leftIcon={<Search className="w-5 h-5" />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" leftIcon={<Filter className="w-5 h-5" />}>
                        Bộ lọc
                    </Button>
                </div>
            </GlassCard>

            {/* Loading Skeleton */}
            {isLoading && <ProductGridSkeleton count={8} />}

            {/* Error */}
            {error && (
                <GlassCard variant="dark" padding="lg" className="text-center">
                    <p className="text-red-400">Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
                </GlassCard>
            )}

            {/* Products Grid */}
            {data && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                    >
                        {data.products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </motion.div>

                    {/* Pagination */}
                    {data.pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Trước
                            </Button>
                            <span className="px-4 py-2 text-white">
                                Trang {page} / {data.pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= data.pagination.totalPages}
                            >
                                Sau
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
