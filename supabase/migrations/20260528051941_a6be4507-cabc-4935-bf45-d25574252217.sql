
CREATE TABLE public.qr_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.qr_folders TO authenticated;
GRANT ALL ON public.qr_folders TO service_role;

ALTER TABLE public.qr_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own folders" ON public.qr_folders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own folders" ON public.qr_folders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own folders" ON public.qr_folders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own folders" ON public.qr_folders FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.qr_codes
  ADD COLUMN folder_id UUID REFERENCES public.qr_folders(id) ON DELETE SET NULL,
  ADD COLUMN logo_data_url TEXT;

CREATE POLICY "Users update own QR codes" ON public.qr_codes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
