import { useState } from "react";
import { createClient } from "@/services/supabase/client";
import type { Post, Reaction } from "./types";

export function useReactions({
  supabase,
  setPosts,
}: {
  supabase: ReturnType<typeof createClient>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}) {
  // Tracks which emoji (if any) is mid-flight for a given post, so the
  // matching button can be disabled to prevent a double-submit mid-request.
  const [pendingReactions, setPendingReactions] = useState<
    Record<string, string>
  >({});

  async function toggleReaction(
    postId: string,
    emoji: string,
    currentReactions: Reaction[],
  ) {
    if (pendingReactions[postId]) return; // prevent double-submit mid-request

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const userIdLocal = session.user.id;
    const ownReaction = currentReactions.find(
      (reaction) => reaction.user_id === userIdLocal,
    );
    const previousReactions = currentReactions; // snapshot for rollback

    setPendingReactions((state) => ({ ...state, [postId]: emoji }));

    const applyReactions = (reactions: Reaction[]) =>
      setPosts((current) =>
        current.map((item) =>
          item.id === postId ? { ...item, reactions } : item,
        ),
      );

    const clearPending = () =>
      setPendingReactions((state) => {
        const next = { ...state };
        delete next[postId];
        return next;
      });

    const rollback = () => {
      applyReactions(previousReactions);
      clearPending();
    };

    try {
      if (ownReaction?.emoji === emoji) {
        applyReactions(
          previousReactions.filter((r) => r.user_id !== userIdLocal),
        );
        const { error } = await supabase
          .from("reactions")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userIdLocal);
        if (error) throw error;
      } else if (ownReaction) {
        applyReactions(
          previousReactions.map((r) =>
            r.user_id === userIdLocal ? { ...r, emoji } : r,
          ),
        );
        const { error } = await supabase
          .from("reactions")
          .update({ emoji })
          .eq("post_id", postId)
          .eq("user_id", userIdLocal);
        if (error) throw error;
      } else {
        applyReactions([...previousReactions, { emoji, user_id: userIdLocal }]);
        const { error } = await supabase
          .from("reactions")
          .insert({ post_id: postId, user_id: userIdLocal, emoji });
        if (error) throw error;
      }
    } catch (err) {
      console.error(err);
      rollback();
      return;
    }

    clearPending();
  }

  return { pendingReactions, toggleReaction };
}
