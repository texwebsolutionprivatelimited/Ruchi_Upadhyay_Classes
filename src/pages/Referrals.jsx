import { motion } from 'framer-motion';
import { Target, Copy, Gift, Users, Zap, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useReferrals } from '@/hooks/useReferrals';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
const POINTS_PER_RUPEE = 100;
const Referrals = () => {
    const { referralCode, copyReferralLink, referrals, loading: referralsLoading, getTotalReferralPoints } = useReferrals();
    const { user, profile, loading: authLoading } = useAuth();
    if (authLoading || referralsLoading) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>);
    }
    if (!user)
        return null;
    return (<div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20 pb-16">
            {/* Hero Section */}
            <section className="py-8 md:py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 mb-6 md:mb-8">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                            <Target className="w-5 h-5" />
                            <span className="font-medium">Earn Passive XP</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-3 md:mb-4">
                            Refer & <span className="text-primary">Earn</span>
                        </h1>
                        <p className="text-sm md:text-lg text-muted-foreground px-4">
                            Invite your friends to join the platform. You'll get 100 XP (₹1) for every friend who joins, and they get 50 XP bonus!
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-8 md:py-12">
                <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Main Referral Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="border-primary/20 bg-card shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient"></div>
                            <CardHeader className="text-center pb-2">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                                    <Gift className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Your Referral Link</CardTitle>
                                <CardDescription>Share this unique link with your friends to start earning</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                                    <div className="relative flex-1 group">
                                        <Input value={`${window.location.origin}/login?ref=${referralCode || ''}`} readOnly className="font-mono text-sm bg-secondary/30 border-primary/10 h-12 pr-10 focus-visible:ring-primary/20" />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
                                            <Target className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <Button onClick={copyReferralLink} size="lg" className="h-12 px-8 gradient-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Link
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-4">
                                    {[
                                        { label: 'Total XP Earned', value: `${getTotalReferralPoints()} XP`, sub: `≈ ₹${(getTotalReferralPoints() / POINTS_PER_RUPEE).toFixed(2)}`, color: 'text-primary' },
                                        { label: 'Friends Joined', value: referrals.length, sub: 'Verified users', color: 'text-foreground' },
                                        { label: 'Success Rate', value: '100%', sub: 'Active referrals', color: 'text-green-500' },
                                    ].map((stat, i) => (<div key={i} className="bg-secondary/20 p-4 md:p-5 rounded-2xl text-center border border-border/50 hover:bg-secondary/30 transition-colors">
                                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                        <p className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
                                    </div>))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* How it Works */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold font-heading flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            How it Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Share Link', desc: 'Send your unique referral link to friends.', icon: Gift, color: 'bg-blue-500/10 text-blue-500' },
                                { title: 'Friend Joins', desc: 'Friend signs up using your link.', icon: Users, color: 'bg-purple-500/10 text-purple-500' },
                                { title: 'Both Earn', desc: 'You get 100 XP, they get 50 XP bonus!', icon: Target, color: 'bg-green-500/10 text-green-500' },
                            ].map((item, i) => (<motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.1) }}>
                                <Card className="bg-card border-border/50 hover:border-primary/30 transition-all h-full group">
                                    <CardContent className="p-6 text-center space-y-3">
                                        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-2 transform group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>))}
                        </div>
                    </div>

                    {/* History */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold font-heading flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            Referral History
                            {referrals.length > 0 && <Badge variant="secondary" className="ml-2">{referrals.length}</Badge>}
                        </h2>

                        {referrals.length === 0 ? (<Card className="border-dashed border-2 bg-secondary/10">
                            <CardContent className="py-16 text-center">
                                <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground font-medium">No referrals yet. Share your code to get started!</p>
                            </CardContent>
                        </Card>) : (<div className="grid gap-4">
                            {referrals.map((referral, index) => (<motion.div key={referral.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                                <Card className="bg-card hover:shadow-md transition-shadow border-primary/5 border-l-4 border-l-primary/30">
                                    <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-primary font-bold shrink-0">
                                                {referral.id.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-sm md:text-base">User Joined</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(referral.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right shrink-0">
                                            <div className="flex sm:justify-end items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none text-[10px]">
                                                    Completed
                                                </Badge>
                                            </div>
                                            <span className="font-black text-primary text-base md:text-lg">+{referral.points_earned} XP</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>))}
                        </div>)}
                    </div>
                    </div>
                </div>
            </section>
        </main>
        <Footer />
    </div>);
};
export default Referrals;
