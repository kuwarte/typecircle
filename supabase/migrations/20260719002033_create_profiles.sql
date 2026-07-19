-- supabase/migrations/20260719000002_create_profiles.sql

create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  username            text unique,
  full_name           text,
  avatar_url          text,
  bio                 text,
  primary_type        int references public.enneagram_types(id),
  wing                int references public.enneagram_types(id),
  dominant_instinct   text check (dominant_instinct in ('sp', 'so', 'sx')),
  instinct_stack      text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up via OAuth (Google/GitHub)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();