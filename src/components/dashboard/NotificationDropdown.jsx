import { Bell, Check, CheckCheck, Gift, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
const getNotificationIcon = (type) => {
    switch (type) {
        case 'success':
            return <Check className="w-4 h-4 text-green-500"/>;
        case 'warning':
            return <AlertTriangle className="w-4 h-4 text-yellow-500"/>;
        case 'reward':
            return <Gift className="w-4 h-4 text-primary"/>;
        default:
            return <Info className="w-4 h-4 text-blue-500"/>;
    }
};
const NotificationDropdown = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
    return (<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="w-5 h-5"/>
          {unreadCount > 0 && (<span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (<Button variant="ghost" size="sm" className="h-auto p-1 text-xs" onClick={markAllAsRead}>
              <CheckCheck className="w-3 h-3 mr-1"/>
              Mark all read
            </Button>)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {loading ? (<div className="p-4 text-center text-muted-foreground">Loading...</div>) : notifications.length === 0 ? (<div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50"/>
              <p>No notifications yet</p>
            </div>) : (notifications.map((notification) => (<DropdownMenuItem key={notification.id} className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.is_read ? 'bg-primary/5' : ''}`} onClick={() => markAsRead(notification.id)}>
                <div className="shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!notification.is_read && (<div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1"/>)}
              </DropdownMenuItem>)))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>);
};
export default NotificationDropdown;
