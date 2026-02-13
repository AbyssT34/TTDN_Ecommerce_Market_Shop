import { Request, Response } from 'express';
import { Product } from '../models/Product.model.js';
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════════════════

const createProductSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().int().positive('Price must be positive integer (VND)'),
    stock: z.number().int().nonnegative('Stock cannot be negative'),
    unit: z.enum(['kg', 'gram', 'pack', 'bundle', 'carton', 'piece']),
    sku: z.string().optional(),
    category: z.string(),
    images: z.array(z.string().url()).min(1, 'At least one image required'),
    tags: z.array(z.string()).optional(),
    origin: z.string().optional(),
    storageType: z.string().optional(),
    expiryDate: z.string().optional(), // ISO date string
    manufacturingDate: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════
// CONTROLLERS
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/products
 * Get all products with pagination, filter, search
 */
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = { isActive: true };

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice as string);
            if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice as string);
        }

        // Unit filter
        if (req.query.unit) {
            filter.unit = req.query.unit;
        }

        // Tags filter
        if (req.query.tags) {
            const tags = (req.query.tags as string).split(',');
            filter.tags = { $in: tags };
        }

        // Search (name or description)
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
            ];
        }

        // Sort
        let sort: any = { createdAt: -1 }; // Default: newest first
        if (req.query.sort === 'price_asc') sort = { price: 1 };
        else if (req.query.sort === 'price_desc') sort = { price: -1 };
        else if (req.query.sort === 'name') sort = { name: 1 };

        // Execute query
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Product.countDocuments(filter);

        // Check for near-expiry products and add tag
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const enhancedProducts = products.map((product: any) => {
            const isNearExpiry =
                product.expiryDate && new Date(product.expiryDate) <= threeDaysFromNow;
            return {
                ...product,
                isNearExpiry,
            };
        });

        res.json({
            products: enhancedProducts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

/**
 * GET /api/products/:id
 * Get product by ID
 */
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug description')
            .lean();

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check near-expiry
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const isNearExpiry =
            product.expiryDate && new Date(product.expiryDate) <= threeDaysFromNow;

        res.json({
            product: {
                ...product,
                isNearExpiry,
            },
        });
    } catch (error: any) {
        console.error('Get product by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

/**
 * POST /api/products
 * Create new product (Admin only)
 */
export const createProduct = async (req: Request, res: Response) => {
    try {
        const validated = createProductSchema.parse(req.body);

        const product = await Product.create(validated);

        res.status(201).json({ product });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

/**
 * PUT /api/products/:id
 * Update product (Admin only)
 */
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const validated = createProductSchema.partial().parse(req.body);

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: validated },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

/**
 * DELETE /api/products/:id
 * Soft delete product (Admin only)
 */
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: false } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
