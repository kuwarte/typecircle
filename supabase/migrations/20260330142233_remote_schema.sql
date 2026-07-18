-- Table: chat_room
CREATE TABLE IF NOT EXISTS chat_room (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying NOT NULL,
  is_public boolean NOT NULL,
  tags ARRAY
);

-- Table: chat_room_member
CREATE TABLE IF NOT EXISTS chat_room_member (
  member_id uuid NOT NULL,
  chat_room_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: message
CREATE TABLE IF NOT EXISTS message (
  reply_to uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  text text NOT NULL,
  chat_room_id uuid NOT NULL,
  author_id uuid NOT NULL,
  author_name text,
  author_image_url text
);

-- Table: message_reactions
CREATE TABLE IF NOT EXISTS message_reactions (
  user_id uuid NOT NULL,
  message_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  emoji text NOT NULL
);

-- Table: user_profile
CREATE TABLE IF NOT EXISTS user_profile (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying NOT NULL,
  image_url character varying,
  enneagram_type integer,
  id uuid NOT NULL DEFAULT gen_random_uuid()
);

-- Index: chat_room_member_pkey
CREATE UNIQUE INDEX chat_room_member_pkey ON chat_room_member (member_id, chat_room_id);

-- Index: chat_room_name_key
CREATE UNIQUE INDEX chat_room_name_key ON chat_room (name);

-- Index: chat_room_pkey
CREATE UNIQUE INDEX chat_room_pkey ON chat_room (id);

-- Index: message_pkey
CREATE UNIQUE INDEX message_pkey ON message (id);

-- Index: message_reactions_message_id_user_id_emoji_key
CREATE UNIQUE INDEX message_reactions_message_id_user_id_emoji_key ON message_reactions (message_id, user_id, emoji);

-- Index: message_reactions_pkey
CREATE UNIQUE INDEX message_reactions_pkey ON message_reactions (id);

-- Index: user_profile_pkey
CREATE UNIQUE INDEX user_profile_pkey ON user_profile (id);

-- RLS Policy: Public rooms are viewable by everyone.
ALTER TABLE public.chat_room ENABLE ROW LEVEL SECURITY;
CREATE POLICY Public rooms are viewable by everyone. ON public.chat_room AS PERMISSIVE FOR SELECT USING ((is_public = true));

-- RLS Policy: view_specific_room
ALTER TABLE public.chat_room ENABLE ROW LEVEL SECURITY;
CREATE POLICY view_specific_room ON public.chat_room AS PERMISSIVE FOR SELECT USING ((id = '3fc9aa8a-81b7-4a60-92ce-066dcd9baa45'::uuid));

-- RLS Policy: Members can join public rooms.
ALTER TABLE public.chat_room_member ENABLE ROW LEVEL SECURITY;
CREATE POLICY Members can join public rooms. ON public.chat_room_member AS PERMISSIVE FOR INSERT WITH CHECK (((( SELECT auth.uid() AS uid) = member_id) AND (chat_room_id IN ( SELECT chat_room.id
   FROM chat_room
  WHERE (chat_room.is_public = true)))));

  -- RLS Policy: Members can read their own membership rows.
ALTER TABLE public.chat_room_member ENABLE ROW LEVEL SECURITY;
CREATE POLICY Members can read their own membership rows. ON public.chat_room_member AS PERMISSIVE FOR SELECT USING ((( SELECT auth.uid() AS uid) = member_id));

-- RLS Policy: Members can remove themselves from rooms.
ALTER TABLE public.chat_room_member ENABLE ROW LEVEL SECURITY;
CREATE POLICY Members can remove themselves from rooms. ON public.chat_room_member AS PERMISSIVE FOR DELETE USING ((( SELECT auth.uid() AS uid) = member_id));

-- RLS Policy: Members can update their own membership.
ALTER TABLE public.chat_room_member ENABLE ROW LEVEL SECURITY;
CREATE POLICY Members can update their own membership. ON public.chat_room_member AS PERMISSIVE FOR UPDATE USING ((( SELECT auth.uid() AS uid) = member_id)) WITH CHECK ((( SELECT auth.uid() AS uid) = member_id));

-- RLS Policy: Chat room members can insert messages
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;
CREATE POLICY Chat room members can insert messages ON public.message AS PERMISSIVE FOR INSERT WITH CHECK (((( SELECT auth.uid() AS uid) = author_id) AND (chat_room_id IN ( SELECT chat_room_member.chat_room_id
   FROM chat_room_member
  WHERE (chat_room_member.member_id = ( SELECT auth.uid() AS uid))))));

  -- RLS Policy: Chat room members can select messages
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;
CREATE POLICY Chat room members can select messages ON public.message AS PERMISSIVE FOR SELECT USING ((chat_room_id IN ( SELECT chat_room_member.chat_room_id
   FROM chat_room_member
  WHERE (chat_room_member.member_id = ( SELECT auth.uid() AS uid)))));

  -- RLS Policy: Enable read access to room members for realtime
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;
CREATE POLICY Enable read access to room members for realtime ON public.message AS PERMISSIVE FOR SELECT USING ((EXISTS ( SELECT 1
   FROM chat_room_member
  WHERE ((chat_room_member.chat_room_id = message.chat_room_id) AND (chat_room_member.member_id = auth.uid())))));

  -- RLS Policy: Message authors can delete their messages
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;
CREATE POLICY Message authors can delete their messages ON public.message AS PERMISSIVE FOR DELETE USING (((( SELECT auth.uid() AS uid) = author_id) AND (chat_room_id IN ( SELECT chat_room_member.chat_room_id
   FROM chat_room_member
  WHERE (chat_room_member.member_id = ( SELECT auth.uid() AS uid))))));

  -- RLS Policy: Message authors can update their messages
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;
CREATE POLICY Message authors can update their messages ON public.message AS PERMISSIVE FOR UPDATE USING (((( SELECT auth.uid() AS uid) = author_id) AND (chat_room_id IN ( SELECT chat_room_member.chat_room_id
   FROM chat_room_member
  WHERE (chat_room_member.member_id = ( SELECT auth.uid() AS uid)))))) WITH CHECK (((( SELECT auth.uid() AS uid) = author_id) AND (chat_room_id IN ( SELECT chat_room_member.chat_room_id
   FROM chat_room_member
  WHERE (chat_room_member.member_id = ( SELECT auth.uid() AS uid))))));

  -- RLS Policy: Allow delete own reactions
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY Allow delete own reactions ON public.message_reactions AS PERMISSIVE FOR DELETE USING ((auth.uid() = user_id));

-- RLS Policy: Allow insert own reactions
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY Allow insert own reactions ON public.message_reactions AS PERMISSIVE FOR INSERT WITH CHECK ((auth.uid() = user_id));

-- RLS Policy: Allow read reactions
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY Allow read reactions ON public.message_reactions AS PERMISSIVE FOR SELECT USING (true);

-- RLS Policy: Allow read access to all profiles
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY Allow read access to all profiles ON public.user_profile AS PERMISSIVE FOR SELECT USING (true);

-- RLS Policy: Allow users to update own profile
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY Allow users to update own profile ON public.user_profile AS PERMISSIVE FOR UPDATE USING ((auth.uid() = id));

-- RLS Policy: Enable insert for users based on user_id
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY Enable insert for users based on user_id ON public.user_profile AS PERMISSIVE FOR INSERT WITH CHECK ((( SELECT auth.uid() AS uid) = id));

-- Function: delete_all_messages_if_limit
CREATE OR REPLACE FUNCTION public.delete_all_messages_if_limit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_count int;
BEGIN
    -- Get the total number of messages
    SELECT COUNT(*) INTO total_count FROM message;

    -- If count >= 500, delete all messages
    IF total_count >= 500 THEN
        DELETE FROM message;
    END IF;

    RETURN NEW;
END;
$function$
;

-- Function: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  username text;
  avatar text;
BEGIN
  username := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    'Anonymous'
  );
  avatar := NEW.raw_user_meta_data->>'avatar_url';

  INSERT INTO public.user_profile (id, name, image_url)
  VALUES (NEW.id, username, avatar)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$
;

-- Function: update_message_author_info
CREATE OR REPLACE FUNCTION public.update_message_author_info()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update any existing messages with new profile info
  UPDATE message 
  SET author_name = NEW.name,
      author_image_url = NEW.image_url
  WHERE author_id = NEW.id;
  
  RETURN NEW;
END;
$function$
;