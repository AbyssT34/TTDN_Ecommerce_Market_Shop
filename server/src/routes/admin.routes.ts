import { Router } from 'express';
import {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getOrderDetail,
    getAllUsers,
    toggleUserActive,
    uploadImage,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { UserRole } from '../models/index.js';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// ALL ADMIN ROUTES REQUIRE AUTHENTICATION + ADMIN ROLE
// ═══════════════════════════════════════════════════════════════

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPERADMIN));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Order management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetail);
router.put('/orders/:id/status', updateOrderStatus);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserActive);

// Image upload
router.post('/upload', uploadImage);

export default router;
