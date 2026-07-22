-- Add optional image_url to posts
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS image_url text;
