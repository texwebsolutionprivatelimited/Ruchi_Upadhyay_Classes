
-- Add price column to tests table
ALTER TABLE public.tests 
ADD COLUMN price INTEGER NOT NULL DEFAULT 0;

-- Create index for faster lookups if not already there (it was added in notes_monetization but good to be sure or just stick to adding the column)
-- Actually, the column is enough for now as the index in previous migration already refers to test_id.
