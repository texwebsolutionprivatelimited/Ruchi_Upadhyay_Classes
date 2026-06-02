-- 1. Ensure columns exist
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'video';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS file_url TEXT;

-- 2. Add check constraint safely
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_content_type_check') THEN
        ALTER TABLE public.lessons ADD CONSTRAINT lessons_content_type_check CHECK (content_type IN ('video', 'pdf', 'quiz', 'link'));
    END IF;
END $$;

-- 3. Static comment to trigger schema change (Valid Syntax)
COMMENT ON TABLE public.lessons IS 'Table for course lessons with content type support';

-- 4. Force Notify
NOTIFY pgrst, 'reload schema';
