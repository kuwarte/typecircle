-- Add role column to group_memberships: 'member' or 'admin'
ALTER TABLE public.group_memberships
ADD COLUMN IF NOT EXISTS role text DEFAULT 'member';

-- Set role to admin for group creators
UPDATE public.group_memberships gm
SET role = 'admin'
FROM public.groups g
WHERE gm.group_id = g.id AND gm.user_id = g.created_by;

-- Ensure column not null (safe after defaults and update)
ALTER TABLE public.group_memberships
ALTER COLUMN role SET NOT NULL;
