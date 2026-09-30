// Supabase Edge Function: create-razorpay-order
// Serverless function to securely create Razorpay orders without exposing private secrets to client

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
    const { amount, currency = 'INR', receipt, notes } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Valid amount in paise is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const keyId = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_test_placeholder_key_id';
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    // If real keys are not set, return simulated secure order id
    if (!keySecret || keyId.includes('placeholder')) {
      return new Response(
        JSON.stringify({
          order_id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          amount,
          currency,
          isMock: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Razorpay API with server-side Basic Auth
    const authHeader = btoa(`${keyId}:${keySecret}`);
    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    const rzpData = await rzpResponse.json();

    if (!rzpResponse.ok) {
      console.error('Razorpay order creation failed:', rzpData);
      return new Response(
        JSON.stringify({ error: rzpData.error?.description || 'Razorpay order creation failed' }),
        { status: rzpResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        order_id: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
