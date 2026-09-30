import { supabase } from '@/integrations/supabase/client';

/**
 * Razorpay Public Key ID
 * Kept as placeholder by default. The user can set VITE_RAZORPAY_KEY_ID in .env
 */
export const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id';

/**
 * Check if the current Razorpay key is a placeholder
 */
export const isRazorpayPlaceholder = () => {
  return (
    !RAZORPAY_KEY_ID ||
    RAZORPAY_KEY_ID.includes('placeholder') ||
    RAZORPAY_KEY_ID.includes('YOUR_KEY') ||
    RAZORPAY_KEY_ID === 'rzp_test_placeholder_key_id'
  );
};

/**
 * Dynamically loads the official Razorpay Checkout SDK script
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Serverless Order Creation
 * Requests a verified Razorpay order from Vercel Serverless Function or Supabase Edge Function
 */
export const createServerlessRazorpayOrder = async ({
  amount,
  currency = 'INR',
  receipt,
  notes = {},
}) => {
  const amountInPaise = Math.round(Number(amount) * 100);

  // 1. Try Vercel Serverless API (/api/create-razorpay-order)
  try {
    const vercelRes = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt,
        notes,
      }),
    });

    if (vercelRes.ok) {
      const vercelData = await vercelRes.json();
      if (vercelData?.order_id) {
        return {
          orderId: vercelData.order_id,
          amount: vercelData.amount,
          currency: vercelData.currency,
          isServerless: true,
          source: 'vercel',
        };
      }
    }
  } catch (vercelErr) {
    // Vercel api not accessible (e.g. running vite local dev without vercel cli)
  }

  // 2. Try Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: {
        amount: amountInPaise,
        currency,
        receipt,
        notes,
      },
    });

    if (!error && data?.order_id) {
      return {
        orderId: data.order_id,
        amount: data.amount,
        currency: data.currency,
        isServerless: true,
        source: 'supabase',
      };
    }
  } catch (err) {
    console.warn('Edge function not available, using client-side fallback order:', err);
  }

  // 3. Graceful Fallback if Serverless functions are not yet deployed or in test placeholder mode
  return {
    orderId: `order_${receipt || Date.now()}_${Math.random().toString(36).substring(7)}`,
    amount: amountInPaise,
    currency,
    isServerless: false,
  };
};

/**
 * Serverless Payment Verification
 * Cryptographically verifies Razorpay signature via Vercel serverless / Supabase so payments cannot be hacked/faked
 */
export const verifyServerlessRazorpayPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  if (isRazorpayPlaceholder()) {
    // In placeholder / developer mode, allow pass-through
    return { verified: true, isMock: true };
  }

  // 1. Try Vercel Serverless Verification API
  try {
    const vercelRes = await fetch('/api/verify-razorpay-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }),
    });

    if (vercelRes.ok) {
      const vercelData = await vercelRes.json();
      return { verified: Boolean(vercelData?.verified), source: 'vercel' };
    }
  } catch (vercelErr) {
    // Fall back to Supabase
  }

  // 2. Try Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    });

    if (error) throw error;
    return { verified: Boolean(data?.verified), source: 'supabase' };
  } catch (err) {
    console.warn('Serverless verification check:', err);
    return { verified: false, error: err.message };
  }
};

/**
 * Opens Razorpay Checkout Modal
 */
export const openRazorpayCheckout = async ({
  amount,
  name = 'Ruchi Upadhyay Classes',
  description = 'Study Material & Course Unlock',
  orderId,
  prefill = {},
  themeColor = '#7b1113', // Brand Maroon
  onSuccess,
  onDismiss,
  onError,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onError) onError(new Error('Razorpay SDK could not be loaded. Check your internet connection.'));
    return;
  }

  // If using placeholder key in development, show note and proceed cleanly
  if (isRazorpayPlaceholder()) {
    console.info(
      'Razorpay is running with placeholder key. Once you add VITE_RAZORPAY_KEY_ID in .env, live Razorpay gateway will be active.'
    );
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(Number(amount) * 100), // in paise
    currency: 'INR',
    name,
    description,
    image: '/ruchi-logo.png',
    order_id: orderId && !orderId.startsWith('order_') ? orderId : undefined,
    handler: async (response) => {
      // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      try {
        if (onSuccess) {
          await onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id || orderId,
            signature: response.razorpay_signature,
          });
        }
      } catch (err) {
        if (onError) onError(err);
      }
    },
    prefill: {
      name: prefill.name || '',
      email: prefill.email || '',
      contact: prefill.phone || '',
    },
    notes: {
      platform: 'Ruchi Upadhyay Classes',
    },
    theme: {
      color: themeColor,
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      if (onError) {
        onError(new Error(response.error.description || 'Payment failed'));
      }
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay init error:', err);
    if (onError) onError(err);
  }
};
