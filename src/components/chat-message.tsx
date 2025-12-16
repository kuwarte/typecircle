import { cn } from "@/lib/utils";
import { Message } from "@/services/supabase/actions/messages";
import { User2Icon, Reply, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Ref, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { addReaction, removeReaction } from "@/services/supabase/actions/reactions";
import { createClient } from "@/services/supabase/client";

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

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
  const [reactions, setReactions] = useState<Record<string, { count: number; users: string[] }>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<{ author: string; text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
    
    // Load reply message if exists
    if (reply_to) {
      supabase
        .from('message')
        .select('text, author:user_profile(name)')
        .eq('id', reply_to)
        .single()
        .then(({ data }) => {
          if (data) {
            setReplyToMessage({
              author: data.author?.name || 'User',
              text: data.text
            });
          }
        });
    }
    
    // Load existing reactions
    loadReactions();
    
    // Subscribe to reaction changes
    const channel = supabase
      .channel(`reactions:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
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
      .from('message_reactions')
      .select('emoji, user_id')
      .eq('message_id', id);

    if (data) {
      const reactionMap: Record<string, { count: number; users: string[] }> = {};
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
    
    if (hasReacted) {
      await (supabase as any)
        .from('message_reactions')
        .delete()
        .eq('message_id', id)
        .eq('user_id', currentUserId)
        .eq('emoji', emoji);
    } else {
      await (supabase as any)
        .from('message_reactions')
        .upsert({
          message_id: id,
          user_id: currentUserId,
          emoji
        });
    }
    
    setShowReactions(false);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group flex gap-4 px-4 py-3 bg-gradient-to-br from-white/25 to-white/15 dark:from-black/20 dark:to-black/10 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-xl transition-all duration-200 hover:from-white/30 hover:to-white/20 dark:hover:from-black/25 dark:hover:to-black/15 relative shadow-lg",
        status === "pending" && "opacity-60",
        status === "error" && "bg-red-500/10 border border-red-500/20"
      )}
    >
      <div className="shrink-0">
        {author?.image_url != null ? (
          <Image
            src={author.image_url}
            alt={author.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--typecircle-green)]/20 to-blue-500/20 text-muted-foreground">
            <User2Icon className="size-4" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[var(--typecircle-green)]">
            {author?.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {DATE_FORMATTER.format(new Date(created_at))}
          </span>
        </div>
        
        {replyToMessage && (
          <div className="mb-2 pl-3 border-l-2 border-[var(--typecircle-green)]/30 bg-muted/20 rounded-r-lg p-2">
            <div className="text-xs text-[var(--typecircle-green)] font-medium mb-1">
              Replying to {replyToMessage.author}
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
          <div className="flex gap-1 mb-2">
            {Object.entries(reactions).map(([emoji, { count, users }]) => {
              const hasReacted = currentUserId ? users.includes(currentUserId) : false;
              
              return (
                <button
                  key={emoji}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200 ${
                    hasReacted 
                      ? 'bg-[var(--typecircle-green)]/20 border border-[var(--typecircle-green)]/40 text-[var(--typecircle-green)] hover:bg-[var(--typecircle-green)]/30' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => handleReaction(emoji)}
                  title={hasReacted ? 'Click to remove your reaction' : 'Click to add reaction'}
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
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
          onClick={() => setShowReactions(!showReactions)}
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>
      
      {showReactions && (
        <div className="absolute right-4 top-12 bg-background border border-border rounded-lg p-2 flex gap-1 shadow-lg z-10">
          {REACTIONS.map(emoji => (
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
