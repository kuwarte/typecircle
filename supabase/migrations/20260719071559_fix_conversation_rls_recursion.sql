-- New migration: fix_conversation_rls_recursion.sql

-- Helper function: checks membership without triggering RLS recursion
create or replace function public.is_conversation_participant(conv_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from conversation_participants
    where conversation_id = conv_id
    and user_id = auth.uid()
  );
$$;

-- Drop the old recursive policies
drop policy if exists "Participants can view their conversations" on public.conversations;
drop policy if exists "Participants can view participant lists" on public.conversation_participants;
drop policy if exists "Participants can view messages in their conversations" on public.messages;
drop policy if exists "Participants can send messages in their conversations" on public.messages;

-- Recreate using the safe helper function instead of a direct subquery
create policy "Participants can view their conversations"
  on public.conversations for select
  using (public.is_conversation_participant(id));

create policy "Participants can view participant lists"
  on public.conversation_participants for select
  using (public.is_conversation_participant(conversation_id));

create policy "Participants can view messages in their conversations"
  on public.messages for select
  using (public.is_conversation_participant(conversation_id));

create policy "Participants can send messages in their conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and public.is_conversation_participant(conversation_id)
  );

-- Also missing: an INSERT policy for conversations itself (needed for creating new group chats)
create policy "Authenticated users can create conversations"
  on public.conversations for insert
  with check (true);

drop policy if exists "Users can add themselves to a conversation" on public.conversation_participants;

create policy "Users can add themselves to a conversation"
  on public.conversation_participants for insert
  with check (auth.uid() = user_id);