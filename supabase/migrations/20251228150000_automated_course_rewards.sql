-- 1. Add xp_awarded column to user_courses to track if reward was given
ALTER TABLE public.user_courses ADD COLUMN IF NOT EXISTS xp_awarded BOOLEAN DEFAULT false;

-- 2. Create the trigger function for course completion XP
CREATE OR REPLACE FUNCTION public.handle_course_completion_xp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    course_reward INTEGER;
    course_name TEXT;
BEGIN
    -- Only trigger if progress reaching 100% and XP hasn't been awarded yet
    IF NEW.progress >= 100 AND (OLD.progress < 100 OR OLD.progress IS NULL) AND NEW.xp_awarded = false THEN
        
        -- Fetch the reward amount and title from courses table
        -- We cast course_id to UUID if it's stored as TEXT
        SELECT xp_reward, title INTO course_reward, course_name
        FROM public.courses
        WHERE id = NEW.course_id::UUID;

        IF FOUND AND course_reward > 0 THEN
            -- Award XP and Reward Points to the user's profile
            UPDATE public.profiles
            SET 
                xp = COALESCE(xp, 0) + course_reward,
                reward_points = COALESCE(reward_points, 0) + course_reward
            WHERE user_id = NEW.user_id;

            -- Mark as awarded in user_courses
            NEW.xp_awarded := true;
            NEW.completed_at := COALESCE(NEW.completed_at, now());

            -- Insert a notification for the user
            INSERT INTO public.notifications (
                user_id,
                title,
                message,
                type,
                is_read
            ) VALUES (
                NEW.user_id,
                'Course Completed! 🎉',
                'Congratulations! You earned ' || course_reward || ' XP for completing ' || course_name || '!',
                'reward',
                false
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- 3. Create the trigger on user_courses
DROP TRIGGER IF EXISTS on_course_progress_update ON public.user_courses;
CREATE TRIGGER on_course_progress_update
    BEFORE UPDATE ON public.user_courses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_course_completion_xp();

-- 4. Initial sync: Mark existing 100% courses as awarded so they don't double-trigger
-- Unless the user wants us to retroactively award? 
-- Let's NOT mark them yet, so if they uncheck/recheck it triggers.
