-- Fix badge_id type in user_badges to match badges table UUID
-- This handles the case where it was previously created as TEXT
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE public.user_badges 
        ALTER COLUMN badge_id TYPE UUID USING badge_id::UUID;
    EXCEPTION
        WHEN others THEN 
            RAISE NOTICE 'Could not convert badge_id to UUID, it might already be UUID or table might not exist';
    END;
END $$;
