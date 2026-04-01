import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import testRoutes from './routes/test.routes.js';
import adminRoutes from './routes/admin.routes.js';
import recipeRoutes from './routes/recipe.routes.js';
import chatRoutes from './routes/chat.routes.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

// Security headers
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            categories: '/api/categories',
            cart: '/api/cart',
            orders: '/api/orders',
            test: '/api/test (development only)',
        },
    });
});

// API root
app.get('/api', (_req: Request, res: Response) => {
    res.json({
        message: 'Welcome to Ecommerce Shop API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            products: '/api/products (coming soon)',
            categories: '/api/categories (coming soon)',
            orders: '/api/orders (coming soon)',
            recipes: '/api/recipes (coming soon)',
        },
    });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Product & Category routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Admin routes (protected: admin/superadmin only)
app.use('/api/admin', adminRoutes);

// Recipe routes (public)
app.use('/api/recipes', recipeRoutes);

// Chat/AI routes (public with optional auth)
app.use('/api/chat', chatRoutes);

// Test routes (Development only)
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/test', testRoutes);
}

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
});

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 Ecommerce Shop API Server                                 ║
║                                                                ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(43)}║
║   Port:        ${String(PORT).padEnd(43)}║
║   Health:      http://localhost:${PORT}/health${' '.repeat(24)}║
║   API:         http://localhost:${PORT}/api${' '.repeat(27)}║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
