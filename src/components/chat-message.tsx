import { cn } from "@/lib/utils";
import { Message } from "@/services/supabase/actions/messages";
import { User2Icon, Reply, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Ref, useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { createClient } from "@/services/supabase/client";
import { EnneagramBadge } from "./enneagram-badge";

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export function ChatMessage({
  id,
  text,
  author,
  author_id,
  created_at,
  status,
  ref,
  onReply,
  reply_to,
}: Message & {
  status?: "pending" | "error" | "success";
  ref?: Ref<HTMLDivElement>;
  onReply?: (message: Message) => void;
  reply_to?: string | null;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<
    Record<string, { count: number; users: string[] }>
  >({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<{
    author: string;
    author_id?: string;
    text: string;
  } | null>(null);
  const supabase = createClient();
  const emojiPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPopupRef.current &&
        !emojiPopupRef.current.contains(event.target as Node)
      ) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactions]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });

    if (reply_to) {
      supabase
        .from("message")
        .select("text, author:user_profile(name), author_id")
        .eq("id", reply_to)
        .single()
        .then(({ data }) => {
          if (data) {
            setReplyToMessage({
              author: data.author?.name || "User",
              author_id: data.author_id,
              text: data.text,
            });
          }
        });
    }

    loadReactions();

    const channel = supabase
      .channel(`reactions:${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
          filter: `message_id=eq.${id}`,
        },
        () => {
          loadReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, reply_to]);

  const loadReactions = async () => {
    const { data } = await (supabase as any)
      .from("message_reactions")
      .select("emoji, user_id")
      .eq("message_id", id);

    if (data) {
      const reactionMap: Record<string, { count: number; users: string[] }> =
        {};
      data.forEach(({ emoji, user_id }: any) => {
        if (!reactionMap[emoji]) {
          reactionMap[emoji] = { count: 0, users: [] };
        }
        reactionMap[emoji].count++;
        reactionMap[emoji].users.push(user_id);
      });
      setReactions(reactionMap);
    }
  };

  const handleReaction = async (emoji: string) => {
    if (!currentUserId) return;

    const hasReacted = reactions[emoji]?.users.includes(currentUserId);
    const userHasAnyReaction = Object.values(reactions).some((reaction) =>
      reaction.users.includes(currentUserId)
    );

    let newReactions = { ...reactions };

    if (hasReacted) {
      newReactions[emoji].count--;
      newReactions[emoji].users = newReactions[emoji].users.filter(
        (id) => id !== currentUserId
      );
      if (newReactions[emoji].count === 0) delete newReactions[emoji];
      setReactions(newReactions);

      await (supabase as any)
        .from("message_reactions")
        .delete()
        .eq("message_id", id)
        .eq("user_id", currentUserId)
        .eq("emoji", emoji);
    } else {
      if (userHasAnyReaction) {
        await (supabase as any)
          .from("message_reactions")
          .delete()
          .eq("message_id", id)
          .eq("user_id", currentUserId);
      }

      await (supabase as any).from("message_reactions").upsert({
        message_id: id,
        user_id: currentUserId,
        emoji,
      });
    }

    setShowReactions(false);
  };

  const displayName =
    currentUserId === author_id ? "You" : author?.name || "User";
  const replyDisplayName =
    replyToMessage?.author_id === currentUserId
      ? "You"
      : replyToMessage?.author;

  return (
    <div
      ref={ref}
      className={cn(
        "group flex gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-white/25 to-white/15 dark:from-black/20 dark:to-black/10 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-lg sm:rounded-xl transition-all duration-200 hover:from-white/30 hover:to-white/20 dark:hover:from-black/25 dark:hover:to-black/15 relative shadow-lg",
        status === "pending" && "opacity-60",
        status === "error" && "bg-red-500/10 border border-red-500/20"
      )}
      onClick={() => setShowReactions(false)}
    >
      <div className="shrink-0">
        {author?.image_url != null ? (
          <Image
            src={author.image_url}
            alt={author.name}
            width={28}
            height={28}
            className="rounded-full sm:w-8 sm:h-8"
          />
        ) : (
          <div className="size-7 sm:size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--typecircle-green)]/20 to-blue-500/20 text-muted-foreground">
            <User2Icon className="size-3 sm:size-4" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs sm:text-sm font-medium text-[var(--typecircle-green)] truncate">
            {displayName}
          </span>
          {author?.enneagram_type && (
            <EnneagramBadge type={author.enneagram_type} />
          )}
          <span className="text-xs text-muted-foreground shrink-0">
            {DATE_FORMATTER.format(new Date(created_at))}
          </span>
        </div>

        {replyToMessage && (
          <div className="mb-2 pl-3 border-l-2 border-[var(--typecircle-green)]/30 bg-muted/20 rounded-r-lg p-2">
            <div className="text-xs text-[var(--typecircle-green)] font-medium mb-1">
              Replying to {replyDisplayName}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {replyToMessage.text}
            </div>
          </div>
        )}

        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap mb-2">
          {text}
        </p>

        {Object.keys(reactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {Object.entries(reactions).map(([emoji, { count, users }]) => {
              const hasReacted = currentUserId
                ? users.includes(currentUserId)
                : false;

              return (
                <button
                  key={emoji}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105 ${
                    hasReacted
                      ? "bg-[var(--typecircle-green)]/20 border border-[var(--typecircle-green)]/40 text-[var(--typecircle-green)] shadow-sm"
                      : "bg-muted/30 hover:bg-muted/50 border border-transparent"
                  }`}
                  onClick={() => handleReaction(emoji)}
                  title={
                    hasReacted
                      ? "Click to remove your reaction"
                      : "Click to add reaction"
                  }
                >
                  <span className="text-sm">{emoji}</span>
                  <span className="font-medium">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 sm:opacity-0 transition-opacity flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => onReply?.({ id, text, author, author_id, created_at })}
        >
          <Reply className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setShowReactions(!showReactions);
          }}
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>

      {showReactions && (
        <div
          ref={emojiPopupRef}
          className="absolute right-4 top-12 bg-background border border-border rounded-lg p-2 flex gap-1 shadow-lg z-10"
        >
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              className="p-1 hover:bg-muted rounded text-lg transition-colors"
              onClick={() => handleReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
