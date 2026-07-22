-- Enhance conversation participant check to include group membership
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
	)
	or exists (
		select 1 from conversations c
		join group_memberships gm on gm.group_id = (split_part(c.name, ':', 2))::uuid
		where c.id = conv_id and c.is_group = true and gm.user_id = auth.uid()
	);
$$;

-- Recreate conversation/message policies to rely on the updated helper
drop policy if exists "Participants can view their conversations" on public.conversations;
drop policy if exists "Participants can view participant lists" on public.conversation_participants;
drop policy if exists "Participants can view messages in their conversations" on public.messages;
drop policy if exists "Participants can send messages in their conversations" on public.messages;

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

-- Ensure authenticated users can create group conversations (if migration run earlier didn't)
drop policy if exists "Authenticated users can create conversations" on public.conversations;
create policy "Authenticated users can create conversations"
	on public.conversations for insert
	with check (true);

