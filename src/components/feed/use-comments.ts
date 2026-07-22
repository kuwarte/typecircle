import { useState } from "react";
import { createClient } from "@/services/supabase/client";
import type { Comment, Post, Profile } from "./types";

export function useComments({
  supabase,
  setPosts,
  ownProfile,
}: {
  supabase: ReturnType<typeof createClient>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  ownProfile: Profile | null;
}) {
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  function setCommentInput(postId: string, value: string) {
    setCommentInputs((state) => ({ ...state, [postId]: value }));
  }

  async function addComment(postId: string) {
    const content = (commentInputs[postId] || "").trim();
    if (!content) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const temp = {
      id: `temp-${crypto.randomUUID()}`,
      content,
      created_at: new Date().toISOString(),
      profiles: {
        username: session.user.email?.split("@")[0] ?? "me",
        avatar_url: ownProfile?.avatar_url ?? null,
      },
    };

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments ?? []), temp] }
          : post,
      ),
    );
    setCommentInput(postId, "");

    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, author_id: session.user.id, content })
      .select(
        "id, content, created_at, profiles:author_id(username, avatar_url)",
      )
      .single();

    if (error) {
      console.error(error);
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: (post.comments ?? []).filter(
                  (comment) => !comment.id.startsWith("temp-"),
                ),
              }
            : post,
        ),
      );
      return;
    }

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments ?? []).map((comment) =>
                comment.id.startsWith("temp-") ? (data as Comment) : comment,
              ),
            }
          : post,
      ),
    );
  }

  return { commentInputs, setCommentInput, addComment };
}
