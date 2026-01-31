import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* 404 Illustration */}
        <div className="mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-[150px] font-display font-bold text-gradient"
          >
            404
          </motion.div>
        </div>

        <h1 className="text-3xl font-display font-bold text-dark-900 dark:text-white mb-4">
          Oops! Trang không tồn tại
        </h1>

        <p className="text-dark-600 dark:text-dark-400 mb-8 max-w-md mx-auto">
          Có vẻ như bạn đã lạc vào khu vực không có thức ăn.
          Hãy quay về trang chủ để tiếp tục khám phá!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn-primary px-6 py-3">
            <Home className="w-5 h-5 mr-2" />
            Về trang chủ
          </Link>
          <Link to="/shop" className="btn-outline px-6 py-3">
            <Search className="w-5 h-5 mr-2" />
            Tìm sản phẩm
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
