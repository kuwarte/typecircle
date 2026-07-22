-- Enforce one feed reaction per user per post.

with ranked_reactions as (
  select
    id,
    row_number() over (
      partition by post_id, user_id
      order by created_at desc, id desc
    ) as reaction_rank
  from public.reactions
)
delete from public.reactions
where id in (
  select id
  from ranked_reactions
  where reaction_rank > 1
);

alter table public.reactions
  drop constraint if exists reactions_post_id_user_id_emoji_key;

create unique index if not exists reactions_post_id_user_id_key
  on public.reactions (post_id, user_id);

create policy "Users can update their own reactions"
  on public.reactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
