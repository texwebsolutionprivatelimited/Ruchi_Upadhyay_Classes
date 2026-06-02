-- 1. Create a function to handle level-up rewards
CREATE OR REPLACE FUNCTION public.handle_level_up()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    reward_amount INTEGER := 100;
BEGIN
    -- Check if level has increased
    IF NEW.level > OLD.level THEN
        -- Add bonus reward points (level upgrade perk)
        -- We use a direct update to avoid re-triggering this function unnecessarily
        -- although recursion is usually stopped by the IF check anyway.
        NEW.reward_points := COALESCE(NEW.reward_points, 0) + reward_amount;
        NEW.xp := COALESCE(NEW.xp, 0) + reward_amount;

        -- Insert a notification for the user
        INSERT INTO public.notifications (
            user_id,
            title,
            message,
            type,
            is_read
        ) VALUES (
            NEW.user_id,
            'Level Up! 🎖️',
            'Congratulations! You reached Level ' || NEW.level || ' and earned ' || reward_amount || ' XP Bonus!',
            'reward',
            false
        );
    END IF;
    RETURN NEW;
END;
$$;

-- 2. Create the trigger for level updates
DROP TRIGGER IF EXISTS on_level_increase ON public.profiles;
CREATE TRIGGER on_level_increase
    BEFORE UPDATE OF level ON public.profiles
    FOR EACH ROW
    WHEN (NEW.level > OLD.level)
    EXECUTE FUNCTION public.handle_level_up();

-- 3. Enhanced referral RPC with dynamic milestone bonuses
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
    multiplier DECIMAL := 1.0;
BEGIN
    -- Find the referrer
    SELECT user_id, xp, reward_points, level INTO referrer_record 
    FROM public.profiles 
    WHERE referral_code = UPPER(TRIM(input_code));

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid referral code');
    END IF;

    -- Apply Level-based Multiplier
    IF referrer_record.level >= 10 THEN
        multiplier := 1.1; -- 10% bonus
    ELSIF referrer_record.level >= 5 THEN
        multiplier := 1.05; -- 5% bonus
    END IF;

    bonus_referrer := ROUND(bonus_referrer * multiplier);

    -- Prevent self-referral
    IF referrer_record.user_id = new_user_id THEN
        RETURN jsonb_build_object('success', false, 'message', 'You cannot use your own referral code');
    END IF;

    -- Check new user profile
    SELECT referred_by INTO new_user_record 
    FROM public.profiles 
    WHERE user_id = new_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'User profile not yet initialized.');
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
        'message', 'Referral applied! You earned ' || bonus_new_user || ' XP bonus!',
        'referrer_bonus', bonus_referrer,
        'new_user_bonus', bonus_new_user
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;
