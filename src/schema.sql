-- SQL Schema for Gym Website & Admin Dashboard
-- Run these queries inside your Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Holds user roles)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on row level security
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are readable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. SETTINGS TABLE
create table public.settings (
  id text primary key default 'settings_main',
  gym_name text not null,
  logo text not null,
  phone text not null,
  whatsapp_number text not null,
  email text not null,
  address text not null,
  opening_hours text not null,
  facebook_link text,
  instagram_link text,
  google_map_url text,
  hero_title text not null,
  hero_subtitle text not null,
  main_cta_text text not null
);

alter table public.settings enable row level security;

create policy "Settings readable by everyone"
  on public.settings for select
  using (true);

create policy "Only admin can update settings"
  on public.settings for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 3. PACKAGES TABLE
create table public.packages (
  id text primary key default concat('pkg_', replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  price numeric not null,
  duration_days integer not null,
  description text,
  features text[] default '{}'::text[] not null,
  is_popular boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.packages enable row level security;

create policy "Packages readable by everyone"
  on public.packages for select
  using (true);

create policy "Only admin can manage packages"
  on public.packages for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 4. TRAINERS TABLE
create table public.trainers (
  id text primary key default concat('trn_', replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  photo_url text not null,
  cloudinary_public_id text,
  specialty text not null,
  experience text not null,
  bio text,
  available_time text not null,
  phone text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trainers enable row level security;

create policy "Trainers readable by everyone"
  on public.trainers for select
  using (true);

create policy "Only admin can manage trainers"
  on public.trainers for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 5. CLASSES TABLE
create table public.classes (
  id text primary key default concat('cls_', replace(gen_random_uuid()::text, '-', '')),
  class_name text not null,
  trainer_id text references public.trainers(id) on delete set null,
  day_of_week text not null,
  start_time text not null,
  end_time text not null,
  batch_type text not null,
  capacity integer not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.classes enable row level security;

create policy "Classes readable by everyone"
  on public.classes for select
  using (true);

create policy "Only admin can manage classes"
  on public.classes for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 6. MEMBERS TABLE
create table public.members (
  id text primary key default concat('mem_', replace(gen_random_uuid()::text, '-', '')),
  full_name text not null,
  phone text not null,
  age integer not null,
  gender text not null,
  address text not null,
  fitness_goal text,
  package_id text references public.packages(id) on delete set null,
  membership_start date not null,
  membership_end date not null,
  payment_status text not null,
  member_status text not null,
  emergency_contact text not null,
  medical_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.members enable row level security;

create policy "Only admin can view/manage members"
  on public.members for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 7. LEADS TABLE
create table public.leads (
  id text primary key default concat('led_', replace(gen_random_uuid()::text, '-', '')),
  full_name text not null,
  phone text not null,
  age integer not null,
  gender text not null,
  address text not null,
  fitness_goal text not null,
  interested_package text not null,
  preferred_time text not null,
  medical_note text,
  emergency_contact text not null,
  status text not null default 'new',
  admin_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.leads enable row level security;

-- Leads policy: Public can insert, Admin can do all
create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

create policy "Only admins can view/manage leads"
  on public.leads for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 8. PAYMENTS TABLE
create table public.payments (
  id text primary key default concat('pay_', replace(gen_random_uuid()::text, '-', '')),
  member_id text references public.members(id) on delete cascade not null,
  amount numeric not null,
  payment_method text not null,
  transaction_id text,
  payment_status text not null,
  payment_date date not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

create policy "Only admins can view/manage payments"
  on public.payments for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 9. GALLERY TABLE
create table public.gallery (
  id text primary key default concat('gal_', replace(gen_random_uuid()::text, '-', '')),
  title text not null,
  category text not null,
  image_url text not null,
  cloudinary_public_id text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gallery enable row level security;

create policy "Gallery readable by everyone"
  on public.gallery for select
  using (true);

create policy "Only admins can manage gallery"
  on public.gallery for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- 10. TESTIMONIALS TABLE
create table public.testimonials (
  id text primary key default concat('tst_', replace(gen_random_uuid()::text, '-', '')),
  member_name text not null,
  photo_url text,
  before_image_url text,
  after_image_url text,
  story text not null,
  result_summary text not null,
  rating integer not null default 5,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.testimonials enable row level security;

create policy "Testimonials readable by everyone"
  on public.testimonials for select
  using (true);

create policy "Only admins can manage testimonials"
  on public.testimonials for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Trigger for profile table creation on user sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'member');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
