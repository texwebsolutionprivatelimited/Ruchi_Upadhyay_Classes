-- Fix user_badges permissions and ensure columns are correct
-- 1. Ensure badge_id is UUID
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE public.user_badges 
        ALTER COLUMN badge_id TYPE UUID USING badge_id::UUID;
    EXCEPTION
        WHEN others THEN 
            RAISE NOTICE 'Could not convert badge_id to UUID or it is already UUID';
    END;
END $$;

-- 2. Drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Users can view their own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert their own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can see their own earned badges" ON public.user_badges;

-- 3. Re-create clean RLS policies
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own badges" 
ON public.user_badges FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" 
ON public.user_badges FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also ensure badges table is viewable
DROP POLICY IF EXISTS "Everyone can see badges" ON public.badges;
CREATE POLICY "Everyone can see badges" ON public.badges FOR SELECT USING (true);
