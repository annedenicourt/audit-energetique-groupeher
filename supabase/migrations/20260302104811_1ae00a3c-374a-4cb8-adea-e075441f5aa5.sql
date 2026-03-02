
-- Enable moddatetime extension
CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;

-- Add updated_at to etudes_energetiques
ALTER TABLE public.etudes_energetiques
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add updated_at to dossiers
ALTER TABLE public.dossiers
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Trigger for etudes_energetiques
CREATE TRIGGER set_updated_at_etudes
  BEFORE UPDATE ON public.etudes_energetiques
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');

-- Trigger for dossiers
CREATE TRIGGER set_updated_at_dossiers
  BEFORE UPDATE ON public.dossiers
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');
