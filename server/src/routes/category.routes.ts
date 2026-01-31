import { Router } from 'express';

const router = Router();

// GET /api/categories
router.get('/', async (req, res) => {
  res.json({ success: true, message: 'Get all categories - Phase 3' });
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  res.json({ success: true, message: 'Get category by slug - Phase 3' });
});

// POST /api/categories (Admin)
router.post('/', async (req, res) => {
  res.json({ success: true, message: 'Create category - Phase 4' });
});

// PUT /api/categories/:id (Admin)
router.put('/:id', async (req, res) => {
  res.json({ success: true, message: 'Update category - Phase 4' });
});

// DELETE /api/categories/:id (Admin)
router.delete('/:id', async (req, res) => {
  res.json({ success: true, message: 'Delete category - Phase 4' });
});

export default router;
