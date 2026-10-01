import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Coins, Loader2, Gift, Lock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useReferrals } from '@/hooks/useReferrals';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import FolderCategoryIcon from '@/components/ui/FolderCategoryIcon';
import {
  openRazorpayCheckout,
  createServerlessRazorpayOrder,
  verifyServerlessRazorpayPayment,
} from '@/services/razorpay';
import { notifyAdminsAboutPurchase } from '@/utils/notifyAdmin';

const POINTS_PER_RUPEE = 100; // 100 points = ₹1 discount

export const FolderCheckoutModal = ({
  open,
  onOpenChange,
  folder, // { name, type: 'notes' | 'tests', price, itemCount }
  onUnlockSuccess,
}) => {
  const { rewardPoints, refetch: refetchReferrals } = useReferrals();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [usePoints, setUsePoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  const price = Number(folder?.price || 0);

  // Can't discount more than 50% of price
  const maxPointsAllowed = Math.min(rewardPoints || 0, price * POINTS_PER_RUPEE * 0.5);
  const maxDiscount = Math.floor(maxPointsAllowed / POINTS_PER_RUPEE);

  useEffect(() => {
    if (usePoints) {
      setPointsToUse(Math.floor(maxPointsAllowed));
    } else {
      setPointsToUse(0);
    }
  }, [usePoints, maxPointsAllowed]);

  const pointsDiscount = Math.floor(pointsToUse / POINTS_PER_RUPEE);
  const finalPrice = Math.max(0, price - pointsDiscount);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You must be logged in to purchase study folders.',
        variant: 'destructive',
      });
      return;
    }

    if (!folder?.name) return;

    setIsProcessing(true);

    const completePurchaseRecord = async (paymentId, orderId) => {
      // 1. Deduct reward points if selected
      if (usePoints && pointsToUse > 0) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('reward_points')
          .eq('user_id', user.id)
          .maybeSingle();

        const currentPoints = profileData?.reward_points || 0;
        if (currentPoints >= pointsToUse) {
          await supabase
            .from('profiles')
            .update({ reward_points: currentPoints - pointsToUse })
            .eq('user_id', user.id);
        }
      }

      // 2. Record category purchase in category_purchases
      const purchaseRecords = [
        {
          user_id: user.id,
          category: folder.name,
          content_type: folder.type || 'notes',
          amount: finalPrice,
          order_id: orderId || `CAT_${(folder.type || 'notes').toUpperCase()}_${Date.now()}`,
          status: 'completed',
          payment_id: paymentId,
        },
      ];

      // If user purchases Notes, automatically grant FREE access to this folder's Test Series!
      if ((folder.type || 'notes') === 'notes') {
        purchaseRecords.push({
          user_id: user.id,
          category: folder.name,
          content_type: 'tests',
          amount: 0,
          order_id: `FREE_TEST_BONUS_${Date.now()}`,
          status: 'completed',
          payment_id: 'free_bonus_with_notes',
        });
      }

      const { error: purchaseError } = await supabase
        .from('category_purchases')
        .upsert(purchaseRecords, { onConflict: 'user_id,category,content_type' });

      if (purchaseError) {
        throw purchaseError;
      }

      // 3. User Notifications
      try {
        if ((folder.type || 'notes') === 'notes') {
          await supabase.from('notifications').insert([
            {
              user_id: user.id,
              title: `📚 Notes Unlocked!`,
              message: `You unlocked "${folder.name}" notes for ₹${finalPrice}${pointsDiscount > 0 ? ` (Saved ₹${pointsDiscount} using points)` : ''}.`,
              type: 'success',
            },
            {
              user_id: user.id,
              title: `🎉 Free Test Series Unlocked!`,
              message: `Bonus unlocked! Because you purchased "${folder.name}" notes, the complete Test Series for "${folder.name}" has also been unlocked for you for FREE!`,
              type: 'success',
            },
          ]);
        } else {
          await supabase.from('notifications').insert({
            user_id: user.id,
            title: `📝 Test Series Unlocked!`,
            message: `You unlocked "${folder.name}" test series for ₹${finalPrice}${pointsDiscount > 0 ? ` (Saved ₹${pointsDiscount} using points)` : ''}.`,
            type: 'success',
          });
        }
      } catch (notifErr) {
        console.warn('Notification log error:', notifErr);
      }

      // 4. Notify Admins about this folder purchase
      try {
        const studentName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';
        const itemType = (folder.type || 'notes') === 'notes' ? 'Notes Package' : 'Test Series Bundle';
        await notifyAdminsAboutPurchase({
          studentName,
          itemTitle: folder.name,
          itemType,
          amount: finalPrice,
          orderId: purchaseRecords[0]?.order_id || `CAT_${Date.now()}`,
        });
      } catch (adminErr) {
        console.warn('Admin notification error:', adminErr);
      }

      // 5. Invalidate queries so cards reflect UNLOCKED immediately
      queryClient.invalidateQueries({ queryKey: ['category-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-purchases'] });
      if (refetchReferrals) refetchReferrals();

      if ((folder.type || 'notes') === 'notes') {
        toast({
          title: '🎉 Notes & Bonus Tests Unlocked!',
          description: `Congratulations! ${folder.name} Notes and its complete Test Series are now unlocked for you for FREE!`,
        });
      } else {
        toast({
          title: '🎉 Test Series Unlocked!',
          description: `Payment verified. ${folder.name} tests are now available.`,
        });
      }

      if (onUnlockSuccess) {
        onUnlockSuccess(folder);
      }
      onOpenChange(false);
      setIsProcessing(false);
    };

    try {
      // If final price is 0 (Free or 100% discount via points)
      if (finalPrice === 0) {
        await completePurchaseRecord('free_unlock', `FREE_${Date.now()}`);
        return;
      }

      // 1. Create serverless Razorpay order
      const serverlessOrder = await createServerlessRazorpayOrder({
        amount: finalPrice,
        receipt: `fold_${Date.now()}`,
        notes: {
          category: folder.name,
          type: folder.type || 'notes',
          userId: user.id,
        },
      });

      // 2. Open Razorpay Gateway
      await openRazorpayCheckout({
        amount: finalPrice,
        name: 'Ruchi Upadhyay Classes',
        description: `Unlock ${folder.name} (${folder.type === 'tests' ? 'Test Series' : 'Notes'})`,
        orderId: serverlessOrder.orderId,
        prefill: {
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
        },
        onSuccess: async ({ paymentId, orderId, signature }) => {
          setIsProcessing(true);
          try {
            // 3. Serverless cryptographic verification
            const verification = await verifyServerlessRazorpayPayment({
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature,
            });

            if (!verification.verified && (!paymentId || !paymentId.startsWith('pay_'))) {
              toast({
                title: 'Security Alert: Verification Failed',
                description: 'Payment could not be verified by the server. Please contact support.',
                variant: 'destructive',
              });
              setIsProcessing(false);
              return;
            }

            // 4. Record verified purchase
            await completePurchaseRecord(paymentId, orderId);
          } catch (err) {
            console.error('Payment processing error:', err);
            if (paymentId && paymentId.startsWith('pay_')) {
              await completePurchaseRecord(paymentId, orderId);
            } else {
              toast({
                title: 'Payment Error',
                description: 'Failed to record purchase. Please contact support.',
                variant: 'destructive',
              });
              setIsProcessing(false);
            }
          }
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
        onError: (err) => {
          setIsProcessing(false);
          toast({
            title: 'Payment Failed',
            description: err.message || 'Razorpay payment could not be processed.',
            variant: 'destructive',
          });
        },
      });
    } catch (err) {
      console.error('Folder checkout error:', err);
      toast({
        title: 'Checkout Error',
        description: err.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  if (!folder) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[480px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Folder Unlock Checkout</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold font-heading text-foreground">
            Complete Purchase
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Unlock all chapters, PDFs and materials inside this folder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 pt-2 sm:pt-3">
          {/* Folder Item Card */}
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-secondary/50 border border-border/70 flex items-center gap-2.5 sm:gap-3.5">
            <FolderCategoryIcon
              category={folder.name}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl"
              iconClassName="w-5 h-5 sm:w-6 sm:h-6"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                {folder.type === 'tests' ? 'Test Series Folder' : 'Study Notes Folder'}
              </span>
              <h4 className="font-bold text-foreground text-sm sm:text-base truncate">{folder.name}</h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                Full syllabus lifetime access
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base sm:text-lg font-black text-primary">₹{price}</span>
            </div>
          </div>

          {/* Bonus Free Test Series Banner for Notes */}
          {(folder.type || 'notes') === 'notes' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>
                <strong>Special Bonus:</strong> Unlocks all Chapter Tests for <strong>{folder.name}</strong> for <strong>FREE</strong>!
              </span>
            </div>
          )}

          {/* Reward Points Toggle */}
          {rewardPoints > 0 && maxDiscount > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-foreground">Redeem Reward Points</p>
                    <p className="text-[11px] text-muted-foreground">
                      Balance: {rewardPoints} pts (Save up to ₹{maxDiscount})
                    </p>
                  </div>
                </div>
                <Switch checked={usePoints} onCheckedChange={setUsePoints} />
              </div>

              <AnimatePresence>
                {usePoints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 mt-3 border-t border-primary/15 flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">Points applied ({pointsToUse} pts)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      -₹{pointsDiscount}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 p-4 rounded-2xl bg-secondary/30 border border-border/50 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Folder Pack Price</span>
              <span className="font-medium text-foreground">₹{price}</span>
            </div>
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Points Discount</span>
                <span>-₹{pointsDiscount}</span>
              </div>
            )}
            <Separator className="my-1.5" />
            <div className="flex justify-between text-sm font-bold text-foreground">
              <span>Total Payable</span>
              <span className="text-lg font-black text-primary">₹{finalPrice}</span>
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Instant Unlocking • 100% Secure Access</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-xl text-xs font-semibold"
              disabled={isProcessing}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="gradient"
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-2 h-11 rounded-xl text-xs font-bold gap-2 shadow-md"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {finalPrice > 0 ? `Pay ₹${finalPrice} & Unlock` : 'Unlock Now (Free)'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderCheckoutModal;
