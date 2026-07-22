"use client";
import { useMemo, useState } from "react";
import { createClient } from "@/services/supabase/client";
import type { GroupOption, Post } from "./types";
import { useCurrentUser } from "./use-current-user";
import { useReactions } from "./use-reactions";
import { useComments } from "./use-comments";
import { usePostComposer } from "./use-post-composer";
import { useLightbox } from "./use-lightbox";
import { useToggleMap } from "./use-toggle-map";
import PostComposer from "./post-composer";
import PostCard from "./post-card";
import ImageLightbox from "./image-lightbox";
export type { Post };

export default function FeedPosts({
  initialPosts,
  groups = [],
  fixedGroupId,
  isMember = true,
}: {
  initialPosts: Post[];
  groups?: GroupOption[];
  fixedGroupId?: string;
  isMember?: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const { userId, ownProfile } = useCurrentUser(supabase);
  const { pendingReactions, toggleReaction } = useReactions({
    supabase,
    setPosts,
  });
  const { commentInputs, setCommentInput, addComment } = useComments({
    supabase,
    setPosts,
    ownProfile,
  });
  const composer = usePostComposer({
    supabase,
    userId,
    fixedGroupId,
    onPostCreated: (post) => setPosts((current) => [post, ...current]),
  });
  const { lightboxImage, openLightbox, closeLightbox } = useLightbox();
  const postExpand = useToggleMap();
  const commentsExpand = useToggleMap();
  const canPost = Boolean(userId) && isMember;
  return (
    <div className="flex flex-col gap-4">
      {canPost && (
        <PostComposer
          ownProfile={ownProfile}
          groups={groups}
          fixedGroupId={fixedGroupId}
          selectedGroupId={composer.selectedGroupId}
          onSelectGroup={composer.setSelectedGroupId}
          composerText={composer.composerText}
          onComposerTextChange={composer.setComposerText}
          selectedFile={composer.selectedFile}
          previewUrl={composer.previewUrl}
          onFileChange={composer.handleFileChange}
          composerError={composer.composerError}
          isPosting={composer.isPosting}
          onSubmit={composer.handleCreatePost}
        />
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          userId={userId}
          fixedGroupId={fixedGroupId}
          canPost={canPost}
          isExpanded={postExpand.isOn(post.id)}
          onToggleExpand={() => postExpand.toggle(post.id)}
          isCommentsExpanded={commentsExpand.isOn(post.id)}
          onToggleComments={() => commentsExpand.toggle(post.id)}
          pendingEmoji={pendingReactions[post.id]}
          onToggleReaction={(emoji) =>
            toggleReaction(post.id, emoji, post.reactions ?? [])
          }
          commentValue={commentInputs[post.id] ?? ""}
          onCommentChange={(value) => setCommentInput(post.id, value)}
          onAddComment={() => addComment(post.id)}
          onOpenLightbox={openLightbox}
        />
      ))}
      <ImageLightbox image={lightboxImage} onClose={closeLightbox} />
    </div>
  );
}
