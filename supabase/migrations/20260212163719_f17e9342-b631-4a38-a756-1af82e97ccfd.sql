
-- Drop existing table if it exists (it only has id + created_at, no real data)
DROP TABLE IF EXISTS public.etudes_energetiques;

-- Create table with full schema
CREATE TABLE public.etudes_energetiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT,
  pdf_path TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.etudes_energetiques ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can select their own studies"
  ON public.etudes_energetiques FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own studies"
  ON public.etudes_energetiques FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own studies"
  ON public.etudes_energetiques FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own studies"
  ON public.etudes_energetiques FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create private storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
  VALUES ('pdfs', 'pdfs', false)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can only access their own folder
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own PDFs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own PDFs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PDFs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
