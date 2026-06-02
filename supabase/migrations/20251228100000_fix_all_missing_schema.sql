-- FIX: Add missing columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS reward_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);

-- FIX: Create referrals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES auth.users(id) NOT NULL,
    referred_user_id UUID REFERENCES auth.users(id),
    referral_code TEXT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policies for referrals
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referrals' AND policyname = 'Users can view their own referrals') THEN
        CREATE POLICY "Users can view their own referrals" ON public.referrals
        FOR SELECT USING (auth.uid() = referrer_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referrals' AND policyname = 'Users can create referrals') THEN
        CREATE POLICY "Users can create referrals" ON public.referrals
        FOR INSERT WITH CHECK (auth.uid() = referrer_id);
    END IF;
END $$;

-- FIX: Add missing columns to purchases
ALTER TABLE public.purchases 
ADD COLUMN IF NOT EXISTS test_id UUID REFERENCES public.tests(id),
ADD COLUMN IF NOT EXISTS note_id UUID REFERENCES public.notes(id);

-- FIX: Ensure test_results columns exist (just in case)
ALTER TABLE public.test_results
ADD COLUMN IF NOT EXISTS test_id TEXT, -- Note: In migration it was TEXT, inconsistent with UUID but stick to existing
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- FIX: Generate referral codes for existing profiles
UPDATE public.profiles 
SET referral_code = 'REF' || substring(md5(random()::text) from 1 for 6)
WHERE referral_code IS NULL;
