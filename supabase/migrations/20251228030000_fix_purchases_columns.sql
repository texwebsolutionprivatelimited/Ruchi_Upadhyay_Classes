-- Ensure individual purchase columns exist in purchases table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchases' AND column_name = 'note_id') THEN
        ALTER TABLE public.purchases ADD COLUMN note_id uuid REFERENCES public.notes(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchases' AND column_name = 'test_id') THEN
        ALTER TABLE public.purchases ADD COLUMN test_id uuid REFERENCES public.tests(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_purchases_user_note') THEN
        CREATE INDEX idx_purchases_user_note ON public.purchases(user_id, note_id) WHERE note_id IS NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_purchases_user_test') THEN
        CREATE INDEX idx_purchases_user_test ON public.purchases(user_id, test_id) WHERE test_id IS NOT NULL;
    END IF;
END $$;
