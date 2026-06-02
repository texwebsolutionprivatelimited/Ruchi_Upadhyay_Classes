
-- Add price column to notes table
ALTER TABLE public.notes 
ADD COLUMN price INTEGER NOT NULL DEFAULT 0;

-- Add note_id and test_id to purchases table to track individual purchases
ALTER TABLE public.purchases
ADD COLUMN note_id uuid REFERENCES public.notes(id) ON DELETE SET NULL,
ADD COLUMN test_id uuid REFERENCES public.tests(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_purchases_user_note ON public.purchases(user_id, note_id) WHERE note_id IS NOT NULL;
CREATE INDEX idx_purchases_user_test ON public.purchases(user_id, test_id) WHERE test_id IS NOT NULL;

-- Update RLS for storage (ensure only authorized users can view PDFs)
-- This might require more complex logic if we want to secure the actual files.
-- For now, the application logic will handle access to the link.
