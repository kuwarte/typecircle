-- supabase/migrations/20260719000004_create_groups.sql

create table public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  topic       text,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table public.group_memberships (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.groups(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  unique (group_id, user_id)
);

alter table public.groups enable row level security;
alter table public.group_memberships enable row level security;

create policy "Groups are viewable by everyone" on public.groups for select using (true);
create policy "Authenticated users can create groups" on public.groups for insert with check (auth.uid() = created_by);

create policy "Memberships are viewable by everyone" on public.group_memberships for select using (true);
create policy "Users can join groups themselves" on public.group_memberships for insert with check (auth.uid() = user_id);
create policy "Users can leave groups themselves" on public.group_memberships for delete using (auth.uid() = user_id);