-- ==============================================================================
-- Migration: 20261001000002_harden_purchase_security.sql
-- Description: Hardens purchase security against client-side tampering, console
-- injection, and unauthorized status modifications.
-- ==============================================================================

-- 1. Disallow students from updating existing purchase records
-- Purchases must be immutable financial records.
DROP POLICY IF EXISTS "Users can update their own purchases" ON public.purchases;

-- 2. Disallow regular users from deleting purchases
DROP POLICY IF EXISTS "Users can delete their own purchases" ON public.purchases;

-- 3. Ensure admins can manage (view, insert, update, delete) if needed
DROP POLICY IF EXISTS "Admins can manage all purchases" ON public.purchases;
CREATE POLICY "Admins can manage all purchases"
ON public.purchases
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'ruchiclasses24@gmail.com'
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'ruchiclasses24@gmail.com'
);

-- 4. Disallow students from updating or deleting category_purchases
DROP POLICY IF EXISTS "Users can update their own category purchases" ON public.category_purchases;
DROP POLICY IF EXISTS "Users can delete their own category purchases" ON public.category_purchases;

-- 5. Validation trigger on purchases:
-- If course_id is provided and the course has price > 0,
-- disallow inserting amount = 0 unless authorized or free course.
CREATE OR REPLACE FUNCTION public.validate_purchase_record()
RETURNS TRIGGER AS $$
DECLARE
  v_course_price NUMERIC;
BEGIN
  -- If user is admin, allow any purchase record
  IF public.has_role(NEW.user_id, 'admin') OR
     (SELECT email FROM auth.users WHERE id = NEW.user_id) = 'ruchiclasses24@gmail.com' THEN
    RETURN NEW;
  END IF;

  -- Validate course purchases
  IF NEW.course_id IS NOT NULL THEN
    SELECT price INTO v_course_price FROM public.courses WHERE id = NEW.course_id;
    IF FOUND AND v_course_price > 0 AND NEW.amount <= 0 AND (NEW.points_discount IS NULL OR NEW.points_discount < v_course_price) THEN
      RAISE EXCEPTION 'Invalid purchase: Paid course cannot be purchased for 0 without points discount.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_validate_purchase_record ON public.purchases;
CREATE TRIGGER trg_validate_purchase_record
BEFORE INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.validate_purchase_record();
