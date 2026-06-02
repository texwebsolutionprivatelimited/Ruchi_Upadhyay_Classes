-- Add reward_points column to tests table
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS reward_points INTEGER NOT NULL DEFAULT 100;

-- Update existing tests to set reward_points equal to total_marks
UPDATE public.tests SET reward_points = total_marks WHERE reward_points = 100;
