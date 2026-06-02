import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export const useEnrollmentAnalytics = () => {
    return useQuery({
        queryKey: ['enrollment-analytics'],
        queryFn: async () => {
            // Fetch all user_courses enrollments
            const { data: enrollments, error: enrollmentsError } = await supabase
                .from('user_courses')
                .select('*');
            if (enrollmentsError)
                throw enrollmentsError;
            // Fetch all courses
            const { data: courses, error: coursesError } = await supabase
                .from('courses')
                .select('*');
            if (coursesError)
                throw coursesError;
            // Fetch all profiles for usernames
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('user_id, username');
            if (profilesError)
                throw profilesError;
            // Calculate stats
            const totalEnrollments = enrollments?.length || 0;
            // Get unique students
            const uniqueStudents = new Set(enrollments?.map(e => e.user_id) || []);
            const activeStudents = uniqueStudents.size;
            // Count completions (progress = 100 or completed_at is set)
            const completions = enrollments?.filter(e => e.progress === 100 || e.completed_at) || [];
            const totalCompletions = completions.length;
            // Average completion rate
            const avgProgress = enrollments?.length
                ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
                : 0;
            const avgCompletionRate = Math.round(avgProgress);
            // Popular courses (by enrollment count)
            const courseEnrollmentMap = new Map();
            enrollments?.forEach(e => {
                const count = courseEnrollmentMap.get(e.course_id) || 0;
                courseEnrollmentMap.set(e.course_id, count + 1);
            });
            const popularCourses = Array.from(courseEnrollmentMap.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([courseId, enrollmentCount]) => {
                const course = courses?.find(c => c.id === courseId);
                return {
                    id: courseId,
                    title: course?.title || 'Unknown Course',
                    category: course?.category || 'Unknown',
                    enrollments: enrollmentCount,
                };
            });
            // Completion rates by course
            const courseCompletionRates = (courses || [])
                .map(course => {
                const courseEnrollments = enrollments?.filter(e => e.course_id === course.id) || [];
                const avgRate = courseEnrollments.length
                    ? Math.round(courseEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / courseEnrollments.length)
                    : 0;
                return {
                    id: course.id,
                    title: course.title,
                    completionRate: avgRate,
                };
            })
                .filter(c => c.completionRate > 0)
                .sort((a, b) => b.completionRate - a.completionRate)
                .slice(0, 5);
            // Recent enrollments
            const recentEnrollments = (enrollments || [])
                .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
                .slice(0, 10)
                .map(enrollment => {
                const course = courses?.find(c => c.id === enrollment.course_id);
                const profile = profiles?.find(p => p.user_id === enrollment.user_id);
                return {
                    id: enrollment.id,
                    username: profile?.username || null,
                    courseTitle: course?.title || 'Unknown Course',
                    progress: enrollment.progress || 0,
                    enrolledAt: enrollment.enrolled_at,
                };
            });
            return {
                totalEnrollments,
                activeStudents,
                totalCompletions,
                avgCompletionRate,
                popularCourses,
                courseCompletionRates,
                recentEnrollments,
            };
        },
    });
};
