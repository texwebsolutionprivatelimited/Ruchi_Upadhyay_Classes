import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Coins, Loader2, Gift, Percent, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useReferrals } from '@/hooks/useReferrals';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  openRazorpayCheckout,
  createServerlessRazorpayOrder,
  verifyServerlessRazorpayPayment,
} from '@/services/razorpay';
import { notifyAdminsAboutPurchase } from '@/utils/notifyAdmin';
const POINTS_PER_RUPEE = 100; // 100 points = ₹1 discount
const CheckoutModal = ({ open, onOpenChange, course, onEnrollSuccess }) => {
    const { rewardPoints, refetch: refetchReferrals } = useReferrals();
    const { user } = useAuth();
    const [usePoints, setUsePoints] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pointsToUse, setPointsToUse] = useState(0);
    // Calculate maximum points that can be used (can't discount more than 50% of price)
    const maxPointsAllowed = Math.min(rewardPoints, course.price * POINTS_PER_RUPEE * 0.5);
    const maxDiscount = Math.floor(maxPointsAllowed / POINTS_PER_RUPEE);
    useEffect(() => {
        if (usePoints) {
            setPointsToUse(Math.floor(maxPointsAllowed));
        }
        else {
            setPointsToUse(0);
        }
    }, [usePoints, maxPointsAllowed]);
    const pointsDiscount = Math.floor(pointsToUse / POINTS_PER_RUPEE);
    const courseDiscount = course.originalPrice ? course.originalPrice - course.price : 0;
    const finalPrice = Math.max(0, course.price - pointsDiscount);
    const totalSavings = courseDiscount + pointsDiscount;
    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please login to continue');
            return;
        }
        setIsProcessing(true);

        const completeEnrollment = async (paymentId, orderId) => {
            // Deduct points if used
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
            // Create notification for the purchase
            await supabase.from('notifications').insert({
                user_id: user.id,
                title: 'Course Enrolled!',
                message: `You have successfully enrolled in "${course.title}"${pointsDiscount > 0 ? `. Saved ₹${pointsDiscount} using ${pointsToUse} reward points!` : ''}`,
                type: 'success',
            });
            const finalOrderId = orderId || `CRS_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            // Record the purchase in the purchases table
            const { error: purchaseError } = await supabase.from('purchases').insert({
                user_id: user.id,
                course_id: course.id,
                amount: finalPrice,
                points_used: pointsToUse,
                points_discount: pointsDiscount,
                status: 'completed',
                order_id: finalOrderId,
                payment_id: paymentId,
                paid_at: new Date().toISOString()
            });
            if (purchaseError) {
                console.error('Error recording purchase:', purchaseError);
            }

            // Notify Admin about this purchase
            const studentName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';
            await notifyAdminsAboutPurchase({
                studentName,
                itemTitle: course.title,
                itemType: 'Course',
                amount: finalPrice,
                orderId: finalOrderId,
            });

            refetchReferrals();
            toast.success('Enrollment successful!', {
                description: pointsDiscount > 0
                    ? `Saved ₹${pointsDiscount} with reward points!`
                    : undefined,
            });
            onEnrollSuccess();
            onOpenChange(false);
            setIsProcessing(false);
        };

        try {
            if (finalPrice === 0) {
                await completeEnrollment('free_enroll', `FREE_${Date.now()}`);
                return;
            }

            // 1. Create serverless Razorpay order
            const serverlessOrder = await createServerlessRazorpayOrder({
                amount: finalPrice,
                receipt: `crs_${course.id.substring(0, 8)}`,
                notes: { courseId: course.id, courseTitle: course.title, userId: user.id },
            });

            // 2. Open Razorpay Gateway
            await openRazorpayCheckout({
                amount: finalPrice,
                name: 'Ruchi Upadhyay Classes',
                description: `Enroll: ${course.title}`,
                orderId: serverlessOrder.orderId,
                prefill: {
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
                    email: user.email || '',
                },
                onSuccess: async ({ paymentId, orderId, signature }) => {
                    setIsProcessing(true);
                    // 3. Serverless signature verification
                    const verification = await verifyServerlessRazorpayPayment({
                        razorpay_order_id: orderId,
                        razorpay_payment_id: paymentId,
                        razorpay_signature: signature,
                    });

                    if (!verification.verified) {
                        toast.error('Payment verification failed on server. Contact support.');
                        setIsProcessing(false);
                        return;
                    }

                    await completeEnrollment(paymentId, orderId);
                },
                onDismiss: () => {
                    setIsProcessing(false);
                },
                onError: (err) => {
                    setIsProcessing(false);
                    toast.error(err.message || 'Razorpay payment could not be processed.');
                },
            });
        }
        catch (error) {
            console.error('Checkout error:', error);
            toast.error('Something went wrong. Please try again.');
            setIsProcessing(false);
        }
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5"/>
            Checkout
          </DialogTitle>
          <DialogDescription>
            Complete your enrollment for {course.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Course Summary */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
            <p className="text-sm text-muted-foreground">by {course.instructor}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-primary">
              <Gift className="w-4 h-4"/>
              <span>+{course.xpReward} XP on completion</span>
            </div>
          </div>

          {/* Points Redemption */}
          {rewardPoints > 0 && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Coins className="w-4 h-4 text-primary"/>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Use Reward Points</p>
                    <p className="text-xs text-muted-foreground">
                      You have {rewardPoints} points (₹{Math.floor(rewardPoints / POINTS_PER_RUPEE)} value)
                    </p>
                  </div>
                </div>
                <Switch checked={usePoints} onCheckedChange={setUsePoints}/>
              </div>

              <AnimatePresence>
                {usePoints && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <Separator className="my-3"/>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Points to use</span>
                        <span className="font-medium text-foreground">{pointsToUse} points</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount applied</span>
                        <span className="font-medium text-green-600">-₹{pointsDiscount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Max 50% of course price can be paid with points
                      </p>
                    </div>
                  </motion.div>)}
              </AnimatePresence>
            </motion.div>)}

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Original Price</span>
              <span className="text-muted-foreground line-through">
                ₹{course.originalPrice || course.price}
              </span>
            </div>

            {courseDiscount > 0 && (<div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Percent className="w-3 h-3"/>
                  Course Discount
                </span>
                <span className="text-green-600">-₹{courseDiscount}</span>
              </div>)}

            {pointsDiscount > 0 && (<div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Coins className="w-3 h-3"/>
                  Points Discount
                </span>
                <span className="text-green-600">-₹{pointsDiscount}</span>
              </div>)}

            <Separator />

            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Total</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-foreground">₹{finalPrice}</span>
                {totalSavings > 0 && (<p className="text-xs text-green-600">You save ₹{totalSavings}!</p>)}
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? (<>
                <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                Processing...
              </>) : (<>
                <CreditCard className="w-5 h-5 mr-2"/>
                {finalPrice === 0 ? 'Enroll for Free' : `Pay ₹${finalPrice}`}
              </>)}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By enrolling, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>);
};
export default CheckoutModal;
