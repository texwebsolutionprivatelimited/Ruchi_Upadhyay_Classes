-- 1. Robust RLS for user_courses
DROP POLICY IF EXISTS "Users can view their own courses" ON public.user_courses;
DROP POLICY IF EXISTS "Users can insert their own courses" ON public.user_courses;
DROP POLICY IF EXISTS "Users can update their own courses" ON public.user_courses;
DROP POLICY IF EXISTS "user_courses_owner_access" ON public.user_courses;

CREATE POLICY "user_courses_owner_access" ON public.user_courses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Robust RLS for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable for leaderboard" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;

CREATE POLICY "profiles_owner_access" ON public.profiles
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_public_read" ON public.profiles
FOR SELECT TO authenticated, anon
USING (true);

-- 3. Ensure ALL trigger functions exist and have correct security
-- Course Rewards Trigger
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
    IF NEW.progress >= 100 AND (OLD.progress < 100 OR OLD.progress IS NULL) AND (NEW.xp_awarded = false OR NEW.xp_awarded IS NULL) THEN
        SELECT xp_reward, title INTO course_reward, course_name
        FROM public.courses
        WHERE id = NEW.course_id::UUID;

        IF FOUND AND course_reward > 0 THEN
            UPDATE public.profiles
            SET xp = COALESCE(xp, 0) + course_reward,
                reward_points = COALESCE(reward_points, 0) + course_reward
            WHERE user_id = NEW.user_id;

            NEW.xp_awarded := true;
            NEW.completed_at := COALESCE(NEW.completed_at, now());

            INSERT INTO public.notifications (user_id, title, message, type)
            VALUES (NEW.user_id, 'Course Completed! 🎉', 'You earned ' || course_reward || ' XP for ' || course_name, 'reward');
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Level Up Trigger
CREATE OR REPLACE FUNCTION public.handle_level_up()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    reward_amount INTEGER := 100;
BEGIN
    IF NEW.level > OLD.level THEN
        NEW.reward_points := COALESCE(NEW.reward_points, 0) + reward_amount;
        NEW.xp := COALESCE(NEW.xp, 0) + reward_amount;

        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (NEW.user_id, 'Level Up! 🎖️', 'Reached Level ' || NEW.level || ' and earned ' || reward_amount || ' XP Bonus!', 'reward');
    END IF;
    RETURN NEW;
END;
$$;

-- 4. Re-apply triggers
DROP TRIGGER IF EXISTS on_course_progress_update ON public.user_courses;
CREATE TRIGGER on_course_progress_update
    BEFORE UPDATE ON public.user_courses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_course_completion_xp();

DROP TRIGGER IF EXISTS on_level_increase ON public.profiles;
CREATE TRIGGER on_level_increase
    BEFORE UPDATE OF level ON public.profiles
    FOR EACH ROW
    WHEN (NEW.level > OLD.level)
    EXECUTE FUNCTION public.handle_level_up();
