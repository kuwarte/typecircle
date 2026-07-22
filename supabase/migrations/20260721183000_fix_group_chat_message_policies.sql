-- Keep group chat permissions aligned with the group-aware conversation helper.

create or replace function public.is_conversation_participant(conv_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conv_id
    and cp.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.conversations c
    join public.group_memberships gm
      on gm.group_id = (substring(c.name from '^group:([0-9a-fA-F-]{36})$'))::uuid
    where c.id = conv_id
    and c.is_group = true
    and gm.user_id = auth.uid()
  );
$$;

drop policy if exists "Participants can view messages in their conversations" on public.messages;
drop policy if exists "Participants can send messages in their conversations" on public.messages;
drop policy if exists "Participants can view reactions" on public.message_reactions;
drop policy if exists "Users can add reactions" on public.message_reactions;
drop policy if exists "Users can hide messages for themselves" on public.message_hidden;

create policy "Participants can view messages in their conversations"
  on public.messages for select
  using (
    public.is_conversation_participant(conversation_id)
    and deleted_at is null
    and not exists (
      select 1 from public.message_hidden mh
      where mh.message_id = messages.id
      and mh.user_id = auth.uid()
    )
  );

create policy "Participants can send messages in their conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and public.is_conversation_participant(conversation_id)
  );

create policy "Participants can view reactions"
  on public.message_reactions for select
  using (
    exists (
      select 1 from public.messages m
      where m.id = public.message_reactions.message_id
      and public.is_conversation_participant(m.conversation_id)
    )
  );

create policy "Users can add reactions"
  on public.message_reactions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.messages m
      where m.id = public.message_reactions.message_id
      and public.is_conversation_participant(m.conversation_id)
    )
  );

create policy "Users can hide messages for themselves"
  on public.message_hidden for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.messages m
      where m.id = public.message_hidden.message_id
      and public.is_conversation_participant(m.conversation_id)
    )
  );
