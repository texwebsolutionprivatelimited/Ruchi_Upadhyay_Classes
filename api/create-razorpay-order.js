// Vercel Serverless Function: /api/create-razorpay-order
// Securely creates Razorpay orders without exposing private secrets to client

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount in paise is required' });
    }

    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id';
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // In placeholder / developer mode when secret is not yet added to Vercel
    if (!keySecret || keyId.includes('placeholder')) {
      return res.status(200).json({
        order_id: `order_dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        amount: Math.round(Number(amount)),
        currency,
        isMock: true,
        message: 'Running with placeholder key. Add RAZORPAY_KEY_SECRET in Vercel to activate live orders.',
      });
    }

    // Call official Razorpay Orders API via basic auth
    const authString = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount)), // in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    const rzpData = await response.json();

    if (!response.ok) {
      console.error('Razorpay API error on Vercel:', rzpData);
      return res.status(response.status).json({
        error: rzpData.error?.description || 'Failed to create Razorpay order',
      });
    }

    return res.status(200).json({
      order_id: rzpData.id,
      amount: rzpData.amount,
      currency: rzpData.currency,
    });
  } catch (error) {
    console.error('Vercel order handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
