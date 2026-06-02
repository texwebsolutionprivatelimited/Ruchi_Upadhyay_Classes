
-- Make course_id nullable in purchases table to support individual test/note purchases
ALTER TABLE public.purchases ALTER COLUMN course_id DROP NOT NULL;
