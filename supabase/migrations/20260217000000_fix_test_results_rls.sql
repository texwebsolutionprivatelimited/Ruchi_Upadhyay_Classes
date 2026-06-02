-- Refine RLS for test_results table
-- This migration ensures that authenticated users can manage their own test results without policy violations.

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own test results" ON public.test_results;
DROP POLICY IF EXISTS "Users can insert their own test results" ON public.test_results;

-- Create a robust "FOR ALL" policy for authenticated users
-- This allows SELECT, INSERT, UPDATE, and DELETE for rows where user_id matches the authenticated user's ID.
CREATE POLICY "test_results_owner_access" ON public.test_results
    FOR ALL 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
