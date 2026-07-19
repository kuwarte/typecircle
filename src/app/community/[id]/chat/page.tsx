"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { use } from "react";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: { username: string; avatar_url: string } | null;
};

export default function GroupChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: groupId } = use(params);
  const supabase = createClient();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);

      // Find or create a group conversation linked by name convention
      let { data: conv } = await supabase
        .from("conversations")
        .select("id")
        .eq("name", `group:${groupId}`)
        .eq("is_group", true)
        .maybeSingle();

      if (!conv) {
        const { data: newConv } = await supabase
          .from("conversations")
          .insert({ is_group: true, name: `group:${groupId}` })
          .select("id")
          .single();
        conv = newConv;

        if (newConv) {
          await supabase.from("conversation_participants")
            .insert({ conversation_id: newConv.id, user_id: session.user.id });
        }
      } else {
        // Ensure current user is a participant
        await supabase.from("conversation_participants")
          .upsert({ conversation_id: conv.id, user_id: session.user.id });
      }

      if (!conv) return;
      setConversationId(conv.id);

      // Load existing messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("id, content, created_at, sender_id, profiles:sender_id(username, avatar_url)")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: true })
        .limit(100);

      setMessages((msgs as Message[]) ?? []);
    }

    init();
  }, [groupId]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from("messages")
          .select("id, content, created_at, sender_id, profiles:sender_id(username, avatar_url)")
          .eq("id", payload.new.id)
          .single();
        if (data) setMessages((m) => [...m, data as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || !conversationId || !userId) return;
    setSending(true);

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: input.trim(),
    });

    setInput("");
    setSending(false);
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <Link
          href={`/community/${groupId}`}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </Link>
        <h1 className="font-heading font-semibold text-lg tracking-tight">Circle chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
        {messages.length === 0 && (
          <p className="text-sm text-[var(--color-ink)]/40 text-center mt-8">
            No messages yet — say something.
          </p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === userId;
          const initials = msg.profiles?.username?.slice(0, 2).toUpperCase() ?? "?";

          return (
            <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
              {!isMe && (
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarImage src={msg.profiles?.avatar_url ?? ""} />
                  <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && (
                  <span className="text-xs text-[var(--color-ink)]/40 px-1">{msg.profiles?.username}</span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)] rounded-br-sm"
                      : "bg-black/5 text-[var(--color-ink)] rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex items-center gap-3 border-t border-black/5 pt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] transition-colors bg-white"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] flex items-center justify-center hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-40"
        >
          <Send size={15} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
