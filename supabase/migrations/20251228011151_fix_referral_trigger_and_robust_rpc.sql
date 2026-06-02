-- 1. Robust Referral RPC with COALESCE and status checks
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
    -- Find the referrer
    SELECT user_id, xp, reward_points INTO referrer_record 
    FROM public.profiles 
    WHERE referral_code = UPPER(TRIM(input_code));

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid referral code');
    END IF;

    -- Prevent self-referral
    IF referrer_record.user_id = new_user_id THEN
        RETURN jsonb_build_object('success', false, 'message', 'You cannot use your own referral code');
    END IF;

    -- Check new user profile and existing referrer
    SELECT referred_by INTO new_user_record 
    FROM public.profiles 
    WHERE user_id = new_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'User profile not yet initialized. Please wait a moment.');
    END IF;

    IF new_user_record.referred_by IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'You have already used a referral code');
    END IF;

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

    -- Insert Referral Record
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
        'message', 'Referral applied! You earned 50 XP & Points bonus!',
        'referrer_bonus', bonus_referrer,
        'new_user_bonus', bonus_new_user
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- 2. Update handle_new_user trigger to include referral_code generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, referral_code, xp, reward_points, level, streak)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    'REF-' || UPPER(substring(md5(random()::text) from 1 for 6)),
    0,
    0,
    1,
    0
  );
  RETURN new;
END;
$$;
