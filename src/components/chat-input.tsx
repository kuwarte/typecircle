"use client";

import { SendIcon, X } from "lucide-react";
import { InputGroupTextarea } from "./ui/input-group";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { Message, sendMessage } from "@/services/supabase/actions/messages";
import { Button } from "./ui/button";

type Props = {
  roomId: string;
  onSend: (message: { id: string; text: string; replyTo?: string }) => void;
  onSuccessfulSend: (message: Message) => void;
  onErrorSend: (id: string) => void;
  replyTo?: { id: string; author: string; text: string } | null;
  onClearReply?: () => void;
  onTyping?: (isTyping: boolean) => void;
};

export function ChatInput({
  roomId,
  onSend,
  onSuccessfulSend,
  onErrorSend,
  replyTo,
  onClearReply,
  onTyping,
}: Props) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping?.(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [message, isTyping, onTyping]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      onTyping?.(true);
    }
  };

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessage("");
    onClearReply?.();
    const id = crypto.randomUUID();
    onSend({ id, text, replyTo: replyTo?.id });
    const result = await sendMessage({ id, text, roomId, replyTo: replyTo?.id });
    console.log("sendMessage result:", result);
    if (result.error) {
      toast.error(result.message);
      onErrorSend(id);
    } else {
      onSuccessfulSend(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass-card rounded-2xl p-4">
        {replyTo && (
          <div className="mb-3 p-3 bg-muted/20 rounded-lg border-l-4 border-[var(--typecircle-green)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[var(--typecircle-green)]">
                Replying to {replyTo.author}
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={onClearReply}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {replyTo.text}
            </p>
          </div>
        )}
        
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <InputGroupTextarea
              placeholder={replyTo ? "Reply to message..." : "Type your message..."}
              value={message}
              onChange={handleInputChange}
              className="w-full min-h-[44px] max-h-32 bg-transparent border-0 resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="flex items-center justify-center w-10 h-10 bg-[var(--typecircle-green)] text-white rounded-xl transition-all duration-200 hover:bg-[var(--typecircle-green)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
