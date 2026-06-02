import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePublicCourses = () => {
    return useQuery({
        queryKey: ['public-courses'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map(course => ({
                ...course,
                // Ensure numeric fields are numbers
                price: Number(course.price),
                original_price: course.original_price ? Number(course.original_price) : null,
                rating: 4.8, // Placeholder as there is no rating table yet linked to courses directly in a simple way
                students: 0 // Placeholder or fetch count from user_courses
            }));
        },
        staleTime: 1000 * 60 * 5,
    });
};
