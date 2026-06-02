import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { categoryConfig, defaultCategoryConfig } from '@/config/categoryConfig';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            // 1. Fetch distinct categories from courses, notes, and tests
            const [coursesRes, notesRes, testsRes] = await Promise.all([
                supabase.from('courses').select('category').eq('is_active', true),
                supabase.from('notes').select('category'),
                supabase.from('tests').select('category')
            ]);

            if (coursesRes.error) throw coursesRes.error;
            if (notesRes.error) throw notesRes.error;
            if (testsRes.error) throw testsRes.error;

            // 2. Count items per category across all tables
            const counts = {};
            [...(coursesRes.data || []), ...(notesRes.data || []), ...(testsRes.data || [])].forEach(item => {
                const cat = item.category;
                counts[cat] = (counts[cat] || 0) + 1;
            });

            // 3. Map to category objects with config
            const categories = Object.keys(counts).map((name, index) => {
                const config = categoryConfig[name] || defaultCategoryConfig;
                return {
                    id: index + 1, // Generate a temporary ID for keying
                    name,
                    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    count: counts[name],
                    ...config
                };
            });

            // 4. Sort based on config order if possible, or name
            const configKeys = Object.keys(categoryConfig);
            return categories.sort((a, b) => {
                const indexA = configKeys.indexOf(a.name);
                const indexB = configKeys.indexOf(b.name);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return a.name.localeCompare(b.name);
            });
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
