import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Root Application Component
 * Phase 1: Foundation - Basic setup with placeholder UI
 */
function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                {/* Main Content */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

/**
 * Homepage - Placeholder for Phase 2
 */
function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mb-8"
                >
                    <span className="text-6xl">🛒</span>
                </motion.div>

                {/* Title */}
                <h1 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary-400 via-accent-honey to-accent-orange bg-clip-text text-transparent">
                    Ecommerce Shop
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-gray-400 mb-8 max-w-lg">
                    AI-Powered Food Shopping Platform với Recipe Intelligence
                </p>

                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-400"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                    </span>
                    Phase 1: Foundation Complete
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 flex flex-wrap justify-center gap-3"
                >
                    {['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'MongoDB'].map(
                        (tech, i) => (
                            <span
                                key={tech}
                                className="px-3 py-1 text-sm rounded-md bg-white/5 border border-white/10 text-gray-300"
                            >
                                {tech}
                            </span>
                        )
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}

/**
 * 404 Page
 */
function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <span className="text-8xl mb-8 block">🍳</span>
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-gray-400 mb-8">
                    Oops! Trang này không tồn tại như nguyên liệu bạn quên mua.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 transition-colors font-medium"
                >
                    Về trang chủ
                </a>
            </motion.div>
        </div>
    );
}

export default App;
