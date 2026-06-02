import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Gift, Info, AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
const getNotificationIcon = (type) => {
    switch (type) {
        case 'success':
            return <Check className="w-5 h-5 text-green-500" />;
        case 'warning':
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case 'reward':
            return <Gift className="w-5 h-5 text-primary" />;
        default:
            return <Info className="w-5 h-5 text-blue-500" />;
    }
};
const Notifications = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
    return (<div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <main className="pt-20 pb-16">
            {/* Hero Section */}
            <section className="py-8 md:py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 mb-6 md:mb-8">
                <div className="container mx-auto px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                            <Bell className="w-5 h-5" />
                            <span className="font-medium">Stay Informed</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-foreground mb-3 md:mb-4 flex flex-wrap items-center justify-center gap-2 md:gap-3">
                            <span className="text-primary">Notifications</span>
                            {unreadCount > 0 && (<Badge className="text-xs md:text-sm px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-primary/20 text-primary border-primary/20">
                                {unreadCount} New
                            </Badge>)}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-4 max-w-xl mx-auto leading-relaxed">
                            Stay updated with your latest activities, rewards, and achievements.
                        </p>

                        {unreadCount > 0 && (<Button onClick={markAllAsRead} className="gradient-primary shadow-lg shadow-primary/20 font-bold px-6 md:px-8 h-10 md:h-12 hover:scale-[1.02] transition-transform text-xs md:text-sm">
                            <CheckCheck className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            Mark All as Read
                        </Button>)}
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-3xl">
                <div className="space-y-4">
                    {loading ? (<div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium text-xs md:text-sm">Synchronizing notifications...</p>
                    </div>) : notifications.length === 0 ? (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <Card className="border-dashed border-2 bg-secondary/10 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"></div>
                            <CardContent className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6 rotate-3">
                                    <Bell className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground opacity-30" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2">No notifications yet</h3>
                                <p className="text-xs md:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                                    We'll notify you when something important happens, like earning XP or completing a course. Check back later!
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>) : (<div className="grid gap-4">
                        {notifications.map((notification, index) => (<motion.div key={notification.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                            <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/5 cursor-pointer ${!notification.is_read ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-card hover:border-primary/20'}`} onClick={() => !notification.is_read && markAsRead(notification.id)}>
                                <CardContent className="p-4 md:p-6 flex gap-4 md:gap-5 items-start">
                                    <div className={`p-2.5 md:p-3.5 rounded-xl md:rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${notification.type === 'success' ? 'bg-green-500/10' :
                                        notification.type === 'warning' ? 'bg-yellow-500/10' :
                                            notification.type === 'reward' ? 'bg-primary/10' : 'bg-blue-500/10'}`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 mb-1.5">
                                            <h3 className={`font-bold text-sm md:text-base tracking-tight ${!notification.is_read ? 'text-primary' : 'text-foreground'} truncate`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-[9px] md:text-xs font-bold uppercase tracking-tighter text-muted-foreground/60 bg-secondary/30 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg self-start sm:self-auto shrink-0">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pr-2">
                                            {notification.message}
                                        </p>
                                    </div>

                                    {!notification.is_read && (<div className="shrink-0 pt-1.5">
                                        <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)] animate-pulse" />
                                    </div>)}
                                </CardContent>
                            </Card>
                        </motion.div>))}
                    </div>)}
                </div>
            </div>
        </main>

        <Footer />
    </div>);
};
export default Notifications;
