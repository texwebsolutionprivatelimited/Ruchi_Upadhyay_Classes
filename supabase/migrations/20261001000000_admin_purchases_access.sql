-- Migration: Allow Admins to View and Manage All Purchases & Orders
-- Adds Admin policies for purchases and category_purchases, plus an RPC overview function.

-- 1. Purchases table: Allow admins to view all purchases
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins can view all purchases" ON public.purchases;
    DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
    
    CREATE POLICY "Users and admins can view purchases"
    ON public.purchases
    FOR SELECT
    USING (
        auth.uid() = user_id OR 
        public.has_role(auth.uid(), 'admin'::app_role)
    );
END $$;

-- 2. Category purchases table: Allow admins to view all category purchases
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins can view all category purchases" ON public.category_purchases;
    DROP POLICY IF EXISTS "Users can view their own category purchases" ON public.category_purchases;
    
    CREATE POLICY "Users and admins can view category purchases"
    ON public.category_purchases
    FOR SELECT
    USING (
        auth.uid() = user_id OR 
        public.has_role(auth.uid(), 'admin'::app_role)
    );
END $$;

-- 3. Secure RPC function for Admin to retrieve all purchases aggregated
CREATE OR REPLACE FUNCTION public.get_admin_all_purchases()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Check if user is admin
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;

    SELECT jsonb_build_object(
        'purchases', COALESCE(
            (SELECT jsonb_agg(
                jsonb_build_object(
                    'id', p.id,
                    'user_id', p.user_id,
                    'username', pr.username,
                    'avatar_url', pr.avatar_url,
                    'course_id', p.course_id,
                    'course_title', c.title,
                    'note_id', p.note_id,
                    'note_title', n.title,
                    'test_id', p.test_id,
                    'test_title', t.title,
                    'amount', p.amount,
                    'order_id', p.order_id,
                    'payment_id', p.payment_id,
                    'status', p.status,
                    'created_at', p.created_at,
                    'paid_at', p.paid_at
                ) ORDER BY p.created_at DESC
            ) FROM purchases p
            LEFT JOIN profiles pr ON pr.user_id = p.user_id
            LEFT JOIN courses c ON c.id = p.course_id
            LEFT JOIN notes n ON n.id = p.note_id
            LEFT JOIN tests t ON t.id = p.test_id
            ), '[]'::jsonb
        ),
        'category_purchases', COALESCE(
            (SELECT jsonb_agg(
                jsonb_build_object(
                    'id', cp.id,
                    'user_id', cp.user_id,
                    'username', pr.username,
                    'avatar_url', pr.avatar_url,
                    'category', cp.category,
                    'content_type', cp.content_type,
                    'amount', cp.amount,
                    'order_id', cp.order_id,
                    'payment_id', cp.payment_id,
                    'status', cp.status,
                    'created_at', cp.created_at
                ) ORDER BY cp.created_at DESC
            ) FROM category_purchases cp
            LEFT JOIN profiles pr ON pr.user_id = cp.user_id
            ), '[]'::jsonb
        )
    ) INTO result;

    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_all_purchases() TO authenticated;
