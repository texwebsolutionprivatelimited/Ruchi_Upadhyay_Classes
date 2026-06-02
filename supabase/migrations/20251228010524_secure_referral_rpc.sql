-- Create a secure RPC function to handle referrals
-- This runs with SECURITY DEFINER to bypass RLS and perform atomic updates
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
    result JSONB;
BEGIN
    -- 1. Find the referrer
    SELECT user_id, xp, reward_points INTO referrer_record 
    FROM public.profiles 
    WHERE referral_code = UPPER(input_code);

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid referral code');
    END IF;

    -- 2. Check if new user is trying to refer themselves
    IF referrer_record.user_id = new_user_id THEN
        RETURN jsonb_build_object('success', false, 'message', 'You cannot use your own referral code');
    END IF;

    -- 3. Check if new user already has a referrer
    SELECT referred_by INTO new_user_record 
    FROM public.profiles 
    WHERE user_id = new_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'User profile not found');
    END IF;

    IF new_user_record.referred_by IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'You have already used a referral code');
    END IF;

    -- 4. Perform Updates (Atomic Transaction)
    -- Update Referrer
    UPDATE public.profiles 
    SET 
        xp = xp + bonus_referrer,
        reward_points = reward_points + bonus_referrer
    WHERE user_id = referrer_record.user_id;

    -- Update New User
    UPDATE public.profiles 
    SET 
        xp = xp + bonus_new_user,
        reward_points = reward_points + bonus_new_user,
        referred_by = referrer_record.user_id
    WHERE user_id = new_user_id;

    -- Create Referral Record
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
        UPPER(input_code),
        bonus_referrer,
        'completed',
        now()
    );

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Referral applied successfully!',
        'referrer_bonus', bonus_referrer,
        'new_user_bonus', bonus_new_user
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;
