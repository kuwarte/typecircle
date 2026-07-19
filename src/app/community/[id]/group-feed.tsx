"use client";

import { useState } from "react";
import { createClient } from "@/services/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

type Post = {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string; avatar_url: string } | null;
  enneagram_types: { name: string; color_hex: string } | null;
  reactions: { emoji: string; user_id: string }[];
};

const EMOJIS = ["👍", "❤️", "😂", "🔥", "🤔"];

export function GroupFeed({ groupId, initialPosts }: { groupId: string; initialPosts: Post[] }) {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  async function handlePost() {
    if (!content.trim()) return;
    setPosting(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setPosting(false); return; }

    const { data: post } = await supabase
      .from("posts")
      .insert({ content: content.trim(), author_id: session.user.id })
      .select(`id, content, created_at, profiles(username, avatar_url), enneagram_types:type_tag(name, color_hex), reactions(emoji, user_id)`)
      .single();

    if (post) setPosts((p) => [post as Post, ...p]);
    setContent("");
    setPosting(false);
  }

  async function toggleReaction(postId: string, emoji: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const post = posts.find((p) => p.id === postId);
    const existing = post?.reactions.find((r) => r.emoji === emoji && r.user_id === session.user.id);

    if (existing) {
      await supabase.from("reactions").delete()
        .eq("post_id", postId).eq("user_id", session.user.id).eq("emoji", emoji);
      setPosts((ps) => ps.map((p) => p.id === postId
        ? { ...p, reactions: p.reactions.filter((r) => !(r.emoji === emoji && r.user_id === session.user.id)) }
        : p
      ));
    } else {
      await supabase.from("reactions").insert({ post_id: postId, user_id: session.user.id, emoji });
      setPosts((ps) => ps.map((p) => p.id === postId
        ? { ...p, reactions: [...p.reactions, { emoji, user_id: session.user.id }] }
        : p
      ));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Composer */}
      <div className="rounded-2xl border border-black/5 p-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with the circle…"
          rows={3}
          className="w-full resize-none text-sm outline-none placeholder:text-[var(--color-ink)]/30 bg-transparent"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handlePost}
            disabled={posting || !content.trim()}
            className="rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-5 py-2 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-40"
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 && (
        <p className="text-sm text-[var(--color-ink)]/40 px-1">No posts yet — start the conversation.</p>
      )}

      {posts.map((post) => {
        const initials = post.profiles?.username?.slice(0, 2).toUpperCase() ?? "?";
        const reactionCounts = EMOJIS.map((e) => ({
          emoji: e,
          count: post.reactions.filter((r) => r.emoji === e).length,
        }));

        return (
          <div key={post.id} className="rounded-2xl border border-black/5 p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.profiles?.avatar_url ?? ""} />
                <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium truncate">{post.profiles?.username ?? "—"}</span>
                {post.enneagram_types && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ backgroundColor: post.enneagram_types.color_hex }}
                  >
                    {post.enneagram_types.name}
                  </span>
                )}
              </div>
              <span className="ml-auto text-xs text-[var(--color-ink)]/30 shrink-0">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>

            <p className="text-sm text-[var(--color-ink)]/80 leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-1.5 mt-4 flex-wrap">
              {reactionCounts.map(({ emoji, count }) => (
                <button
                  key={emoji}
                  onClick={() => toggleReaction(post.id, emoji)}
                  className="flex items-center gap-1 rounded-full border border-black/8 px-2.5 py-1 text-xs hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5 transition-colors"
                >
                  {emoji}
                  {count > 0 && <span className="text-[var(--color-ink)]/50">{count}</span>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
