-- Add intro_video_url to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS intro_video_url TEXT;
