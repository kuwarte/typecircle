-- supabase/migrations/20260719000003_create_posts.sql

create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  type_tag    int references public.enneagram_types(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);

create table public.reactions (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  emoji       text not null,
  created_at  timestamptz not null default now(),
  unique (post_id, user_id, emoji)
);

alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;

create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Users can create their own posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "Users can update their own posts" on public.posts for update using (auth.uid() = author_id);
create policy "Users can delete their own posts" on public.posts for delete using (auth.uid() = author_id);

create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Users can create their own comments" on public.comments for insert with check (auth.uid() = author_id);
create policy "Users can delete their own comments" on public.comments for delete using (auth.uid() = author_id);

create policy "Reactions are viewable by everyone" on public.reactions for select using (true);
create policy "Users can create their own reactions" on public.reactions for insert with check (auth.uid() = user_id);
create policy "Users can delete their own reactions" on public.reactions for delete using (auth.uid() = user_id);