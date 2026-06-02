import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTests = (category = null) => {
    return useQuery({
        queryKey: ['public-tests', category],
        queryFn: async () => {
            let query = supabase
                .from('tests')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 60 * 5,
    });
};
