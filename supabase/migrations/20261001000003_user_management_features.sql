-- Migration: 20261001000003_user_management_features.sql
-- Description: Adds is_blocked column to profiles, RLS policies for admin profile management,
-- and secure RPC functions for deleting and blocking/unblocking users.

-- 1. Add is_blocked column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_is_blocked ON public.profiles(is_blocked);

-- 2. Admin policies for profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Admins can update any profile'
  ) THEN
    CREATE POLICY "Admins can update any profile"
    ON public.profiles
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Admins can delete any profile'
  ) THEN
    CREATE POLICY "Admins can delete any profile"
    ON public.profiles
    FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 3. Secure RPC to toggle block status of a user
CREATE OR REPLACE FUNCTION public.admin_toggle_block_user(
  target_user_id UUID,
  block_status BOOLEAN
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can block or unblock users';
  END IF;

  -- Cannot block yourself
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot block your own admin account';
  END IF;

  -- Cannot block another admin
  IF public.has_role(target_user_id, 'admin') THEN
    RAISE EXCEPTION 'Admin accounts cannot be blocked';
  END IF;

  UPDATE public.profiles
  SET is_blocked = block_status,
      updated_at = now()
  WHERE user_id = target_user_id;

  RETURN true;
END;
$$;

-- 4. Secure RPC to permanently delete a user and their related records
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  target_user_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;

  -- Cannot delete yourself
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own admin account';
  END IF;

  -- Cannot delete another admin
  IF public.has_role(target_user_id, 'admin') THEN
    RAISE EXCEPTION 'Admin accounts cannot be deleted';
  END IF;

  -- Clean up user data from app tables
  DELETE FROM public.purchases WHERE user_id = target_user_id;
  DELETE FROM public.category_purchases WHERE user_id = target_user_id;
  DELETE FROM public.test_results WHERE user_id = target_user_id;
  DELETE FROM public.user_courses WHERE user_id = target_user_id;
  DELETE FROM public.user_badges WHERE user_id = target_user_id;
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE user_id = target_user_id;

  -- Delete from auth.users (cascades any remaining auth records)
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN true;
END;
$$;

-- 5. Secure RPC to fetch users with email, role, and block status
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  role TEXT,
  is_blocked BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can access user lists';
  END IF;

  RETURN QUERY
  SELECT 
    p.user_id AS id,
    COALESCE(u.email, '')::TEXT AS email,
    COALESCE(p.username, split_part(u.email, '@', 1), 'User')::TEXT AS username,
    COALESCE(p.avatar_url, '')::TEXT AS avatar_url,
    p.created_at,
    r.role::TEXT AS role,
    COALESCE(p.is_blocked, false) AS is_blocked
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.user_id
  LEFT JOIN public.user_roles r ON r.user_id = p.user_id
  ORDER BY 
    CASE WHEN r.role = 'admin' THEN 0 ELSE 1 END,
    p.created_at DESC;
END;
$$;
