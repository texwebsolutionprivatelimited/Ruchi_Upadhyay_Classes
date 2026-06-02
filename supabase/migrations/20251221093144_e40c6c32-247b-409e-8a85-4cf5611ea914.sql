-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable for leaderboard" ON public.profiles;

-- Create a more secure policy that only allows viewing specific fields via a view
CREATE VIEW public.leaderboard_view AS
SELECT 
  id,
  user_id,
  username,
  xp,
  level,
  streak
FROM public.profiles
ORDER BY xp DESC;

-- Grant access to the view
GRANT SELECT ON public.leaderboard_view TO anon, authenticated;