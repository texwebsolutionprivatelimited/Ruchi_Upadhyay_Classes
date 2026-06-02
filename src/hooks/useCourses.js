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
        const { data, error } = await supabase
            .from('user_courses')
            .select('*')
            .eq('user_id', user.id)
            .order('enrolled_at', { ascending: false });
        if (error) {
            console.error('Error fetching enrolled courses:', error);
            return;
        }
        setEnrolledCourses(data || []);
        setLoading(false);
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
        // Ensure a purchase record exists so it shows in "My Store"
        // We check first to avoid duplicate records if CheckoutModal already handled it
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
                amount: 0, // Fallback for free/direct enrollment
                status: 'completed',
                order_id: `ENR_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                payment_id: 'direct_enroll',
                paid_at: new Date().toISOString()
            });
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
