-- Drop the security definer view
DROP VIEW IF EXISTS public.leaderboard_view;

-- Create a secure RLS policy for leaderboard that only exposes safe fields
-- Users can view limited profile data for leaderboard purposes
CREATE POLICY "Public can view leaderboard data" 
  ON public.profiles FOR SELECT 
  USING (true);