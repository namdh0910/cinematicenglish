-- STORIES TABLE
create table stories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  synopsis text,
  transcript text,
  category text check (category in ('Psychology','Business','Philosophy','Cinema','Power & Influence','Creative')),
  difficulty text check (difficulty in ('Beginner','Intermediate','Advanced')),
  duration text, -- '12:45'
  thumbnail_url text,
  audio_url text,
  xp_value int default 250,
  is_premium boolean default false,
  is_featured boolean default false,
  status text check (status in ('Draft','Published','Archived')) default 'Draft',
  plays int default 0,
  tags text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- QUIZZES TABLE
create table quizzes (
  id uuid default gen_random_uuid() primary key,
  story_id uuid references stories(id) on delete cascade,
  questions jsonb not null default '[]',
  created_at timestamptz default now()
);

-- USER PROGRESS TABLE
create table user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  story_id uuid references stories(id),
  completed boolean default false,
  quiz_score int,
  xp_earned int default 0,
  listened_at timestamptz default now()
);

-- USER PROFILES (EXTENDS AUTH.USERS)
create table profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  email text,
  avatar_url text,
  plan text check (plan in ('Free','Pro','Group')) default 'Free',
  total_xp int default 0,
  current_streak int default 0,
  role text check (role in ('user','admin')) default 'user',
  last_active timestamptz default now(),
  created_at timestamptz default now()
);

-- ENABLE RLS (Row Level Security)
alter table stories enable row level security;
alter table quizzes enable row level security;
alter table user_progress enable row level security;
alter table profiles enable row level security;

-- ADMIN POLICIES
create or replace function public.is_admin()
returns boolean as $$
begin
  return (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );
end;
$$ language plpgsql security definer;

create policy "Admins can do anything" on stories for all to authenticated using (
  is_admin()
);
-- ... add more policies as needed
