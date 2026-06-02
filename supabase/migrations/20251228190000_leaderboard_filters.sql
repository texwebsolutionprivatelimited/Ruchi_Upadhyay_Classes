-- Add weekly and monthly XP columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS weekly_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_xp INTEGER DEFAULT 0;

-- Update the level up reward function to include weekly/monthly XP
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

-- Update the course completion rewards function
CREATE OR REPLACE FUNCTION public.handle_course_completion_xp()
RETURNS TRIGGER AS $$
DECLARE
    v_xp_reward INTEGER;
    v_course_title TEXT;
BEGIN
    -- Check if progress reached 100% and XP hasn't been awarded yet
    IF NEW.progress = 100 AND (OLD.progress IS NULL OR OLD.progress < 100) THEN
        -- Get XP reward from courses table
        SELECT xp_reward, title INTO v_xp_reward, v_course_title
        FROM public.courses
        WHERE id = NEW.course_id;

        -- Default reward if not found
        IF v_xp_reward IS NULL THEN v_xp_reward := 100; END IF;

        -- Award XP to profile
        UPDATE public.profiles
        SET 
            xp = xp + v_xp_reward,
            weekly_xp = weekly_xp + v_xp_reward,
            monthly_xp = monthly_xp + v_xp_reward,
            reward_points = reward_points + v_xp_reward,
            last_activity_date = now()
        WHERE user_id = NEW.user_id;

        -- Create notification
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
