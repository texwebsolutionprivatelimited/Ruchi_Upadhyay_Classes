// Vercel Serverless Function: /api/verify-razorpay-payment
// Cryptographically verifies Razorpay signature on serverless backend

import crypto from 'crypto';

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_payment_id) {
      return res.status(400).json({ verified: false, error: 'Payment ID is required' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Placeholder / development mode fallback
    if (!keySecret) {
      console.warn('RAZORPAY_KEY_SECRET is not set in Vercel environment variables.');
      return res.status(200).json({
        verified: true,
        isMock: true,
        note: 'Secret not set in Vercel. Add RAZORPAY_KEY_SECRET for production cryptographic validation.',
      });
    }

    // Cryptographic signature check:
    // Razorpay signature = HMAC-SHA256(order_id + "|" + payment_id, secret)
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    const isValid = expectedSignature.toLowerCase() === (razorpay_signature || '').toLowerCase();

    if (!isValid) {
      console.error('Vercel signature mismatch: potential spoofing attempt blocked.');
      return res.status(400).json({
        verified: false,
        error: 'Cryptographic signature verification failed. Payment not genuine.',
      });
    }

    return res.status(200).json({
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Vercel verification error:', error);
    return res.status(500).json({ verified: false, error: error.message || 'Internal Server Error' });
  }
}
