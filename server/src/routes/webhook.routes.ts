import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/webhooks/sepay
router.post('/sepay', async (req: Request, res: Response) => {
  // SePay webhook handler - Phase 3
  // Will verify signature and update order payment status
  console.log('SePay webhook received');
  res.json({ success: true, message: 'Webhook received' });
});

export default router;
