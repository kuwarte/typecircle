export type Profile = {
  username: string | null;
  avatar_url?: string | null;
};

export type Reaction = {
  emoji: string;
  user_id: string;
};

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  profiles: Profile[] | Profile | null;
};

export type Post = {
  id: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  group?:
    | {
        id: string | null;
        name: string | null;
        topic?: string | null;
      }[]
    | {
        id: string | null;
        name: string | null;
        topic?: string | null;
      }
    | null;
  profiles: Profile[] | Profile | null;
  enneagram_types?:
    | {
        name: string | null;
        color_hex: string | null;
      }[]
    | {
        name: string | null;
        color_hex: string | null;
      }
    | null;
  reactions?: Reaction[] | null;
  comments?: Comment[] | null;
};

export type GroupOption = {
  id: string;
  name: string | null;
};
