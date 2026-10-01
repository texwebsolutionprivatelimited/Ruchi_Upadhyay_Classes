import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { defaultChapterTests } from '@/data/chapterTests';
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
            if (error) {
                console.error('Error fetching admin tests from Supabase:', error);
            }
            const dbTests = (data || []).map(test => ({
                ...test,
                questions: test.questions || []
            }));
            const dbTitles = new Set(dbTests.map(t => (t.title || '').trim().toLowerCase()));
            const extraDefaults = defaultChapterTests.filter(dt => {
                if (category && dt.category.toLowerCase() !== category.toLowerCase()) return false;
                return !dbTitles.has((dt.title || '').trim().toLowerCase());
            });
            return [...dbTests, ...extraDefaults];
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
            // First try the secure admin_get_users RPC which provides email and joined data
            try {
                const { data: rpcUsers, error: rpcError } = await supabase.rpc('admin_get_users');
                if (!rpcError && rpcUsers) {
                    return rpcUsers;
                }
            } catch (err) {
                console.warn('admin_get_users RPC failed or not yet applied, falling back:', err);
            }

            // Fallback: Get profiles with is_blocked
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('user_id, username, avatar_url, created_at, is_blocked')
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
                    email: '', // We don't have access to email from profiles fallback
                    username: profile.username,
                    avatar_url: profile.avatar_url,
                    created_at: profile.created_at,
                    role: userRole?.role,
                    is_blocked: Boolean(profile.is_blocked),
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
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async (userId) => {
            // Try secure RPC first
            const { error: rpcError } = await supabase.rpc('admin_delete_user', {
                target_user_id: userId
            });
            if (rpcError) {
                // Fallback: direct delete from tables
                console.warn('RPC admin_delete_user failed, attempting direct cascade delete:', rpcError);
                await supabase.from('user_roles').delete().eq('user_id', userId);
                await supabase.from('purchases').delete().eq('user_id', userId);
                await supabase.from('test_results').delete().eq('user_id', userId);
                const { error: profileError } = await supabase.from('profiles').delete().eq('user_id', userId);
                if (profileError) throw profileError;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
            toast({ title: 'User deleted successfully', description: 'User account and data have been removed.' });
        },
        onError: (error) => {
            toast({ title: 'Failed to delete user', description: error.message, variant: 'destructive' });
        },
    });
};
export const useToggleBlockUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ userId, isBlocked }) => {
            // Try secure RPC first
            const { error: rpcError } = await supabase.rpc('admin_toggle_block_user', {
                target_user_id: userId,
                block_status: isBlocked
            });
            if (rpcError) {
                // Fallback: direct update on profiles
                console.warn('RPC admin_toggle_block_user failed, attempting direct update:', rpcError);
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ is_blocked: isBlocked })
                    .eq('user_id', userId);
                if (updateError) throw updateError;
            }
            return { userId, isBlocked };
        },
        onSuccess: ({ isBlocked }) => {
            queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
            toast({ 
                title: isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
                description: isBlocked ? 'User will no longer be able to access restricted features.' : 'User access has been restored.'
            });
        },
        onError: (error) => {
            toast({ title: 'Failed to update user block status', description: error.message, variant: 'destructive' });
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

export const useUpdateFolderPrice = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: async ({ category, type, price }) => {
            const table = type === 'notes' ? 'notes' : 'tests';
            const numPrice = Math.max(0, Number(price) || 0);

            // 1. Update all items in this category with new price in Supabase
            const { data: updatedRows, error } = await supabase
                .from(table)
                .update({ price: numPrice })
                .ilike('category', category)
                .select('id');

            if (error) {
                console.warn('Supabase update category price warning:', error);
            }

            // 2. If it's tests and no rows existed in Supabase for this category,
            // seed the default chapter tests into Supabase with the updated price!
            if (table === 'tests' && (!updatedRows || updatedRows.length === 0)) {
                const testsToSeed = defaultChapterTests
                    .filter((dt) => dt.category.trim().toLowerCase() === category.trim().toLowerCase())
                    .map((dt) => ({
                        title: dt.title,
                        description: dt.description || '',
                        category: dt.category,
                        duration_minutes: dt.duration_minutes || 30,
                        total_marks: dt.total_marks || 50,
                        reward_points: dt.reward_points || 50,
                        questions: dt.questions || [],
                        is_active: true,
                        price: numPrice,
                    }));

                if (testsToSeed.length > 0) {
                    const { error: seedErr } = await supabase
                        .from('tests')
                        .insert(testsToSeed);
                    if (seedErr) {
                        console.warn('Could not seed tests to Supabase:', seedErr);
                    }
                }
            }

            // 3. Save to localStorage for instant client fallback
            try {
                const storageKey = `rc_folder_prices_${type}`;
                const storedPrices = JSON.parse(localStorage.getItem(storageKey) || '{}');
                storedPrices[category] = numPrice;
                storedPrices[category.trim()] = numPrice;
                localStorage.setItem(storageKey, JSON.stringify(storedPrices));
            } catch (err) {
                console.error(err);
            }

            return { category, type, price: numPrice };
        },
        onSuccess: ({ category, type, price }) => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            queryClient.invalidateQueries({ queryKey: ['public-tests'] });
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            queryClient.invalidateQueries({ queryKey: ['public-notes'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({ title: price === 0 ? 'Folder is now FREE!' : `Folder price set to ₹${price}` });
        },
        onError: (error) => {
            toast({ title: 'Failed to update folder price', description: error.message, variant: 'destructive' });
        },
    });
};

export const useHasCourses = () => {
    return useQuery({
        queryKey: ['has-courses-count'],
        queryFn: async () => {
            try {
                const { count, error } = await supabase
                    .from('courses')
                    .select('*', { count: 'exact', head: true });
                if (error) return false;
                return Boolean(count && count > 0);
            } catch (err) {
                return false;
            }
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

