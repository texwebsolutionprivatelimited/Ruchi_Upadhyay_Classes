import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Wallet, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
const TransactionHistoryDialog = ({ open, onOpenChange }) => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (open && user) {
            fetchTransactions();
        }
    }, [open, user]);
    const fetchTransactions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('wallet_transactions')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });
        if (!error && data) {
            setTransactions(data);
        }
        setLoading(false);
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[500px] p-0 overflow-hidden border-border bg-card/95 backdrop-blur-xl">
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary"></div>
            <DialogHeader className="p-4 md:p-6 pb-2">
                <div className="flex items-center gap-2 md:gap-3 mb-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl md:text-2xl font-bold font-heading">Elite Wallet</DialogTitle>
                        <DialogDescription className="text-xs md:text-sm">Your transaction history and points.</DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="p-4 md:p-6 pt-0">
                <ScrollArea className="h-[350px] md:h-[400px] pr-2 md:pr-4">
                    {loading ? (<div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground py-16 md:py-20">
                        <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm">Loading transactions...</p>
                    </div>) : transactions.length === 0 ? (<div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16 md:py-20">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                            <Clock className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground/50" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-sm md:text-base">No Transactions Yet</h3>
                            <p className="text-xs text-muted-foreground">Start learning to earn reward points!</p>
                        </div>
                    </div>) : (<div className="space-y-2 md:space-y-3 py-2 md:py-4">
                        <AnimatePresence mode="popLayout">
                            {transactions.map((tx, idx) => (<motion.div key={tx.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all duration-300">
                                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'earning'
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-red-500/10 text-red-500'}`}>
                                        {tx.type === 'earning' ? <ArrowDownLeft className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-xs md:text-sm text-card-foreground group-hover:text-primary transition-colors truncate">
                                            {tx.description}
                                        </p>
                                        <p className="text-[8px] md:text-[10px] text-muted-foreground">
                                            {format(new Date(tx.created_at), 'MMM dd, yyyy • hh:mm a')}
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex items-center font-bold text-sm md:text-base shrink-0 ${tx.type === 'earning' ? 'text-green-500' : 'text-red-500'}`}>
                                    {tx.type === 'earning' ? <Plus className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5" /> : <Minus className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5" />}
                                    {tx.amount}
                                </div>
                            </motion.div>))}
                        </AnimatePresence>
                    </div>)}
                </ScrollArea>
            </div>

            <div className="p-3 md:p-4 bg-secondary/20 border-t border-border/50 text-center">
                <p className="text-[8px] md:text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                    Elite Reward Economy • 100 Points = ₹1.00
                </p>
            </div>
        </DialogContent>
    </Dialog>);
};
export default TransactionHistoryDialog;
