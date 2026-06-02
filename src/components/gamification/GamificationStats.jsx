import { motion } from 'framer-motion';
import { Zap, Flame, Trophy, BookOpen, Star, Award, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
const GamificationStats = ({ user }) => {
    const xpToNextLevel = 500;
    const currentLevelXP = user.xp % xpToNextLevel;
    const progress = (currentLevelXP / xpToNextLevel) * 100;
    return (<div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl gradient-primary">
              <Zap className="w-5 h-5 text-primary-foreground"/>
            </div>
            <span className="text-sm text-muted-foreground">Total XP</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{user.xp.toLocaleString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl gradient-accent">
              <Flame className="w-5 h-5 text-accent-foreground"/>
            </div>
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{user.streak} days</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl gradient-gamification">
              <Trophy className="w-5 h-5 text-success-foreground"/>
            </div>
            <span className="text-sm text-muted-foreground">Rank</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">#{user.rank}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-warning">
              <Star className="w-5 h-5 text-warning-foreground"/>
            </div>
            <span className="text-sm text-muted-foreground">Level</span>
          </div>
          <p className="text-3xl font-bold text-card-foreground">{user.level}</p>
        </motion.div>
      </div>

      {/* Level Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-semibold text-card-foreground">Level Progress</h3>
            <p className="text-sm text-muted-foreground">
              {xpToNextLevel - currentLevelXP} XP to Level {user.level + 1}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
            <TrendingUp className="w-4 h-4 text-primary"/>
            <span className="font-semibold text-primary">Level {user.level}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-3"/>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentLevelXP} XP</span>
            <span>{xpToNextLevel} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-semibold text-card-foreground">Earned Badges</h3>
          <span className="text-sm text-muted-foreground">{user.badges.length} badges</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {user.badges.map((badge, index) => (<motion.div key={badge.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + index * 0.1 }} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center text-2xl shadow-lg`}>
                {badge.icon}
              </div>
              <span className="text-sm font-medium text-card-foreground text-center">{badge.name}</span>
            </motion.div>))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-primary"/>
            <span className="text-sm text-muted-foreground">Courses Enrolled</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground">{user.coursesEnrolled.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-success"/>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground">{user.coursesCompleted.length}</p>
        </motion.div>
      </div>
    </div>);
};
export default GamificationStats;
