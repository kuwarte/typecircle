-- supabase/migrations/20260719000005_create_messaging.sql

create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  is_group    boolean not null default false,
  name        text,
  created_at  timestamptz not null default now()
);

create table public.conversation_participants (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  joined_at        timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create table public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_id        uuid not null references public.profiles(id) on delete cascade,
  content          text not null,
  created_at       timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

-- Only participants can see/interact with a conversation
create policy "Participants can view their conversations"
  on public.conversations for select
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = id and cp.user_id = auth.uid()
    )
  );

create policy "Participants can view participant lists"
  on public.conversation_participants for select
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversation_participants.conversation_id
      and cp.user_id = auth.uid()
    )
  );

create policy "Users can add themselves to a conversation"
  on public.conversation_participants for insert
  with check (auth.uid() = user_id);

create policy "Participants can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
    )
  );

create policy "Participants can send messages in their conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
    )
  );

-- Enable Realtime on messages so new messages push to clients instantly
alter publication supabase_realtime add table public.messages;