import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShoppingBag, ChefHat } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Shopping
              </span>

              <h1 className="text-4xl lg:text-6xl font-display font-bold text-dark-900 dark:text-white mb-6 leading-tight">
                Mua sắm thông minh với{' '}
                <span className="text-gradient">AI Recipe Intelligence</span>
              </h1>

              <p className="text-lg text-dark-600 dark:text-dark-300 mb-8 max-w-lg">
                Khám phá hàng ngàn công thức nấu ăn và mua nguyên liệu chỉ với một cú nhấp.
                AI sẽ gợi ý món ăn dựa trên nguyên liệu bạn có.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary px-6 py-3 text-lg">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Mua sắm ngay
                </Link>
                <Link to="/recipes" className="btn-outline px-6 py-3 text-lg">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Xem công thức
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 glass-sm rounded-2xl p-8">
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <ChefHat className="w-24 h-24 text-primary-500 mx-auto mb-4" />
                    <p className="text-dark-500 dark:text-dark-400">
                      Hero image placeholder
                    </p>
                    <p className="text-sm text-dark-400 dark:text-dark-500">
                      (Phase 3: Add real images)
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-dark-900 dark:text-white mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Trải nghiệm mua sắm thực phẩm hoàn toàn mới với công nghệ AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI Recipe Intelligence',
                description: 'Gợi ý món ăn dựa trên nguyên liệu có sẵn trong kho',
              },
              {
                icon: ShoppingBag,
                title: 'Smart Shopping',
                description: 'Thêm tất cả nguyên liệu vào giỏ hàng chỉ với một click',
              },
              {
                icon: ChefHat,
                title: 'Recipe Hub',
                description: 'Hàng ngàn công thức từ đơn giản đến phức tạp',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:border-primary-200 dark:hover:border-primary-800"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-600 dark:text-dark-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              Bắt đầu mua sắm thông minh ngay hôm nay
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Đăng ký miễn phí và khám phá hàng ngàn sản phẩm chất lượng cao
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Đăng ký ngay
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
