import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
export const useIsAdmin = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['isAdmin', user?.id],
        queryFn: async () => {
            if (!user)
                return false;
            const { data, error } = await supabase
                .rpc('has_role', { _user_id: user.id, _role: 'admin' });
            if (error) {
                console.error('Error checking admin status:', error);
                return false;
            }
            return data ?? false;
        },
        enabled: !!user,
    });
};
export const useNotes = (category) => {
    return useQuery({
        queryKey: ['notes', category],
        queryFn: async () => {
            let query = supabase.from('notes').select('*').order('created_at', { ascending: false });
            if (category) {
                query = query.eq('category', category);
            }
            const { data, error } = await query;
            if (error)
                throw error;
            return data;
        },
    });
};
export const useTests = (category) => {
    return useQuery({
        queryKey: ['tests', category],
        queryFn: async () => {
            let query = supabase.from('tests').select('*').order('created_at', { ascending: false });
            if (category) {
                query = query.eq('category', category);
            }
            const { data, error } = await query;
            if (error)
                throw error;
            return data?.map(test => ({
                ...test,
                questions: test.questions || []
            }));
        },
    });
};
export const useCoursesList = (category) => {
    return useQuery({
        queryKey: ['courses-db', category],
        queryFn: async () => {
            let query = supabase.from('courses').select('*').order('created_at', { ascending: false });
            if (category) {
                query = query.eq('category', category);
            }
            const { data, error } = await query;
            if (error)
                throw error;
            return data;
        },
    });
};
// Mutations for Notes
export const useCreateNote = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    return useMutation({
        mutationFn: async (note) => {
            const { data, error } = await supabase
                .from('notes')
                .insert([{ ...note, created_by: user?.id }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['public-notes'] });
            toast({ title: 'Note created successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to create note', description: error.message, variant: 'destructive' });
        },
    });
};
export const useUpdateNote = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ id, ...note }) => {
            const { data, error } = await supabase
                .from('notes')
                .update(note)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['public-notes'] });
            toast({ title: 'Note updated successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to update note', description: error.message, variant: 'destructive' });
        },
    });
};
export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase.from('notes').delete().eq('id', id);
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['public-notes'] });
            toast({ title: 'Note deleted successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to delete note', description: error.message, variant: 'destructive' });
        },
    });
};
// Mutations for Tests
export const useCreateTest = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    return useMutation({
        mutationFn: async (test) => {
            const { data, error } = await supabase
                .from('tests')
                .insert([{ ...test, created_by: user?.id }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            toast({ title: 'Test created successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to create test', description: error.message, variant: 'destructive' });
        },
    });
};
export const useUpdateTest = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ id, ...test }) => {
            const { data, error } = await supabase
                .from('tests')
                .update(test)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            toast({ title: 'Test updated successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to update test', description: error.message, variant: 'destructive' });
        },
    });
};
export const useDeleteTest = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase.from('tests').delete().eq('id', id);
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            toast({ title: 'Test deleted successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to delete test', description: error.message, variant: 'destructive' });
        },
    });
};
// Mutations for Courses
export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    return useMutation({
        mutationFn: async (course) => {
            const { data, error } = await supabase
                .from('courses')
                .insert([{ ...course, created_by: user?.id }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses-db'] });
            toast({ title: 'Course created successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to create course', description: error.message, variant: 'destructive' });
        },
    });
};
export const useUpdateCourse = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ id, ...course }) => {
            const { data, error } = await supabase
                .from('courses')
                .update(course)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses-db'] });
            toast({ title: 'Course updated successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to update course', description: error.message, variant: 'destructive' });
        },
    });
};
export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (id) => {
            // Hard delete using secure RPC to bypass RLS and handle constraints
            const { error } = await supabase.rpc('delete_course_completely', {
                p_course_id: id
            });

            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses-db'] });
            toast({ title: 'Course deleted successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to delete course', description: error.message, variant: 'destructive' });
        },
    });
};
// Lessons CRUD
export const useLessons = (courseId) => {
    return useQuery({
        queryKey: ['lessons', courseId],
        queryFn: async () => {
            if (!courseId)
                return [];
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true });
            if (error)
                throw error;
            return data;
        },
        enabled: !!courseId,
    });
};
export const useCreateLesson = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (lesson) => {
            const { data, error } = await supabase
                .from('lessons')
                .insert([lesson])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', variables.course_id] });
            toast({ title: 'Lesson created successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to create lesson', description: error.message, variant: 'destructive' });
        },
    });
};
export const useUpdateLesson = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ id, ...lesson }) => {
            const { data, error } = await supabase
                .from('lessons')
                .update(lesson)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', data.course_id] });
            toast({ title: 'Lesson updated successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to update lesson', description: error.message, variant: 'destructive' });
        },
    });
};
export const useDeleteLesson = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ id, courseId }) => {
            const { error } = await supabase.from('lessons').delete().eq('id', id);
            if (error)
                throw error;
            return courseId;
        },
        onSuccess: (courseId) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', courseId] });
            toast({ title: 'Lesson deleted successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to delete lesson', description: error.message, variant: 'destructive' });
        },
    });
};
export const useReorderLessons = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ lessons, courseId }) => {
            const updates = lessons.map(lesson => supabase
                .from('lessons')
                .update({ order_index: lesson.order_index })
                .eq('id', lesson.id));
            await Promise.all(updates);
            return courseId;
        },
        onSuccess: (courseId) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', courseId] });
            toast({ title: 'Lessons reordered successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to reorder lessons', description: error.message, variant: 'destructive' });
        },
    });
};
export const useUploadNoteFile = () => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('notes')
                .upload(fileName, file);
            if (error)
                throw error;
            const { data: { publicUrl } } = supabase.storage
                .from('notes')
                .getPublicUrl(fileName);
            return publicUrl;
        },
        onError: (error) => {
            toast({ title: 'Failed to upload file', description: error.message, variant: 'destructive' });
        },
    });
};
export const useDeleteNoteFile = () => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (fileUrl) => {
            const fileName = fileUrl.split('/').pop();
            if (!fileName)
                throw new Error('Invalid file URL');
            const { error } = await supabase.storage
                .from('notes')
                .remove([fileName]);
            if (error)
                throw error;
        },
        onError: (error) => {
            toast({ title: 'Failed to delete file', description: error.message, variant: 'destructive' });
        },
    });
};
// User Role Management
export const useUsers = () => {
    return useQuery({
        queryKey: ['users-with-roles'],
        queryFn: async () => {
            // Get all profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('user_id, username, avatar_url, created_at')
                .order('created_at', { ascending: false });
            if (profilesError)
                throw profilesError;
            // Get all user roles
            const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('user_id, role');
            if (rolesError)
                throw rolesError;
            // Merge the data
            const usersWithRoles = profiles.map(profile => {
                const userRole = roles?.find(r => r.user_id === profile.user_id);
                return {
                    id: profile.user_id,
                    email: '', // We don't have access to email from profiles
                    username: profile.username,
                    avatar_url: profile.avatar_url,
                    created_at: profile.created_at,
                    role: userRole?.role,
                };
            });
            return usersWithRoles;
        },
    });
};
export const useAssignRole = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ userId, role }) => {
            // First, delete existing role for this user
            await supabase.from('user_roles').delete().eq('user_id', userId);
            // Then insert the new role
            const { data, error } = await supabase
                .from('user_roles')
                .insert([{ user_id: userId, role }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
            toast({ title: 'Role assigned successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to assign role', description: error.message, variant: 'destructive' });
        },
    });
};
export const useRemoveRole = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (userId) => {
            const { error } = await supabase.from('user_roles').delete().eq('user_id', userId);
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
            toast({ title: 'Role removed successfully' });
        },
        onError: (error) => {
            toast({ title: 'Failed to remove role', description: error.message, variant: 'destructive' });
        },
    });
};
export const useUserPurchases = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['user-purchases', user?.id],
        queryFn: async () => {
            if (!user)
                return [];
            const { data, error } = await supabase
                .from('purchases')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'completed');
            if (error)
                throw error;
            return data;
        },
        enabled: !!user,
    });
};
export const useBuyTest = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    return useMutation({
        mutationFn: async (testId) => {
            if (!user)
                throw new Error('User not authenticated');
            const { data, error } = await supabase
                .from('purchases')
                .insert([{
                    user_id: user.id,
                    test_id: testId,
                    order_id: 'TEST_' + Date.now() + '_' + Math.random().toString(36).substring(7),
                    amount: 0,
                    status: 'completed',
                    payment_id: 'internal_' + Math.random().toString(36).substring(7),
                }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
            toast({ title: 'Test unlocked successfully!' });
        },
        onError: (error) => {
            toast({ title: 'Purchase failed', description: error.message, variant: 'destructive' });
        },
    });
};
export const useBuyNote = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    return useMutation({
        mutationFn: async (noteId) => {
            if (!user)
                throw new Error('User not authenticated');
            const { data, error } = await supabase
                .from('purchases')
                .insert([{
                    user_id: user.id,
                    note_id: noteId,
                    order_id: 'NOTE_' + Date.now() + '_' + Math.random().toString(36).substring(7),
                    amount: 0,
                    status: 'completed',
                    payment_id: 'internal_' + Math.random().toString(36).substring(7),
                }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
            toast({ title: 'Note unlocked successfully!' });
        },
        onError: (error) => {
            toast({ title: 'Purchase failed', description: error.message, variant: 'destructive' });
        },
    });
};

// Category Purchases
export const useCategoryPurchases = () => {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['category-purchases', user?.id],
        queryFn: async () => {
            if (!user)
                return [];
            const { data, error } = await supabase
                .from('category_purchases')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'completed');
            if (error)
                throw error;
            return data;
        },
        enabled: !!user,
    });
};

export const useBuyCategory = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    return useMutation({
        mutationFn: async ({ category, contentType, amount }) => {
            if (!user)
                throw new Error('User not authenticated');
            const { data, error } = await supabase
                .from('category_purchases')
                .insert([{
                    user_id: user.id,
                    category,
                    content_type: contentType,
                    amount,
                    order_id: `CAT_${contentType.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                    status: 'completed',
                    payment_id: 'internal_' + Math.random().toString(36).substring(7),
                }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category-purchases'] });
            toast({ title: 'Category unlocked successfully!' });
        },
        onError: (error) => {
            toast({ title: 'Purchase failed', description: error.message, variant: 'destructive' });
        },
    });
};
