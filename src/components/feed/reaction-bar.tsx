"use client";

import { REACTION_CHOICES } from "./constants";
import type { Reaction } from "./types";

export default function ReactionBar({
  reactions,
  userId,
  pendingEmoji,
  onToggle,
}: {
  reactions: Reaction[];
  userId: string | null;
  pendingEmoji?: string;
  onToggle: (emoji: string) => void;
}) {
  const ownReaction = userId
    ? reactions.find((reaction) => reaction.user_id === userId)
    : null;
  const isPending = Boolean(pendingEmoji);

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {REACTION_CHOICES.map(({ value, label, Icon, activeClass }) => {
        const isActive = ownReaction?.emoji === value;
        const count = reactions.filter(
          (reaction) => reaction.emoji === value,
        ).length;

        return (
          <button
            key={value}
            onClick={() => onToggle(value)}
            type="button"
            disabled={isPending}
            className={`h-9 rounded-full border px-3 text-xs font-semibold transition-all duration-200 ease-out inline-flex items-center gap-1.5 disabled:opacity-50 active:scale-90 ${
              isActive
                ? `${activeClass} scale-105`
                : "border-[var(--color-ink)]/10 text-[var(--color-ink)]/52 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/8 hover:text-[var(--color-accent-ink)] hover:scale-105"
            }`}
            aria-label={label}
            aria-pressed={isActive}
          >
            <Icon
              size={14}
              strokeWidth={isActive ? 2.7 : 2.2}
              fill={isActive && value === "heart" ? "currentColor" : "none"}
            />
            {count > 0 && (
              <span
                className={
                  isActive ? "text-current" : "text-[var(--color-ink)]/42"
                }
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
