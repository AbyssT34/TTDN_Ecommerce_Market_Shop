import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/auth.routes.js';

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

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
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
