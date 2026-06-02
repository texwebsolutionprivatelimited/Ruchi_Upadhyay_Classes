import { motion } from 'framer-motion';
import { Coins, Percent, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useReferrals } from '@/hooks/useReferrals';
import { useNavigate } from 'react-router-dom';
const POINTS_PER_RUPEE = 10; // 10 points = ₹1 discount
const PointsDiscountCard = () => {
    const { rewardPoints } = useReferrals();
    const navigate = useNavigate();
    const discountValue = Math.floor(rewardPoints / POINTS_PER_RUPEE);
    const nextMilestone = Math.ceil((rewardPoints + 1) / 100) * 100;
    const progressToNextMilestone = (rewardPoints % 100);
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl p-6 border border-border shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl gradient-accent">
          <Coins className="w-5 h-5 text-accent-foreground"/>
        </div>
        <h3 className="font-heading font-semibold text-card-foreground">Rewards & Discounts</h3>
      </div>

      {/* Current Discount */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Available Discount</span>
          <div className="flex items-center gap-1 text-green-600">
            <Percent className="w-4 h-4"/>
          </div>
        </div>
        <p className="text-3xl font-bold text-green-600">₹{discountValue}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Based on {rewardPoints} points ({POINTS_PER_RUPEE} points = ₹1)
        </p>
      </div>

      {/* Progress to Next Milestone */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress to {nextMilestone} points</span>
          <span className="font-medium text-foreground">{progressToNextMilestone}/100</span>
        </div>
        <Progress value={progressToNextMilestone} className="h-2"/>
      </div>

      {/* Ways to Earn */}
      <div className="space-y-2 mb-4">
        <p className="text-sm font-medium text-foreground">Ways to earn points:</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Refer a friend: <span className="text-primary font-medium">+100 points</span></p>
          <p>• Complete a course: <span className="text-primary font-medium">+50 points</span></p>
          <p>• Pass a quiz: <span className="text-primary font-medium">+10 points</span></p>
          <p>• Daily login streak: <span className="text-primary font-medium">+5 points</span></p>
        </div>
      </div>

      {discountValue > 0 && (<Button className="w-full" onClick={() => navigate('/courses')}>
          Use Discount on Courses
          <ArrowRight className="w-4 h-4 ml-2"/>
        </Button>)}
    </motion.div>);
};
export default PointsDiscountCard;
