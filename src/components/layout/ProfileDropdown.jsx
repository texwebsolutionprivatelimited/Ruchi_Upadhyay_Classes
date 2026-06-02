import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, ShoppingBag, Target, Award, Zap, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
const ProfileDropdown = () => {
    const { user, profile, signOut } = useAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };
    const getInitials = (name) => {
        return name
            ? name.substring(0, 1).toUpperCase()
            : user?.email?.substring(0, 1).toUpperCase() || 'U';
    };
    return (<DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-0.5 rounded-full bg-gradient-to-tr from-primary/20 via-border to-accent/20 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300">
                <Avatar className="h-9 w-9 border-2 border-background ring-1 ring-primary/10">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(profile?.username || '')}
                    </AvatarFallback>
                </Avatar>
                {unreadCount > 0 && (<span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary border-2 border-background rounded-full" />)}
            </motion.div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 sm:w-80 max-w-[calc(100vw-1rem)] p-2 mt-2 bg-background/80 backdrop-blur-xl border-primary/10 shadow-2xl rounded-2xl overflow-hidden" align="end" sideOffset={8} alignOffset={0} forceMount>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient opacity-50"></div>

            <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                    <p className="text-base font-heading font-bold leading-none text-foreground tracking-tight">
                        {profile?.username || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground leading-none font-medium opacity-70">
                        {user?.email}
                    </p>
                </div>
            </DropdownMenuLabel>

            <div className="px-2 pb-2">
                {/* Stats Section */}
                <div className="p-3 bg-gradient-to-br from-secondary/40 to-secondary/10 rounded-xl border border-primary/5 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>XP Balance</span>
                        </div>
                        <p className="font-black text-xl text-foreground">
                            {profile?.xp || 0}
                        </p>
                    </div>
                    <div className="space-y-1 border-l border-primary/10 pl-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                            <Award className="w-3 h-3 text-primary" />
                            <span>Day Streak</span>
                        </div>
                        <p className="font-black text-xl text-foreground">
                            {profile?.streak || 0} <span className="text-sm">🔥</span>
                        </p>
                    </div>
                </div>
            </div>

            <DropdownMenuSeparator className="bg-primary/5 mx-2" />

            <DropdownMenuGroup className="p-1">
                <DropdownMenuItem onClick={() => navigate('/profile')} className="py-3 px-3 cursor-pointer rounded-xl focus:bg-primary/10 focus:text-primary transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center mr-3 group-focus:bg-primary/20 transition-colors">
                        <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">My Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/purchases')} className="py-3 px-3 cursor-pointer rounded-xl focus:bg-primary/10 focus:text-primary transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center mr-3 group-focus:bg-accent/20 transition-colors">
                        <ShoppingBag className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm">My Purchases</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/referrals')} className="py-3 px-3 cursor-pointer rounded-xl focus:bg-primary/10 focus:text-primary transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-lg bg-green-500/5 flex items-center justify-center mr-3 group-focus:bg-green-500/20 transition-colors">
                        <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-sm">Refer & Earn</span>
                    <Badge variant="secondary" className="ml-auto text-[10px] font-black uppercase bg-green-500/10 text-green-600 border-none">
                        Gift
                    </Badge>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate('/notifications')} className="py-3 px-3 cursor-pointer rounded-xl focus:bg-primary/10 focus:text-primary transition-all duration-200 group relative">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/5 flex items-center justify-center mr-3 group-focus:bg-blue-500/20 transition-colors">
                        <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-sm">Notifications</span>
                    {unreadCount > 0 && (<Badge className="ml-auto h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>)}
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-primary/5 mx-2" />

            <div className="p-1">
                <DropdownMenuItem onClick={handleSignOut} className="py-2.5 px-3 cursor-pointer rounded-xl text-red-500 focus:text-red-600 focus:bg-red-500/10 transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center mr-3 group-focus:bg-red-500/20 transition-colors">
                        <LogOut className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm">Log out</span>
                </DropdownMenuItem>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>);
};
export default ProfileDropdown;
