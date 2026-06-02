-- CRITICAL FIX: Add missing columns to lessons table if they are missing from schema cache
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'video';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Ensure the check constraint exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_content_type_check') THEN
        ALTER TABLE public.lessons ADD CONSTRAINT lessons_content_type_check CHECK (content_type IN ('video', 'pdf', 'quiz', 'link'));
    END IF;
END $$;

-- FORCE SCHEMA RELOAD (Important for resolving "Could not find column in schema cache" errors)
NOTIFY pgrst, 'reload schema';
