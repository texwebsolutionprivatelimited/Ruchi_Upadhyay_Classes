import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Zap, Flame, Calendar, Users } from 'lucide-react';
import ChemistryLoader from '@/components/ui/ChemistryLoader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { Button } from '@/components/ui/button';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useAuth } from '@/contexts/AuthContext';

const Leaderboard = () => {
  const { leaderboard, userRank, loading, timeRange, setTimeRange } = useLeaderboard();
  const { profile } = useAuth();
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning mb-6">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Top Learners</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Leader<span className="text-primary">board</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Compete with fellow learners and climb to the top!
              </p>

              {/* Your Rank */}
              {profile && userRank && (
                <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-full bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm sm:text-base">Your Rank:</span>
                    <span className="text-xl sm:text-2xl font-bold text-foreground">#{userRank}</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-border" />
                  <div className="flex items-center gap-1 text-primary">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold text-sm sm:text-base">
                      {(timeRange === 'week' ? (profile.weekly_xp || 0) : timeRange === 'month' ? (profile.monthly_xp || 0) : profile.xp).toLocaleString()} XP
                    </span>
                  </div>
                </div>
              )}

              {/* Live indicator */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </span>
                <span className="text-sm text-muted-foreground">Live updates</span>
              </div>
            </motion.div>
          </div>
        </section>

        {loading ? (
          <section className="py-16">
            <ChemistryLoader size="lg" />
          </section>
        ) : leaderboard.length === 0 ? (
          <section className="py-24">
            <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4">
              <Users className="w-16 h-16 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground">No learners yet</h3>
              <p className="text-muted-foreground">Be the first to join and start earning XP!</p>
            </div>
          </section>
        ) : (
          <>
            {/* Top 3 Podium */}
            <section className="py-8 md:py-12">
              <div className="container mx-auto px-2 sm:px-4">
                <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8 max-w-4xl mx-auto">
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center flex-1 min-w-0">
                      <div className="relative mb-3 md:mb-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-muted-foreground to-muted-foreground/50 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold text-background shadow-lg">
                          {topThree[1].username?.charAt(0) || '?'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted-foreground flex items-center justify-center shadow-lg border-2 border-background">
                          <Medal className="w-3 h-3 sm:w-5 sm:h-5 text-background" />
                        </div>
                      </div>
                      <div className="w-full bg-card rounded-t-xl sm:rounded-t-2xl p-2 sm:p-4 md:p-6 text-center h-28 sm:h-32 border border-border">
                        <p className="font-semibold text-xs sm:text-sm md:text-base text-card-foreground truncate px-1">{topThree[1].username || 'Anonymous'}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Level {topThree[1].level}</p>
                        <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2 text-primary">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-bold text-xs sm:text-sm md:text-base">{topThree[1].xp.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {topThree[0] && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center flex-1 min-w-0 z-10">
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="relative mb-3 md:mb-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-warning to-accent flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-background shadow-xl shadow-warning/20">
                          {topThree[0].username?.charAt(0) || '?'}
                        </div>
                        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                          <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-warning fill-warning drop-shadow-md" />
                        </div>
                      </motion.div>
                      <div className="w-full bg-gradient-to-b from-warning/10 to-card rounded-t-xl sm:rounded-t-2xl p-2 sm:p-4 md:p-6 text-center h-36 sm:h-40 border border-warning/30">
                        <p className="font-bold text-xs sm:text-base md:text-lg text-card-foreground truncate px-1">{topThree[0].username || 'Anonymous'}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Level {topThree[0].level}</p>
                        <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2 text-warning">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="font-bold text-sm sm:text-base md:text-lg">{topThree[0].xp.toLocaleString()}</span>
                        </div>
                        <div className="hidden sm:flex items-center justify-center gap-1 mt-1 text-accent">
                          <Flame className="w-4 h-4" />
                          <span className="text-xs">{topThree[0].streak} day streak</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center flex-1 min-w-0">
                      <div className="relative mb-3 md:mb-4">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-lg sm:text-2xl md:text-3xl font-bold text-background shadow-lg">
                          {topThree[2].username?.charAt(0) || '?'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center shadow-lg border-2 border-background">
                          <Medal className="w-3 h-3 sm:w-5 sm:h-5 text-background" />
                        </div>
                      </div>
                      <div className="w-full bg-card rounded-t-xl sm:rounded-t-2xl p-2 sm:p-4 md:p-6 text-center h-24 sm:h-28 border border-border">
                        <p className="font-semibold text-xs sm:text-sm md:text-base text-card-foreground truncate px-1">{topThree[2].username || 'Anonymous'}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Level {topThree[2].level}</p>
                        <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2 text-primary">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-bold text-xs sm:text-sm md:text-base">{topThree[2].xp.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* Filter Tabs */}
            <section className="py-8 border-b border-border">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
                  <Button variant={timeRange === 'all' ? "default" : "outline"} size="sm" onClick={() => setTimeRange('all')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    All Time
                  </Button>
                  <Button variant={timeRange === 'week' ? "default" : "outline"} size="sm" onClick={() => setTimeRange('week')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    This Week
                  </Button>
                  <Button variant={timeRange === 'month' ? "default" : "outline"} size="sm" onClick={() => setTimeRange('month')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    This Month
                  </Button>
                </div>
              </div>
            </section>

            {/* Full Leaderboard */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <LeaderboardTable entries={leaderboard.slice(3)} />
                </motion.div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
