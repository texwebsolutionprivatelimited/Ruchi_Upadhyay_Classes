import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
export const useLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('all');
    const { user } = useAuth();
    const fetchLeaderboard = async () => {
        setLoading(true);
        const xpColumn = timeRange === 'week' ? 'weekly_xp' : timeRange === 'month' ? 'monthly_xp' : 'xp';
        // Only select non-sensitive fields for leaderboard
        const { data, error } = await supabase
            .from('profiles')
            .select(`id, user_id, username, ${xpColumn}, level, streak`)
            .order(xpColumn, { ascending: false })
            .limit(5); // Limit to 5 as requested
        if (error) {
            console.error('Error fetching leaderboard:', error);
            setLoading(false);
            return;
        }
        const rankedData = (data || []).map((profile, index) => ({
            ...profile,
            xp: profile[xpColumn], // Map back to 'xp' for UI consistency
            rank: index + 1,
        }));
        setLeaderboard(rankedData);
        // Set leaderboard data
        setLeaderboard(rankedData);
        // Find current user's absolute rank across all users
        if (user) {
            // 1. Get current user's XP for the selected range
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select(xpColumn)
                .eq('user_id', user.id)
                .maybeSingle();
            if (!userError && userData) {
                const userXP = userData[xpColumn] || 0;
                // 2. Count users with more XP to get rank
                const { count, error: countError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .gt(xpColumn, userXP);
                if (!countError) {
                    setUserRank((count || 0) + 1);
                }
            }
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchLeaderboard();
        // Subscribe to realtime updates
        const channel = supabase
            .channel('leaderboard-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'profiles',
            }, () => {
                // Refetch leaderboard on any profile change
                fetchLeaderboard();
            })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);
    return { leaderboard, userRank, loading, timeRange, setTimeRange, refetch: fetchLeaderboard };
};
