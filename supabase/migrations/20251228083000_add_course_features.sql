-- Add features array to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}';
