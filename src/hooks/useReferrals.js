import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
const REFERRAL_POINTS = 100; // Points earned per successful referral
export const useReferrals = () => {
    const { user, profile, refetchProfile } = useAuth();
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [referralCode, setReferralCode] = useState(null);
    const [rewardPoints, setRewardPoints] = useState(0);
    const fetchReferrals = async () => {
        if (!user) {
            setReferrals([]);
            setLoading(false);
            return;
        }
        // Fetch user's referral code and reward points from profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('referral_code, reward_points')
            .eq('user_id', user.id)
            .maybeSingle();
        if (profileData) {
            setReferralCode(profileData.referral_code);
            setRewardPoints(profileData.reward_points);
        }
        // Fetch referrals made by user
        const { data, error } = await supabase
            .from('referrals')
            .select('*')
            .eq('referrer_id', user.id)
            .order('created_at', { ascending: false });
        if (!error && data) {
            setReferrals(data);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchReferrals();
    }, [user]);
    // Update reward points when profile changes
    useEffect(() => {
        if (profile) {
            setReferralCode(profile.referral_code || null);
            setRewardPoints(profile.reward_points || 0);
        }
    }, [profile]);
    const applyReferralCode = async (code, userId) => {
        const effectiveUserId = userId || user?.id;
        if (!effectiveUserId) {
            toast.error('Please login first');
            return false;
        }
        try {
            console.log('💎 Applying referral code via RPC:', { code, userId: effectiveUserId });
            const { data, error } = await supabase.rpc('handle_referral', {
                input_code: code,
                new_user_id: effectiveUserId
            });
            if (error) {
                console.error('❌ RPC Error:', error);
                toast.error('Failed to apply referral code');
                return false;
            }
            const result = data;
            if (result.success) {
                toast.success(result.message);
                // Refetch profile data to update UI
                await fetchReferrals();
                if (refetchProfile)
                    await refetchProfile();
                return true;
            }
            else {
                // If it's already used, we don't necessarily want to show an error if it was an auto-apply
                if (result.message !== 'You have already used a referral code') {
                    toast.error(result.message);
                }
                return false;
            }
        }
        catch (error) {
            console.error('❌ Referral Error:', error);
            toast.error('Something went wrong');
            return false;
        }
    };
    const copyReferralLink = () => {
        if (referralCode) {
            const link = `${window.location.origin}/login?ref=${referralCode}`;
            navigator.clipboard.writeText(link);
            toast.success('Referral link copied to clipboard!');
        }
    };
    const getTotalReferralPoints = () => {
        return referrals
            .filter(r => r.status === 'completed')
            .reduce((sum, r) => sum + r.points_earned, 0);
    };
    return {
        referrals,
        loading,
        referralCode,
        rewardPoints,
        applyReferralCode,
        copyReferralLink,
        getTotalReferralPoints,
        refetch: fetchReferrals,
    };
};
