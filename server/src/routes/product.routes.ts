import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// ═══════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════

router.post('/', authenticate, authorize('admin', 'superadmin'), createProduct);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), deleteProduct);

export default router;
