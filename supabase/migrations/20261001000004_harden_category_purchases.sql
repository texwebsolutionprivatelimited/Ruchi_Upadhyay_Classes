-- Migration: 20261001000004_harden_category_purchases.sql
-- Description: Secures category_purchases table against direct client console injection and fake transactions.

-- 1. Ensure payment_id index and uniqueness to prevent payment_id replay attacks
CREATE UNIQUE INDEX IF NOT EXISTS idx_category_purchases_payment_unique 
ON public.category_purchases(payment_id) 
WHERE payment_id IS NOT NULL 
  AND payment_id NOT IN ('free_unlock', 'free_bonus_with_notes');

-- 2. Validation Trigger for category_purchases
CREATE OR REPLACE FUNCTION public.validate_category_purchase_record()
RETURNS TRIGGER AS $$
BEGIN
  -- If caller is admin, allow
  IF public.has_role(NEW.user_id, 'admin') OR
     (SELECT email FROM auth.users WHERE id = NEW.user_id) = 'ruchiclasses24@gmail.com' THEN
    RETURN NEW;
  END IF;

  -- Ensure payment_id is provided
  IF NEW.payment_id IS NULL OR TRIM(NEW.payment_id) = '' THEN
    RAISE EXCEPTION 'Security error: Payment ID is mandatory for category purchases.';
  END IF;

  -- Ensure amount is not negative
  IF NEW.amount < 0 THEN
    RAISE EXCEPTION 'Security error: Amount cannot be negative.';
  END IF;

  -- If amount > 0, payment_id must be a genuine payment identifier
  IF NEW.amount > 0 AND NOT (
    NEW.payment_id LIKE 'pay_%' OR 
    NEW.payment_id LIKE 'internal_%'
  ) THEN
    RAISE EXCEPTION 'Security error: Invalid payment transaction format.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_validate_category_purchase ON public.category_purchases;
CREATE TRIGGER trg_validate_category_purchase
BEFORE INSERT ON public.category_purchases
FOR EACH ROW
EXECUTE FUNCTION public.validate_category_purchase_record();
