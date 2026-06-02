import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
export const useSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchSettings = async () => {
        if (!user) {
            setSettings(null);
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
        if (error) {
            console.error('Error fetching settings:', error);
        }
        if (data) {
            setSettings(data);
        }
        else if (!error) {
            // Create default settings if none exist
            const { data: newSettings, error: insertError } = await supabase
                .from('user_settings')
                .insert({ user_id: user.id })
                .select()
                .single();
            if (!insertError && newSettings) {
                setSettings(newSettings);
            }
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchSettings();
    }, [user]);
    const updateSettings = async (updates) => {
        if (!user || !settings)
            return;
        const { data, error } = await supabase
            .from('user_settings')
            .update(updates)
            .eq('user_id', user.id)
            .select()
            .single();
        if (error) {
            toast.error('Failed to update settings');
            return false;
        }
        if (data) {
            setSettings(data);
            toast.success('Settings updated');
            return true;
        }
        return false;
    };
    return {
        settings,
        loading,
        updateSettings,
        refetch: fetchSettings,
    };
};
