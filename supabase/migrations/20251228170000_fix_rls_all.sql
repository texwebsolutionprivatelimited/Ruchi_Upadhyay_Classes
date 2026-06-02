-- 1. Robust RLS for user_courses (Fixes 403 Forbidden on upsert)
DROP POLICY IF EXISTS "Users can view their own courses" ON public.user_courses;
DROP POLICY IF EXISTS "Users can insert their own courses" ON public.user_courses;
DROP POLICY IF EXISTS "Users can update their own courses" ON public.user_courses;

CREATE POLICY "user_courses_owner_access" ON public.user_courses
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Robust RLS for profiles (Ensuring rewards can be updated)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable for leaderboard" ON public.profiles;

CREATE POLICY "profiles_owner_access" ON public.profiles
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_public_read" ON public.profiles
FOR SELECT TO authenticated, anon
USING (true);

-- 3. Ensure search path is always set correctly for trigger functions to bypass RLS
ALTER FUNCTION public.handle_course_completion_xp() SET search_path = public;
ALTER FUNCTION public.handle_level_up() SET search_path = public;
ALTER FUNCTION public.handle_referral(TEXT, UUID) SET search_path = public;
