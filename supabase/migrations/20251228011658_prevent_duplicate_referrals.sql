-- 1. Add unique constraint to referrals table to prevent duplicate reward entries
-- First, clean up any existing duplicates (keep only the oldest one per referred user)
DELETE FROM public.referrals a
USING public.referrals b
WHERE a.id > b.id 
AND a.referred_user_id = b.referred_user_id;

-- Add the unique constraint
ALTER TABLE public.referrals 
DROP CONSTRAINT IF EXISTS unique_referred_user;

ALTER TABLE public.referrals 
ADD CONSTRAINT unique_referred_user UNIQUE (referred_user_id);

-- 2. Update RPC with Row-level locking (FOR UPDATE) to prevent race conditions
CREATE OR REPLACE FUNCTION public.handle_referral(input_code TEXT, new_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    referrer_record RECORD;
    new_user_record RECORD;
    bonus_referrer INTEGER := 100;
    bonus_new_user INTEGER := 50;
BEGIN
    -- LOCK the new user's profile row immediately to prevent simultaneous calls
    -- This ensures other calls for the same user wait until this transaction finishes
    SELECT referred_by INTO new_user_record 
    FROM public.profiles 
    WHERE user_id = new_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'User profile not found');
    END IF;

    -- If already has a referrer, block immediately
    IF new_user_record.referred_by IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'You have already used a referral code');
    END IF;

    -- Check if user is already in referrals table (double check)
    IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_user_id = new_user_id) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Referral has already been processed');
    END IF;

    -- Find the referrer
    SELECT user_id INTO referrer_record 
    FROM public.profiles 
    WHERE referral_code = UPPER(TRIM(input_code));

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid referral code');
    END IF;

    -- Prevent self-referral
    IF referrer_record.user_id = new_user_id THEN
        RETURN jsonb_build_object('success', false, 'message', 'You cannot use your own referral code');
    END IF;

    -- PERFORM UPDATES (Now safe due to Row Lock)
    -- Update Referrer
    UPDATE public.profiles 
    SET 
        xp = COALESCE(xp, 0) + bonus_referrer,
        reward_points = COALESCE(reward_points, 0) + bonus_referrer
    WHERE user_id = referrer_record.user_id;

    -- Update New User
    UPDATE public.profiles 
    SET 
        xp = COALESCE(xp, 0) + bonus_new_user,
        reward_points = COALESCE(reward_points, 0) + bonus_new_user,
        referred_by = referrer_record.user_id
    WHERE user_id = new_user_id;

    -- Insert Referral Record (Will fail if constraint is violated)
    INSERT INTO public.referrals (
        referrer_id, 
        referred_user_id, 
        referral_code, 
        points_earned, 
        status, 
        completed_at
    ) VALUES (
        referrer_record.user_id,
        new_user_id,
        UPPER(TRIM(input_code)),
        bonus_referrer,
        'completed',
        now()
    );

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Referral applied successfully! +50 XP bonus added.',
        'referrer_bonus', bonus_referrer,
        'new_user_bonus', bonus_new_user
    );
EXCEPTION 
    WHEN unique_violation THEN
        RETURN jsonb_build_object('success', false, 'message', 'You have already used a referral code');
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;
