-- Add group_id to posts so posts can be scoped to circles
alter table public.posts
	add column if not exists group_id uuid references public.groups(id) on delete cascade;

-- Update RLS for posts to restrict visibility to group members
drop policy if exists "Posts are viewable by everyone" on public.posts;
drop policy if exists "Users can create their own posts" on public.posts;
drop policy if exists "Users can update their own posts" on public.posts;
drop policy if exists "Users can delete their own posts" on public.posts;

create policy "Group members can view posts"
	on public.posts for select
	using (
		group_id is null
		or exists (
			select 1 from public.group_memberships gm
			where gm.group_id = public.posts.group_id
			and gm.user_id = auth.uid()
		)
	);

create policy "Users can create their own posts"
	on public.posts for insert
	with check (
		auth.uid() = author_id
		and (
			group_id is null
			or exists (
				select 1 from public.group_memberships gm
				where gm.group_id = public.posts.group_id
				and gm.user_id = auth.uid()
			)
		)
	);

create policy "Users can update their own posts"
	on public.posts for update
	using (auth.uid() = author_id);

create policy "Users can delete their own posts"
	on public.posts for delete
	using (auth.uid() = author_id);

