import { motion } from 'framer-motion';
import { Medal, Zap, Flame, Crown } from 'lucide-react';
const LeaderboardTable = ({ entries }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-warning fill-warning" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Medal className="w-6 h-6 text-accent" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };
  return (<div className="space-y-2 sm:space-y-3">
    {entries.map((entry, index) => (<motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-md ${entry.rank <= 3
      ? 'bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20'
      : 'bg-card border border-border'}`}>
      {/* Rank */}
      <div className="w-8 sm:w-12 flex items-center justify-center">
        {getRankIcon(entry.rank)}
      </div>

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
          {entry.username?.charAt(0) || '?'}
        </div>
        {entry.rank === 1 && (<div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-warning flex items-center justify-center">
          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-warning-foreground" />
        </div>)}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm sm:text-base text-card-foreground truncate">{entry.username || 'Anonymous'}</h4>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-sm text-muted-foreground">
          <span>Level {entry.level}</span>
          <span className="hidden xs:inline">•</span>
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-accent" />
            <span>{entry.streak} day streak</span>
          </div>
        </div>
      </div>

      {/* XP */}
      <div className="flex items-center shrink-0 ml-auto">
        <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-primary/10">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <span className="font-bold text-xs sm:text-base text-primary mr-1">{entry.xp.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>))}
  </div>);
};
export default LeaderboardTable;
