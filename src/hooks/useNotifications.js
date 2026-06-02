import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const fetchNotifications = async () => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);
        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchNotifications();
    }, [user]);
    // Realtime subscription
    useEffect(() => {
        if (!user)
            return;
        const channel = supabase
            .channel('notifications-channel')
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
        }, (payload) => {
            const newNotification = payload.new;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);
    const markAsRead = async (notificationId) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);
        if (!error) {
            setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n)));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };
    const markAllAsRead = async () => {
        if (!user)
            return;
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        }
    };
    return {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
    };
};
