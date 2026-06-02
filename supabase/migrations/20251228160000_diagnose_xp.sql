-- 1. Check if any courses have 0 XP reward (This might be the cause)
SELECT id, title, xp_reward FROM public.courses;

-- 2. Check if the xp_awarded column was added correctly
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_courses' AND column_name = 'xp_awarded';

-- 3. Check if the trigger exists
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'user_courses';

-- 4. SIMPLIFIED & AGGRESSIVE TRIGGER (Try this if the previous one failed)
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
    -- Aggressive check: If progress is 100% and not awarded, GIVE IT.
    IF NEW.progress >= 100 AND NEW.xp_awarded = false THEN
        
        -- Use CAST to be 100% sure about UUID matching
        SELECT xp_reward, title INTO course_reward, course_name
        FROM public.courses
        WHERE id = CAST(NEW.course_id AS uuid);

        IF FOUND AND course_reward > 0 THEN
            -- Award XP
            UPDATE public.profiles
            SET 
                xp = COALESCE(xp, 0) + course_reward,
                reward_points = COALESCE(reward_points, 0) + course_reward
            WHERE user_id = NEW.user_id;

            -- Mark as awarded
            NEW.xp_awarded := true;
            NEW.completed_at := COALESCE(NEW.completed_at, now());

            -- Notification
            INSERT INTO public.notifications (user_id, title, message, type)
            VALUES (NEW.user_id, 'Course Completed! 🎉', 'You earned ' || course_reward || ' XP!', 'reward');
        END IF;
    END IF;
    RETURN NEW;
END;
$$;
