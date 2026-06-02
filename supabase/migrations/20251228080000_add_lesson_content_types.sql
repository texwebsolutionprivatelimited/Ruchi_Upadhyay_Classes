-- Add content_type and file_url to lessons table
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'video';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Add check constraint for content_type
ALTER TABLE public.lessons ADD CONSTRAINT lessons_content_type_check CHECK (content_type IN ('video', 'pdf', 'quiz', 'link'));
