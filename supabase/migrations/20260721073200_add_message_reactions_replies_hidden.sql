-- Add message reactions, reply support, and per-user hidden deletes for chat

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES public.messages(id) ON DELETE SET NULL;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE TABLE IF NOT EXISTS public.message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS public.message_hidden (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (message_id, user_id)
);

alter table public.message_reactions enable row level security;
alter table public.message_hidden enable row level security;

-- Update message select policy to hide deleted and hidden messages
DROP POLICY IF EXISTS "Participants can view messages in their conversations" ON public.messages;

CREATE POLICY "Participants can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
    )
    and deleted_at is null
    and not exists (
      select 1 from public.message_hidden mh
      where mh.message_id = messages.id
      and mh.user_id = auth.uid()
    )
  );

drop policy if exists "Participants can send messages in their conversations" on public.messages;

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

create policy "Users can update their own messages" on public.messages for update
  using (auth.uid() = sender_id)
  with check (auth.uid() = sender_id);

create policy "Participants can view reactions" on public.message_reactions for select
  using (
    exists (
      select 1 from public.conversation_participants cp
      join public.messages m on m.conversation_id = cp.conversation_id
      where cp.user_id = auth.uid()
      and m.id = public.message_reactions.message_id
    )
  );

create policy "Users can add reactions" on public.message_reactions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.conversation_participants cp
      join public.messages m on m.conversation_id = cp.conversation_id
      where cp.user_id = auth.uid()
      and m.id = public.message_reactions.message_id
    )
  );

create policy "Users can remove their own reactions" on public.message_reactions for delete
  using (auth.uid() = user_id);

create policy "Users can hide messages for themselves" on public.message_hidden for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.conversation_participants cp
      join public.messages m on m.conversation_id = cp.conversation_id
      where cp.user_id = auth.uid()
      and m.id = public.message_hidden.message_id
    )
  );

create policy "Users can view their hidden messages" on public.message_hidden for select
  using (auth.uid() = user_id);

alter publication supabase_realtime add table public.message_reactions;
