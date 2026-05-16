-- 1. Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user'  -- default role
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. RLS Policies
-- Enable RLS
alter table stories enable row level security;
alter table quizzes enable row level security;
alter table user_progress enable row level security;
alter table profiles enable row level security;

-- Stories: public read published, admin full access
create policy "Public can read published stories"
  on stories for select
  using (status = 'published');

create policy "Admin full access to stories"
  on stories for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Profiles: users read own, admin read all
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Admin can read all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- User progress: users manage own
create policy "Users manage own progress"
  on user_progress for all
  using (auth.uid() = user_id);

create policy "Admin read all progress"
  on user_progress for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Note: To set an admin manually:
-- update profiles set role = 'admin' where id = '<your-user-uuid>';
