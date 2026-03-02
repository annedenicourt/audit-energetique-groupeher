CREATE POLICY "Admins can update all studies"
ON public.etudes_energetiques
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.id = auth.uid() AND p.role = 'admin'::user_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.id = auth.uid() AND p.role = 'admin'::user_role
));