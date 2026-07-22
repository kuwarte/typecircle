"use client";

import { ImagePlus, Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GroupOption, Profile } from "./types";

export default function PostComposer({
  ownProfile,
  groups,
  fixedGroupId,
  selectedGroupId,
  onSelectGroup,
  composerText,
  onComposerTextChange,
  selectedFile,
  previewUrl,
  onFileChange,
  composerError,
  isPosting,
  onSubmit,
}: {
  ownProfile: Profile | null;
  groups: GroupOption[];
  fixedGroupId?: string;
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  composerText: string;
  onComposerTextChange: (value: string) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null) => void;
  composerError: string;
  isPosting: boolean;
  onSubmit: () => void;
}) {
  const ownInitials = ownProfile?.username?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-paper)] px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 border border-[var(--color-ink)]/10 shrink-0">
          <AvatarImage src={ownProfile?.avatar_url ?? ""} />
          <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
            {ownInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <textarea
            value={composerText}
            onChange={(event) => onComposerTextChange(event.target.value)}
            placeholder="Share something with your circle..."
            rows={2}
            className="w-full resize-none rounded-2xl border border-[var(--color-ink)]/12 bg-white/55 px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />

          <div className="mt-2 flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[var(--color-ink)]/20 px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)]/50 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent-ink)] transition-colors cursor-pointer">
              <ImagePlus size={13} strokeWidth={2.25} />
              {selectedFile ? "Change image" : "Add image"}
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  onFileChange(event.target.files?.[0] ?? null)
                }
                className="hidden"
              />
            </label>
            {selectedFile && (
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="text-xs font-semibold text-[var(--color-ink)]/40 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          {previewUrl && (
            <div className="relative mt-2 inline-block">
              <img
                src={previewUrl}
                alt="Selected preview"
                className="max-h-40 rounded-xl border border-[var(--color-ink)]/10"
              />
            </div>
          )}

          {composerError && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {composerError}
            </p>
          )}

          <div
            className={`mt-3 flex items-center gap-3 ${
              fixedGroupId ? "justify-end" : "justify-between"
            }`}
          >
            {!fixedGroupId &&
              (groups.length > 0 ? (
                <select
                  value={selectedGroupId ?? ""}
                  onChange={(event) =>
                    onSelectGroup(event.target.value || null)
                  }
                  className="min-w-0 rounded-full border border-[var(--color-ink)]/12 bg-white/55 px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)]/62 outline-none focus:border-[var(--color-accent)] transition-colors"
                  aria-label="Post to"
                >
                  <option value="">General feed</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name ?? "Untitled circle"}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-[var(--color-ink)]/35">
                  Posting to the general feed
                </span>
              ))}

            <button
              type="button"
              onClick={onSubmit}
              disabled={!composerText.trim() || isPosting}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-4 py-2 text-xs font-semibold hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-40 shrink-0"
            >
              {isPosting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} strokeWidth={2.25} />
              )}
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
