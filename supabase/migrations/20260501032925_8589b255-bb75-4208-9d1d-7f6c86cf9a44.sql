
-- Create print_orders table
CREATE TABLE public.print_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT false,
  additional_details TEXT,
  config_color TEXT NOT NULL DEFAULT 'bw',
  config_sides TEXT NOT NULL DEFAULT 'single',
  config_copies INTEGER NOT NULL DEFAULT 1,
  files JSONB NOT NULL DEFAULT '[]'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.print_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view print orders" ON public.print_orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create print orders" ON public.print_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update print orders" ON public.print_orders FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete print orders" ON public.print_orders FOR DELETE USING (true);

-- Update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_print_orders_updated_at
BEFORE UPDATE ON public.print_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER TABLE public.print_orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.print_orders;

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('print_files', 'print_files', true);

CREATE POLICY "Anyone can view print files" ON storage.objects FOR SELECT USING (bucket_id = 'print_files');
CREATE POLICY "Anyone can upload print files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'print_files');
CREATE POLICY "Anyone can update print files" ON storage.objects FOR UPDATE USING (bucket_id = 'print_files');
CREATE POLICY "Anyone can delete print files" ON storage.objects FOR DELETE USING (bucket_id = 'print_files');
