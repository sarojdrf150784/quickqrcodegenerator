
CREATE TABLE public.qr_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_type TEXT NOT NULL,
  template_data JSONB NOT NULL,
  qr_value TEXT NOT NULL,
  fg_color TEXT NOT NULL DEFAULT '#000000',
  bg_color TEXT NOT NULL DEFAULT '#FFFFFF',
  size INTEGER NOT NULL DEFAULT 256,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own QR codes" ON public.qr_codes
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QR codes" ON public.qr_codes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own QR codes" ON public.qr_codes
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
