"use client";

import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VISIBLE_COMMENT_COUNT } from "./constants";
import { getProfile } from "./utils";
import type { Comment } from "./types";

export default function CommentList({
  comments,
  isExpanded,
  onToggleExpand,
  canComment,
  commentValue,
  onCommentChange,
  onAddComment,
}: {
  comments: Comment[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  canComment: boolean;
  commentValue: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
}) {
  const visibleComments = isExpanded
    ? comments
    : comments.slice(0, VISIBLE_COMMENT_COUNT);
  const hiddenCount = Math.max(comments.length - VISIBLE_COMMENT_COUNT, 0);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]/58">
          <MessageCircle
            size={15}
            strokeWidth={2.25}
            className="text-[var(--color-accent)]"
          />
          <span>
            {comments.length === 0
              ? "No comments"
              : `${comments.length} ${
                  comments.length === 1 ? "comment" : "comments"
                }`}
          </span>
        </div>

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="text-xs font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-ink)] transition-colors"
          >
            {isExpanded ? "Show less" : `See ${hiddenCount} more`}
          </button>
        )}
      </div>

      {comments.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {visibleComments.map((comment) => {
            const commentProfile = getProfile(comment.profiles);
            const isOptimistic = comment.id.startsWith("temp-");
            const commentInitials = (commentProfile?.username ?? "?")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div
                key={comment.id}
                className={`flex items-start gap-3 transition-opacity ${
                  isOptimistic ? "opacity-60" : "opacity-100"
                }`}
              >
                <Avatar className="mt-0.5 w-7 h-7 border border-[var(--color-ink)]/10 shrink-0">
                  <AvatarImage src={commentProfile?.avatar_url ?? ""} />
                  <AvatarFallback className="bg-[var(--color-accent)]/12 text-[var(--color-accent-ink)] text-[10px] font-bold">
                    {commentInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 rounded-2xl bg-[var(--color-paper)] border border-[var(--color-ink)]/8 px-3.5 py-2.5">
                  <div className="text-xs font-semibold text-[var(--color-ink)]/68">
                    {commentProfile?.username ?? "Unknown"}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-ink)]/78">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {canComment && (
        <div className="mt-4 flex gap-2">
          <input
            value={commentValue}
            onChange={(event) => onCommentChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onAddComment();
            }}
            placeholder="Write a comment..."
            className="min-w-0 flex-1 rounded-full border border-[var(--color-ink)]/12 bg-white/55 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />
          <button
            onClick={onAddComment}
            type="button"
            className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] flex items-center justify-center hover:bg-[var(--color-accent)]/90 transition-colors shrink-0"
            aria-label="Add comment"
          >
            <Send size={15} strokeWidth={2.25} />
          </button>
        </div>
      )}
    </>
  );
}
