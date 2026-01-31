import { Router } from 'express';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  res.json({ success: true, message: 'Get all products - Phase 3' });
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  res.json({ success: true, message: 'Get product by slug - Phase 3' });
});

// POST /api/products (Admin)
router.post('/', async (req, res) => {
  res.json({ success: true, message: 'Create product - Phase 4' });
});

// PUT /api/products/:id (Admin)
router.put('/:id', async (req, res) => {
  res.json({ success: true, message: 'Update product - Phase 4' });
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', async (req, res) => {
  res.json({ success: true, message: 'Delete product - Phase 4' });
});

export default router;
