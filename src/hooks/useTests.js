import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { defaultChapterTests } from '@/data/chapterTests';

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
            if (error) {
                console.error('Error fetching tests from Supabase:', error);
            }

            const dbTests = data || [];
            const dbTitles = new Set(dbTests.map(t => (t.title || '').trim().toLowerCase()));

            // Merge default tests if not already created in DB
            const applicableDefaults = defaultChapterTests.filter(dt => {
                if (category && dt.category.toLowerCase() !== category.toLowerCase()) return false;
                return !dbTitles.has((dt.title || '').trim().toLowerCase());
            });

            return [...dbTests, ...applicableDefaults];
        },
        staleTime: 1000 * 60 * 5,
    });
};

