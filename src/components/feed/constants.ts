import { Flame, Heart, Lightbulb, Smile, ThumbsUp } from "lucide-react";

export const REACTION_CHOICES = [
  {
    value: "like",
    label: "Like",
    Icon: ThumbsUp,
    activeClass:
      "border-slate-500/30 bg-slate-500/8 text-slate-700 hover:bg-slate-500/12",
  },
  {
    value: "heart",
    label: "Love",
    Icon: Heart,
    activeClass:
      "border-rose-400/30 bg-rose-400/8 text-rose-700 hover:bg-rose-400/12",
  },
  {
    value: "smile",
    label: "Smile",
    Icon: Smile,
    activeClass:
      "border-amber-400/35 bg-amber-400/10 text-amber-700 hover:bg-amber-400/14",
  },
  {
    value: "fire",
    label: "Fire",
    Icon: Flame,
    activeClass:
      "border-orange-400/35 bg-orange-400/10 text-orange-700 hover:bg-orange-400/14",
  },
  {
    value: "insight",
    label: "Insight",
    Icon: Lightbulb,
    activeClass:
      "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent-ink)] hover:bg-[var(--color-accent)]/14",
  },
] as const;

export const VISIBLE_COMMENT_COUNT = 2;
export const MAX_POST_LENGTH = 320;
export const MAX_POST_IMAGE_SIZE = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Matches the select shape used in the server queries for
// src/app/feed/page.tsx and src/app/community/[id]/page.tsx. Kept in one
// place so the composer's insert().select() stays in sync with both.
// IMPORTANT: any server query feeding `initialPosts` into FeedPosts MUST
// also select image_url, or posts loaded on first page load will be
// missing their images even though newly-created posts (via the composer)
// will have them.
export const POST_SELECT = `
  id,
  content,
  created_at,
  image_url,
  group:groups(id, name, topic),
  profiles(username, avatar_url),
  enneagram_types:type_tag(name, color_hex),
  reactions(emoji, user_id),
  comments(id, content, created_at, profiles:author_id(username, avatar_url))
`;
