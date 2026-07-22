"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MAX_POST_LENGTH } from "./constants";
import {
  formatDate,
  formatRelativeTime,
  getProfile,
  getRelated,
} from "./utils";
import ReactionBar from "./reaction-bar";
import CommentList from "./comment-list";
import type { Post } from "./types";

export default function PostCard({
  post,
  userId,
  fixedGroupId,
  canPost,
  isExpanded,
  onToggleExpand,
  isCommentsExpanded,
  onToggleComments,
  pendingEmoji,
  onToggleReaction,
  commentValue,
  onCommentChange,
  onAddComment,
  onOpenLightbox,
}: {
  post: Post;
  userId: string | null;
  fixedGroupId?: string;
  canPost: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isCommentsExpanded: boolean;
  onToggleComments: () => void;
  pendingEmoji?: string;
  onToggleReaction: (emoji: string) => void;
  commentValue: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
  onOpenLightbox: (url: string) => void;
}) {
  const profile = getProfile(post.profiles);
  const group = getRelated(post.group);
  const type = getRelated(post.enneagram_types);
  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?";
  const comments = post.comments ?? [];
  const reactions = post.reactions ?? [];

  const isLongPost = post.content.length > MAX_POST_LENGTH;
  const displayContent =
    isLongPost && !isExpanded
      ? `${post.content.slice(0, MAX_POST_LENGTH).trimEnd()}…`
      : post.content;

  return (
    <article className="rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-paper)]">
      <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="w-10 h-10 border border-[var(--color-ink)]/10">
            <AvatarImage src={profile?.avatar_url ?? ""} />
            <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-semibold truncate">
                {profile?.username ?? "Unknown"}
              </span>
              <span
                className="text-xs text-[var(--color-ink)]/35"
                title={formatDate(post.created_at)}
              >
                {formatRelativeTime(post.created_at)}
              </span>
            </div>
            {!fixedGroupId && group?.name && group.id && (
              <Link
                href={`/community/${group.id}`}
                title={group.topic ?? ""}
                className="mt-1 inline-flex text-xs font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-ink)] transition-colors"
              >
                {group.name}
              </Link>
            )}
          </div>
        </div>

        {type?.name && (
          <span
            className="hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: type.color_hex
                ? `${type.color_hex}18`
                : "rgba(0,0,0,0.045)",
              color: type.color_hex ?? "rgba(0,0,0,0.48)",
            }}
          >
            {type.name}
          </span>
        )}
      </div>

      <div className="px-5 pb-5 sm:px-6">
        <p className="whitespace-pre-wrap text-[15px] sm:text-base leading-7 text-[var(--color-ink)]/82">
          {displayContent}
        </p>
        {isLongPost && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="mt-1.5 text-xs font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-ink)] transition-colors"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}

        {post.image_url && (
          <button
            type="button"
            onClick={() => onOpenLightbox(post.image_url!)}
            className="mt-4 block w-full overflow-hidden rounded-xl border border-[var(--color-ink)]/10 cursor-zoom-in"
            aria-label="View full image"
          >
            <img
              src={post.image_url}
              alt="Post attachment"
              className="w-full max-h-96 object-cover transition-transform duration-200 hover:scale-[1.02]"
              loading="lazy"
            />
          </button>
        )}

        <ReactionBar
          reactions={reactions}
          userId={userId}
          pendingEmoji={pendingEmoji}
          onToggle={onToggleReaction}
        />
      </div>

      <div className="border-t border-[var(--color-ink)]/8 bg-[var(--color-ink)]/[0.018] px-5 py-4 sm:px-6">
        <CommentList
          comments={comments}
          isExpanded={isCommentsExpanded}
          onToggleExpand={onToggleComments}
          canComment={canPost}
          commentValue={commentValue}
          onCommentChange={onCommentChange}
          onAddComment={onAddComment}
        />
      </div>
    </article>
  );
}
