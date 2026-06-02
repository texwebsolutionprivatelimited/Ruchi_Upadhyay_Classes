-- Add enhanced course fields for premium card design
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS students INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS batch_info TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS whatsapp_link TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.courses.status IS 'Course status: upcoming, ongoing, completed, online';
COMMENT ON COLUMN public.courses.language IS 'Course language: English, Hindi, Hinglish, etc.';
COMMENT ON COLUMN public.courses.batch_info IS 'Batch information like "New Batch Plans included"';
COMMENT ON COLUMN public.courses.target_audience IS 'Target audience like "For Class 11th Science Students"';
