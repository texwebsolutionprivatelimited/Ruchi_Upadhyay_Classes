import { motion } from 'framer-motion';
import { Copy, Gift, Users, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReferrals } from '@/hooks/useReferrals';
import { useState } from 'react';
const ReferralCard = () => {
    const { referralCode, rewardPoints, referrals, copyReferralLink, applyReferralCode } = useReferrals();
    const [inputCode, setInputCode] = useState('');
    const [applying, setApplying] = useState(false);
    const completedReferrals = referrals.filter(r => r.status === 'completed').length;
    const handleApplyCode = async () => {
        if (!inputCode.trim())
            return;
        setApplying(true);
        await applyReferralCode(inputCode.trim());
        setInputCode('');
        setApplying(false);
    };
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 border border-border shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl gradient-primary">
          <Gift className="w-5 h-5 text-primary-foreground"/>
        </div>
        <h3 className="font-heading font-semibold text-card-foreground">Referral Program</h3>
      </div>

      {/* Reward Points Display */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Your Reward Points</p>
            <p className="text-2xl font-bold text-primary">{rewardPoints}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Successful Referrals</p>
            <div className="flex items-center justify-end gap-1">
              <Users className="w-4 h-4 text-primary"/>
              <p className="text-xl font-bold text-foreground">{completedReferrals}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Use your points for discounts on course purchases!
        </p>
      </div>

      {/* Your Referral Code */}
      {referralCode && (<div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
          <div className="flex gap-2">
            <Input value={referralCode} readOnly className="font-mono font-bold text-center"/>
            <Button variant="outline" size="icon" onClick={copyReferralLink}>
              <Copy className="w-4 h-4"/>
            </Button>
          </div>
        </div>)}

      {/* Share Button */}
      <Button className="w-full mb-4" onClick={copyReferralLink}>
        <Share2 className="w-4 h-4 mr-2"/>
        Share & Earn 100 Points
      </Button>

      {/* Apply Referral Code */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Have a referral code?</p>
        <div className="flex gap-2">
          <Input value={inputCode} onChange={(e) => setInputCode(e.target.value.toUpperCase())} placeholder="Enter code" className="uppercase"/>
          <Button variant="secondary" onClick={handleApplyCode} disabled={applying}>
            Apply
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Get 50 bonus points when you use a friend's code!
        </p>
      </div>
    </motion.div>);
};
export default ReferralCard;
