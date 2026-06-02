import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './useCourses';
export const useLessonProgress = (courseId, totalLessons) => {
    const [lessonProgress, setLessonProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { updateProgress } = useCourses();
    const fetchProgress = async () => {
        if (!user || !courseId) {
            setLessonProgress([]);
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseId);
        if (error) {
            console.error('Error fetching lesson progress:', error);
        }
        else {
            setLessonProgress(data || []);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchProgress();
    }, [user, courseId]);
    const isLessonCompleted = (sectionIndex, lessonIndex) => {
        return lessonProgress.some(p => p.section_index === sectionIndex && p.lesson_index === lessonIndex);
    };
    const toggleLessonComplete = async (sectionIndex, lessonIndex) => {
        if (!user)
            return;
        const isCompleted = isLessonCompleted(sectionIndex, lessonIndex);
        // Mark as complete or remove
        if (isCompleted) {
            const { error } = await supabase
                .from('lesson_progress')
                .delete()
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .eq('section_index', sectionIndex)
                .eq('lesson_index', lessonIndex);
            if (error) {
                console.error('Error removing lesson progress:', error);
                return;
            }
        }
        else {
            const { error } = await supabase
                .from('lesson_progress')
                .insert({
                user_id: user.id,
                course_id: courseId,
                section_index: sectionIndex,
                lesson_index: lessonIndex,
            });
            if (error) {
                console.error('Error saving lesson progress:', error);
                return;
            }
        }
        // Refresh progress state
        await fetchProgress();
        // Fetch the updated count directly to avoid race conditions with state
        const { data: updatedData } = await supabase
            .from('lesson_progress')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseId);
        const actualCompletedCount = updatedData?.length || 0;
        const newProgressPercent = Math.round((actualCompletedCount / totalLessons) * 100);
        const cappedProgress = Math.min(newProgressPercent, 100);
        await updateProgress(courseId, cappedProgress);
    };
    const completedCount = lessonProgress.length;
    const progressPercent = totalLessons > 0
        ? Math.round((completedCount / totalLessons) * 100)
        : 0;
    return {
        lessonProgress,
        loading,
        isLessonCompleted,
        toggleLessonComplete,
        completedCount,
        progressPercent,
        refetch: fetchProgress,
    };
};
