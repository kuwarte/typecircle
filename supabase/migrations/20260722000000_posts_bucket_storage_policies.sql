-- supabase/migrations/20260722000000_posts_bucket_storage_policies.sql

insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;

create policy "Public can view post images"
on storage.objects for select
using (bucket_id = 'posts');

create policy "Authenticated users can upload post images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'posts');

create policy "Users can update their own post images"
on storage.objects for update
to authenticated
using (bucket_id = 'posts' and owner = auth.uid());

create policy "Users can delete their own post images"
on storage.objects for delete
to authenticated
using (bucket_id = 'posts' and owner = auth.uid());