-- Create Wallet Transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earning', 'spending')),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transactions"
ON public.wallet_transactions FOR SELECT
USING (auth.uid() = user_id);

-- Trigger Function to log XP/Point events
CREATE OR REPLACE FUNCTION public.log_wallet_transaction()
RETURNS TRIGGER AS $$
DECLARE
    v_desc TEXT;
    v_type TEXT := 'earning';
BEGIN
    -- This function will be called by other functions to log transactions
    -- Since we can't easily use TG_TABLE_NAME for generic logging across multiple sources 
    -- without complex logic, we'll mostly call this explicitly or via specialized triggers.
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update level up function to log transaction
CREATE OR REPLACE FUNCTION public.handle_level_up()
RETURNS TRIGGER AS $$
DECLARE
    xp_bonus INTEGER := 100;
    points_bonus INTEGER := 100;
BEGIN
    IF NEW.level > OLD.level AND NEW.level > 1 THEN
        -- Award XP and Points bonuses
        UPDATE public.profiles
        SET 
            xp = xp + xp_bonus,
            weekly_xp = weekly_xp + xp_bonus,
            monthly_xp = monthly_xp + xp_bonus,
            reward_points = reward_points + points_bonus
        WHERE user_id = NEW.user_id;

        -- Log to wallet_transactions
        INSERT INTO public.wallet_transactions (user_id, amount, type, description)
        VALUES (NEW.user_id, points_bonus, 'earning', 'Level ' || NEW.level || ' Welcome Bonus 🏆');

        -- Create notification
        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (
            NEW.user_id,
            'Level Up! 🏆',
            'Congratulations! You reached Level ' || NEW.level || ' and earned ' || xp_bonus || ' XP bonus!',
            'success'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update course completion function to log transaction
CREATE OR REPLACE FUNCTION public.handle_course_completion_xp()
RETURNS TRIGGER AS $$
DECLARE
    v_xp_reward INTEGER;
    v_course_title TEXT;
BEGIN
    IF NEW.progress = 100 AND (OLD.progress IS NULL OR OLD.progress < 100) THEN
        SELECT xp_reward, title INTO v_xp_reward, v_course_title
        FROM public.courses
        WHERE id = NEW.course_id;

        IF v_xp_reward IS NULL THEN v_xp_reward := 100; END IF;

        UPDATE public.profiles
        SET 
            xp = xp + v_xp_reward,
            weekly_xp = weekly_xp + v_xp_reward,
            monthly_xp = monthly_xp + v_xp_reward,
            reward_points = reward_points + v_xp_reward,
            last_activity_date = now()
        WHERE user_id = NEW.user_id;

        -- Log to wallet_transactions
        INSERT INTO public.wallet_transactions (user_id, amount, type, description)
        VALUES (NEW.user_id, v_xp_reward, 'earning', 'Course Completed: ' || v_course_title || ' 🎉');

        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (
            NEW.user_id,
            'Course Completed! 🎉',
            'You finished "' || v_course_title || '" and earned ' || v_xp_reward || ' XP!',
            'success'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Purchase Point Usage
CREATE OR REPLACE FUNCTION public.handle_purchase_wallet_log()
RETURNS TRIGGER AS $$
BEGIN
    -- Log Spending (Points Used)
    IF NEW.points_used > 0 THEN
        INSERT INTO public.wallet_transactions (user_id, amount, type, description)
        VALUES (NEW.user_id, NEW.points_used, 'spending', 'Points used for order #' || NEW.order_id);
    END IF;

    -- Note: Points earned from purchase (if any system exists) would go here
    -- But currently points are earned via activities.
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for purchases
DROP TRIGGER IF EXISTS purchase_wallet_log_trigger ON public.purchases;
CREATE TRIGGER purchase_wallet_log_trigger
AFTER INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.handle_purchase_wallet_log();

-- Update referral completion to log transaction
-- Assuming handle_referral_completion exists or we use a trigger on referrals update
CREATE OR REPLACE FUNCTION public.handle_referral_completion_log()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO public.wallet_transactions (user_id, amount, type, description)
        VALUES (NEW.referrer_id, NEW.points_earned, 'earning', 'Referral Bonus: User Joined 🤝');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS referral_wallet_log_trigger ON public.referrals;
CREATE TRIGGER referral_wallet_log_trigger
AFTER UPDATE ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION public.handle_referral_completion_log();
