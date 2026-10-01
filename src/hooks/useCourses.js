import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
export const useCourses = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, addXP } = useAuth();
    const { toast } = useToast();
    const fetchEnrolledCourses = async () => {
        if (!user) {
            setEnrolledCourses([]);
            setLoading(false);
            return;
        }
        try {
            const [enrollRes, purchaseRes, freeCoursesRes] = await Promise.all([
                supabase
                    .from('user_courses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('enrolled_at', { ascending: false }),
                supabase
                    .from('purchases')
                    .select('course_id')
                    .eq('user_id', user.id)
                    .eq('status', 'completed')
                    .not('course_id', 'is', null),
                supabase
                    .from('courses')
                    .select('id')
                    .or('price.eq.0,price.is.null')
            ]);

            if (enrollRes.error) {
                console.error('Error fetching enrolled courses:', enrollRes.error);
                return;
            }

            const userCourses = enrollRes.data || [];
            const purchasedCourseIds = new Set((purchaseRes.data || []).map(p => p.course_id));
            const freeCourseIds = new Set((freeCoursesRes.data || []).map(c => c.id));

            // Legitimate enrollments: either paid in purchases or truly free
            const validEnrollments = userCourses.filter(uc =>
                purchasedCourseIds.has(uc.course_id) || freeCourseIds.has(uc.course_id)
            );

            setEnrolledCourses(validEnrollments);
        } catch (err) {
            console.error('Error verifying course enrollments:', err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEnrolledCourses();
    }, [user]);
    // Refetch when page becomes visible (e.g., when navigating back from course details)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && user) {
                console.log('🔄 Page visible - refetching course data');
                fetchEnrolledCourses();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [user]);
    const enrollInCourse = async (courseId) => {
        if (!user) {
            toast({
                title: 'Sign in required',
                description: 'Please sign in to enroll in courses.',
                variant: 'destructive',
            });
            return { success: false };
        }
        // Check if already enrolled
        const existingEnrollment = enrolledCourses.find(c => c.course_id === courseId);
        if (existingEnrollment) {
            toast({
                title: 'Already enrolled',
                description: 'You are already enrolled in this course.',
            });
            return { success: false };
        }

        // Fetch course info to check price
        const { data: courseData } = await supabase
            .from('courses')
            .select('price, title')
            .eq('id', courseId)
            .maybeSingle();

        const isPaid = courseData && Number(courseData.price) > 0;

        if (isPaid) {
            // Check that a real completed purchase exists
            const { data: purchaseData } = await supabase
                .from('purchases')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .eq('status', 'completed')
                .maybeSingle();

            if (!purchaseData) {
                toast({
                    title: 'Payment required',
                    description: 'Please complete payment to access this course.',
                    variant: 'destructive',
                });
                return { success: false };
            }
        }

        const { error } = await supabase
            .from('user_courses')
            .insert({
                user_id: user.id,
                course_id: courseId,
                progress: 0,
            });

        if (error) {
            console.error('Error enrolling in course:', error);
            toast({
                title: 'Enrollment failed',
                description: error.message,
                variant: 'destructive',
            });
            return { success: false };
        }

        // Only for genuinely free courses (price == 0), record a free purchase if missing
        if (!isPaid) {
            const { data: existingPurchase } = await supabase
                .from('purchases')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .maybeSingle();

            if (!existingPurchase) {
                await supabase.from('purchases').insert({
                    user_id: user.id,
                    course_id: courseId,
                    amount: 0,
                    status: 'completed',
                    order_id: `FREE_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                    payment_id: 'free_enroll',
                    paid_at: new Date().toISOString()
                });
            }
        }

        toast({
            title: 'Enrolled successfully!',
            description: 'You can now access this course.',
        });
        await fetchEnrolledCourses();
        return { success: true };
    };
    const updateProgress = async (courseId, progress) => {
        if (!user)
            return;
        console.log('🔄 Updating progress in database:', { courseId, progress, userId: user.id });
        // 1. Get current status BEFORE update
        const { data: currentStatus } = await supabase
            .from('user_courses')
            .select('progress, completed_at')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .maybeSingle();
        const isNowCompleting = progress >= 100 && !currentStatus?.completed_at;
        console.log('🏁 Completion Check:', {
            currentProgress: currentStatus?.progress,
            alreadyCompleted: !!currentStatus?.completed_at,
            newProgress: progress,
            isNowCompleting
        });
        // 2. Perform the update/upsert
        const { error } = await supabase
            .from('user_courses')
            .upsert({
            user_id: user.id,
            course_id: courseId,
            progress: Math.min(progress, 100),
            completed_at: (progress >= 100) ? (currentStatus?.completed_at || new Date().toISOString()) : currentStatus?.completed_at,
        }, {
            onConflict: 'user_id,course_id'
        });
        if (error) {
            console.error('❌ Error updating progress:', error);
            return;
        }
        // 3. XP rewards and notifications are now handled automatically by 
        // the database trigger 'on_course_progress_update'.
        // No manual awarding needed here.
        await fetchEnrolledCourses();
    };
    const isEnrolled = (courseId) => {
        return enrolledCourses.some(c => c.course_id === courseId);
    };
    const getProgress = (courseId) => {
        const enrollment = enrolledCourses.find(c => c.course_id === courseId);
        return enrollment?.progress ?? 0;
    };
    const getCompletedAt = (courseId) => {
        const enrollment = enrolledCourses.find(c => c.course_id === courseId);
        return enrollment?.completed_at ? new Date(enrollment.completed_at) : null;
    };
    return {
        enrolledCourses,
        loading,
        enrollInCourse,
        updateProgress,
        isEnrolled,
        getProgress,
        getCompletedAt,
        refetch: fetchEnrolledCourses,
    };
};
