import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit, Zap, Award, Flame, Save, Coins, CheckCircle, GraduationCap, Target, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TransactionHistoryDialog from '@/components/profile/TransactionHistoryDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReferrals } from '@/hooks/useReferrals';

const POINTS_PER_RUPEE = 100;

const Profile = () => {
    const { user, profile, loading, createProfile, updateProfile } = useAuth();
    const { referralCode, applyReferralCode, referrals } = useReferrals();
    const [isEditing, setIsEditing] = useState(false);
    const [allBadges, setAllBadges] = useState([]);
    const [unlockedBadgeIds, setUnlockedBadgeIds] = useState([]);
    const [badgesLoading, setBadgesLoading] = useState(true);
    const [rank, setRank] = useState(null);
    const [editForm, setEditForm] = useState({
        username: '',
        avatar_url: '',
    });
    const [isWalletOpen, setIsWalletOpen] = useState(false);

    useEffect(() => {
        if (!loading && !profile) {
            setBadgesLoading(false);
            return;
        }

        if (profile) {
            setEditForm({
                username: profile.username || '',
                avatar_url: profile.avatar_url || '',
            });
            fetchBadges();
            fetchRank();
            const pendingRef = localStorage.getItem('pending_referral');
            if (pendingRef) {
                localStorage.removeItem('pending_referral');
                if (!profile.referred_by && referrals.length === 0) {
                    applyReferralCode(pendingRef);
                }
            }
        }
    }, [profile, loading]);

    const fetchRank = async () => {
        if (!profile)
            return;
        try {
            const { count: rankCount, error: rankError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gt('xp', profile.xp);
            if (rankError)
                throw rankError;
            const currentRank = (rankCount || 0) + 1;
            setRank(currentRank);
        }
        catch (error) {
            console.error('Error fetching rank:', error);
        }
    };

    const checkAndAwardBadge = async (badgeName) => {
        if (!user || !allBadges.length)
            return;
        const badge = allBadges.find(b => b.name === badgeName);
        if (!badge)
            return;
        if (!unlockedBadgeIds.includes(badge.id)) {
            const { error } = await supabase
                .from('user_badges')
                .insert({
                    user_id: user.id,
                    badge_id: badge.id
                });
            if (!error) {
                setUnlockedBadgeIds(prev => [...prev, badge.id]);
                toast.success(`Badge Unlocked: ${badgeName}! 🏆`, {
                    description: badge.description,
                    icon: <span>{badge.icon}</span>,
                });
            }
        }
    };

    const fetchBadges = async () => {
        try {
            const { data: badgesData, error: badgesError } = await supabase
                .from('badges')
                .select('*')
                .order('xp_requirement', { ascending: true });
            if (badgesError)
                throw badgesError;
            setAllBadges(badgesData || []);
            if (user) {
                const { data: userBadgesData, error: userBadgesError } = await supabase
                    .from('user_badges')
                    .select('badge_id')
                    .eq('user_id', user.id);
                if (userBadgesError)
                    throw userBadgesError;
                setUnlockedBadgeIds(userBadgesData?.map(ub => ub.badge_id) || []);
            }
        }
        catch (error) {
            console.error('Error fetching badges:', error);
        }
        finally {
            setBadgesLoading(false);
            if (user)
                checkAdvancedBadges();
        }
    };

    const checkAdvancedBadges = async () => {
        if (!user)
            return;
        const { count: refCount } = await supabase
            .from('referrals')
            .select('*', { count: 'exact', head: true })
            .eq('referrer_id', user.id)
            .eq('status', 'completed');
        if (refCount && refCount >= 5) {
            checkAndAwardBadge('Referral King');
        }
        const { data: testData } = await supabase
            .from('test_results')
            .select('score')
            .eq('user_id', user.id);
        if (testData) {
            const perfectQuizzes = testData.filter(t => t.score === 100).length;
            const highScores = testData.filter(t => t.score >= 80).length;
            if (perfectQuizzes >= 3)
                checkAndAwardBadge('Quiz Champion');
            if (highScores >= 5)
                checkAndAwardBadge('Test Titan');
        }
        const { count: lessonCount } = await supabase
            .from('user_courses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gt('progress', 0);
        if (lessonCount && lessonCount > 0) {
            checkAndAwardBadge('First Reaction');
        }
    };

    useEffect(() => {
        if (profile && allBadges.length > 0 && rank !== null) {
            if (rank <= 10) {
                checkAndAwardBadge('Top 10 Club');
            }
            if (profile.xp >= 5000) {
                checkAndAwardBadge('XP Legend');
            }
            if (profile.streak >= 7) {
                checkAndAwardBadge('Streak Master');
            }
        }
    }, [rank, profile?.xp, profile?.streak, allBadges]);

    if (loading || badgesLoading) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>);
    }

    if (!user) {
        return (<div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
            <Button variant="default" onClick={() => window.location.href = '/login'}>Go to Login</Button>
        </div>);
    }

    if (!profile) {
        return (<div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">Your profile data seems to be missing. Let's fix that!</p>
            <Button onClick={createProfile}>Initialize Profile</Button>
        </div>);
    }

    const handleUpdateProfile = async () => {
        if (!editForm.username.trim()) {
            toast.error("Username cannot be empty");
            return;
        }
        await updateProfile({
            username: editForm.username,
        });
        setIsEditing(false);
    };

    const xp = profile.xp || 0;
    const level = profile.level || 1;
    const streak = profile.streak || 0;
    const reward_points = profile.reward_points || 0;
    const currentLevelProgress = (xp % 1000) / 1000 * 100;

    return (<div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20 pb-16">
            {/* Hero Section */}
            <section className="py-8 md:py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 mb-6 md:mb-8">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 text-primary mb-4 md:mb-6">
                            <User className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-medium text-xs md:text-sm">Personal Dashboard</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-3 md:mb-4">
                            My <span className="text-primary">Profile</span>
                        </h1>
                        <p className="text-sm md:text-lg text-muted-foreground px-4">
                            Manage your account, track your progress, and view your achievements.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Header */}
                    <Card className="overflow-hidden border-border shadow-xl bg-card/50 backdrop-blur-sm relative">
                        <div className="h-20 md:h-24 bg-gradient-to-r from-primary/5 via-accent/5 to-background relative border-b border-border/10">
                            <Button variant="secondary" size="sm" className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-background/50 backdrop-blur-md hover:bg-background/80 border-border/50 h-8 md:h-10 text-[10px] md:text-sm" onClick={() => setIsEditing(true)}>
                                <Edit className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                        <CardContent className="px-6 md:px-8 pb-8">
                            <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-12 mb-6 gap-4">
                                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                                    <div className="relative group">
                                        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl ring-2 ring-primary/10">
                                            <AvatarImage src={profile.avatar_url || ''} />
                                            <AvatarFallback className="text-2xl md:text-3xl bg-primary/10 text-primary font-bold">
                                                {profile.username?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white" onClick={() => setIsEditing(true)}>
                                            <Edit className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                    </div>
                                    <div className="mb-0.5 md:mb-1 flex flex-col items-center md:items-start text-center md:text-left">
                                        <div className="flex items-center gap-1.5 md:gap-2 group cursor-pointer hover:text-primary transition-colors" onClick={() => setIsEditing(true)}>
                                            <h1 className="text-xl md:text-3xl font-bold font-heading truncate max-w-[200px] md:max-w-none">{profile.username}</h1>
                                            <Edit className="w-4 h-4 md:w-5 md:h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 md:gap-2 mt-1">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] md:text-xs">
                                                Level {level}
                                            </Badge>
                                            <span className="text-muted-foreground text-[10px] md:text-sm flex items-center gap-1">
                                                <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500" />
                                                {streak} day streak
                                            </span>
                                            <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-50 text-[8px] md:text-[10px]">
                                                <Coins className="w-3 h-3 mr-1" />
                                                10 XP = ₹0.1
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-0 md:mb-2 w-full md:w-auto">
                                    <div className="text-center md:text-right bg-primary/5 md:bg-transparent p-2 md:p-0 rounded-xl border border-primary/10 md:border-0 flex md:flex-col items-center md:items-end justify-center gap-2 md:gap-0">
                                        <p className="text-[8px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold md:mb-1">Global Rank</p>
                                        <p className="text-xl md:text-3xl font-black text-primary">#{rank || '...'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center gap-3 text-muted-foreground bg-secondary/30 p-2.5 md:p-3 rounded-lg border border-border/50">
                                        <Mail className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-xs md:text-sm font-medium truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground bg-secondary/30 p-2.5 md:p-3 rounded-lg border border-border/50">
                                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-xs md:text-sm font-medium">Player since {new Date(user.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 md:p-5 rounded-2xl border border-primary/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform hidden sm:block">
                                        <Zap className="w-12 h-12 text-primary" />
                                    </div>
                                    <div className="flex items-center justify-between mb-2 md:mb-3">
                                        <span className="font-bold text-xs md:text-sm tracking-tight">Progress to Level {level + 1}</span>
                                        <span className="font-bold text-primary text-xs md:text-sm">{xp} XP</span>
                                    </div>
                                    <Progress value={currentLevelProgress} className="h-2 md:h-2.5 mb-2" />
                                    <div className="text-[10px] md:text-xs text-muted-foreground flex items-center justify-between">
                                        <span>Level Up Goal</span>
                                        <span className="font-semibold text-foreground">{1000 - (xp % 1000)} XP Remaining</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {[
                            { label: 'Total XP', value: xp, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', subValue: 'Score' },
                            { label: 'Elite Wallet', value: `₹${(reward_points / POINTS_PER_RUPEE).toFixed(2)}`, icon: Coins, color: 'text-green-500', bg: 'bg-green-500/10', subValue: `${reward_points} Pts` },
                            { label: 'Streak', value: `${streak} Days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                            { label: 'Badges', value: `${unlockedBadgeIds.length}/${allBadges.length}`, icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        ].map((stat, i) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Card className={`hover:shadow-md transition-all cursor-pointer border-border/40 hover:border-primary/50 group active:scale-95 ${stat.label === 'Elite Wallet' ? 'ring-1 ring-primary/20 bg-primary/5' : ''}`} onClick={() => stat.label === 'Elite Wallet' && setIsWalletOpen(true)}>
                                    <CardContent className="p-3 md:p-5 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 text-center md:text-left">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${stat.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-muted-foreground text-[7px] md:text-[10px] font-bold uppercase tracking-wider truncate">{stat.label}</p>
                                            <p className="text-xs md:text-xl font-bold truncate leading-tight">{stat.value}</p>
                                            {'subValue' in stat && <p className="hidden md:block text-[10px] text-muted-foreground truncate">{stat.subValue}</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Achievements Section */}
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start gap-2">
                            <h2 className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2 text-foreground">
                                <Award className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
                                Achievements & Badges
                            </h2>
                            <Badge variant="outline" className="text-[10px] md:text-xs">
                                Total {allBadges.length} Badges
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                            {allBadges.map((badge, index) => {
                                const isUnlocked = unlockedBadgeIds.includes(badge.id);
                                return (<motion.div key={badge.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + index * 0.05 }} className={`relative group p-3 md:p-4 rounded-xl md:rounded-2xl border flex flex-col items-center text-center gap-2 md:gap-3 transition-all duration-300 ${isUnlocked
                                    ? 'bg-card border-border hover:border-primary/50 hover:shadow-lg'
                                    : 'bg-secondary/20 border-transparent grayscale opacity-50'}`}>
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl ${badge.color || 'bg-primary'} flex items-center justify-center text-xl md:text-3xl shadow-lg transform group-hover:scale-110 transition-transform`}>
                                        {badge.icon}
                                    </div>
                                    <div className="space-y-0.5 md:space-y-1">
                                        <h3 className="font-bold text-[10px] md:text-sm leading-tight line-clamp-1">{badge.name}</h3>
                                        <p className="text-[8px] md:text-[10px] text-muted-foreground leading-tight px-1 line-clamp-2">{badge.description}</p>
                                    </div>
                                </motion.div>);
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>

        {/* Edit Profile Modal */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-[425px] overflow-hidden p-0">
                <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
                <DialogHeader className="p-4 md:p-6 pb-0">
                    <DialogTitle className="text-xl md:text-2xl font-bold font-heading">Edit Your Profile</DialogTitle>
                    <DialogDescription>
                        Customize how other players see you on the leaderboard.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Name</Label>
                            <Input id="username" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} className="h-12 border-border/50 focus:border-primary text-lg font-medium" placeholder="Enter your hero name" autoFocus />
                            <p className="text-xs text-muted-foreground">This is how you will appear on the leaderboard and to other players.</p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-6 pt-2 bg-secondary/30 border-t border-border/50">
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleUpdateProfile} className="px-8 bg-primary text-white font-bold">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <TransactionHistoryDialog open={isWalletOpen} onOpenChange={setIsWalletOpen} />
        <Footer />
    </div>);
};

export default Profile;
