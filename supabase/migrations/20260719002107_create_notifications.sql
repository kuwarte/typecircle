-- supabase/migrations/20260719000006_create_notifications.sql

create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null,
  metadata    jsonb not null default '{}',
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can mark their own notifications as read"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Enable Realtime so notification bells update instantly
alter publication supabase_realtime add table public.notifications;