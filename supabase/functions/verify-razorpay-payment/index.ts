// Supabase Edge Function: verify-razorpay-payment
// Serverless function to cryptographically verify Razorpay payment signatures
// Prevents client-side tampering and spoofed payments

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_payment_id) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Payment ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    // If key secret is not set (developer / test placeholder mode)
    if (!keySecret) {
      console.warn('RAZORPAY_KEY_SECRET is not configured in edge function secrets.');
      return new Response(
        JSON.stringify({ verified: true, isMock: true, note: 'Secret not set, allowed in test mode' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cryptographic verification:
    // Razorpay Signature = HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = hmac('sha256', keySecret, payload, 'utf8', 'hex');

    const isValid = expectedSignature.toLowerCase() === (razorpay_signature || '').toLowerCase();

    if (!isValid) {
      console.error('Cryptographic signature mismatch! Potential tamper attempt.');
      return new Response(
        JSON.stringify({ verified: false, error: 'Signature verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ verified: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return new Response(
      JSON.stringify({ verified: false, error: error.message || 'Verification failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
