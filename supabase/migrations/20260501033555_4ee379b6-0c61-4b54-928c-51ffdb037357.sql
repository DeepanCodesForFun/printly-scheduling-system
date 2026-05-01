
-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('student', 'staff');

-- 2. profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  student_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. user_roles policies (use has_role)
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Staff can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- 6. Auto-create profile + assign student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, student_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'student_id'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Add user_id to print_orders (nullable for backward compat)
ALTER TABLE public.print_orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 8. Replace permissive print_orders policies
DROP POLICY IF EXISTS "Anyone can view print orders" ON public.print_orders;
DROP POLICY IF EXISTS "Anyone can create print orders" ON public.print_orders;
DROP POLICY IF EXISTS "Anyone can update print orders" ON public.print_orders;
DROP POLICY IF EXISTS "Anyone can delete print orders" ON public.print_orders;

CREATE POLICY "Students can view own orders"
  ON public.print_orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all orders"
  ON public.print_orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Students can create own orders"
  ON public.print_orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own orders"
  ON public.print_orders FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can update any order"
  ON public.print_orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Students can delete own orders"
  ON public.print_orders FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can delete any order"
  ON public.print_orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- 9. Replace permissive storage policies on print_files
DROP POLICY IF EXISTS "Anyone can view print files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload print files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update print files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete print files" ON storage.objects;

CREATE POLICY "Students can view own print files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'print_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Staff can view all print files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'print_files' AND public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Students can upload own print files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'print_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can delete own print files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'print_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Staff can delete any print file"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'print_files' AND public.has_role(auth.uid(), 'staff'));

-- 10. Make print_files bucket private (signed URLs only)
UPDATE storage.buckets SET public = false WHERE id = 'print_files';
