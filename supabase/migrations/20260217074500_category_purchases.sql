-- Create category_purchases table for bulk category purchases
-- This allows users to buy all notes/tests in a category at once

CREATE TABLE public.category_purchases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('notes', 'tests', 'both')),
    amount INTEGER NOT NULL DEFAULT 0,
    order_id TEXT NOT NULL,
    payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, category, content_type)
);

-- Enable RLS
ALTER TABLE public.category_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own category purchases"
ON public.category_purchases
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own category purchases"
ON public.category_purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_category_purchases_user ON public.category_purchases(user_id, category, content_type);

-- Ensure price columns exist (these migrations should have been applied already)
-- Adding IF NOT EXISTS for safety
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0;
