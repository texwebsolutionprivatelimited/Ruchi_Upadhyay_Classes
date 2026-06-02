-- Add file_url column to notes table for PDF storage
ALTER TABLE public.notes 
ADD COLUMN file_url TEXT;

-- Create storage bucket for note files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('notes', 'notes', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for notes bucket
CREATE POLICY "Admins can upload note files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'notes' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Anyone can view note files"
ON storage.objects FOR SELECT
USING (bucket_id = 'notes');

CREATE POLICY "Admins can delete note files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'notes' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update note files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'notes' AND 
  has_role(auth.uid(), 'admin'::app_role)
);