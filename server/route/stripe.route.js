import express from 'express';

const router = express.Router();

// Create a Checkout Session (use dynamic import so server doesn't crash if stripe isn't installed)
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body; // amount in smallest currency unit (VND uses no decimals)

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!process.env.STRIPE_SECRET) {
      console.warn('⚠️ STRIPE_SECRET not set in environment.');
      return res.status(500).json({ error: 'Stripe not configured on server' });
    }

    let Stripe;
    try {
      Stripe = (await import('stripe')).default;
    } catch (err) {
      console.error('Stripe package not installed:', err.message);
      return res.status(500).json({ error: 'Stripe package not installed on server' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET || '');

    const successUrl = (process.env.VITE_CLIENT_URL || 'http://localhost:5173') + '/success';
    const cancelUrl = (process.env.VITE_CLIENT_URL || 'http://localhost:5173') + '/cancel';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            product_data: { name: 'Order Payment' },
            unit_amount: parseInt(amount, 10),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Newer Stripe SDKs provide a `url` on the session which can be used
    // client-side to navigate directly to Checkout (recommended).
    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe create-checkout-session error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health/status endpoint to check whether Stripe secret is configured
router.get('/status', (req, res) => {
  res.json({ configured: !!process.env.STRIPE_SECRET });
});

// Create a PaymentIntent for in-page payment (Payment Element)
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) return res.status(400).json({ error: 'Invalid amount' });

    if (!process.env.STRIPE_SECRET) {
      console.warn('⚠️ STRIPE_SECRET not set in environment.');
      return res.status(500).json({ error: 'Stripe not configured on server' });
    }

    let Stripe;
    try {
      Stripe = (await import('stripe')).default;
    } catch (err) {
      console.error('Stripe package not installed:', err.message);
      return res.status(500).json({ error: 'Stripe package not installed on server' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET || '');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount, 10),
      currency: 'vnd',
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_APP_STRIPE_ID,
    });
  } catch (err) {
    console.error('create-payment-intent error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
