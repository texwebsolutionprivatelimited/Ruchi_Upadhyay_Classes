-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL, -- Emoji or Lucide icon name
    color TEXT,
    category TEXT DEFAULT 'general',
    xp_requirement INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_badges junction table
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    badge_id UUID REFERENCES public.badges(id) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for badges (everyone can see)
CREATE POLICY "Everyone can see badges" ON public.badges FOR SELECT USING (true);

-- Policies for user_badges
CREATE POLICY "Users can see their own earned badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);

-- Seed basic badges
INSERT INTO public.badges (name, description, icon, color, category, xp_requirement) VALUES
('First Reaction', 'Complete your first lesson', '🧪', 'bg-blue-500', 'milestone', 0),
('Quick Learner', 'Complete 5 lessons in one day', '⚡', 'bg-yellow-500', 'streak', 0),
('Streak Master', 'Maintain a 7-day streak', '🔥', 'bg-orange-500', 'streak', 0),
('Quiz Champion', 'Score 100% on 3 quizzes', '🏆', 'bg-purple-500', 'academic', 0),
('Test Titan', 'Complete 5 tests with >80% score', '🛡️', 'bg-slate-700', 'academic', 0),
('XP Legend', 'Accumulate 5000+ total XP', '👑', 'bg-indigo-600', 'progression', 5000),
('Referral King', 'Successfully refer 5 friends', '🤝', 'bg-emerald-600', 'social', 0),
('Top 10 Club', 'Reach the Top 10 Leaderboard', '🌟', 'bg-amber-500', 'rank', 0)
ON CONFLICT DO NOTHING;
