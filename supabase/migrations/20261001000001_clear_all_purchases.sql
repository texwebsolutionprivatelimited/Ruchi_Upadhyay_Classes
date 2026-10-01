-- Migration: Clear All Existing Purchase & Enrollment Data Everywhere
-- Truncates purchases, category_purchases, and user_courses tables
-- and provides an administrative RPC function.

-- 1. Truncate existing purchase and enrollment records
TRUNCATE TABLE public.purchases CASCADE;
TRUNCATE TABLE public.category_purchases CASCADE;
TRUNCATE TABLE public.user_courses CASCADE;

-- Also clean up purchase related notifications if needed
DELETE FROM public.notifications 
WHERE title ILIKE '%enrolled%' 
   OR title ILIKE '%purchase%' 
   OR title ILIKE '%unlocked%';

-- 2. Create security definer RPC function for Admin to clear all purchases anytime
CREATE OR REPLACE FUNCTION public.clear_all_purchase_history()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate executing user has admin role
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  ) THEN
    RAISE EXCEPTION 'Access denied: Only administrators can clear purchase records';
  END IF;

  -- Delete all records
  DELETE FROM public.purchases;
  DELETE FROM public.category_purchases;
  DELETE FROM public.user_courses;
  
  DELETE FROM public.notifications 
  WHERE title ILIKE '%enrolled%' 
     OR title ILIKE '%purchase%' 
     OR title ILIKE '%unlocked%';

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.clear_all_purchase_history() TO authenticated;
