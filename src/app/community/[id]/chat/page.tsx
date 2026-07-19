// src/app/community/[id]/chat/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { use } from "react";

type Profile = {
  username: string;
  avatar_url: string | null;
};

// Raw shape returned directly from Supabase (profiles comes back as an array)
type RawMessage = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: Profile[] | null;
};

// Shape we actually want to use in the UI (profiles flattened to one object)
type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: Profile | null;
};

function normalizeMessage(raw: RawMessage): Message {
  return {
    ...raw,
    profiles: raw.profiles?.[0] ?? null,
  };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GroupChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = use(params);
  const supabase = createClient();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState(true);
  const [chatError, setChatError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      setLoadingChat(true);
      setChatError(false);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setChatError(true);
        setLoadingChat(false);
        return;
      }
      setUserId(session.user.id);

      // Look for an existing conversation tied to this group
      let { data: conv } = await supabase
        .from("conversations")
        .select("id")
        .eq("name", `group:${groupId}`)
        .eq("is_group", true)
        .maybeSingle();

      if (!conv) {
        // Generate the ID client-side so we don't need RETURNING on this
        // insert. Asking Postgres to return the new row here would trigger
        // the SELECT policy too, which requires being a participant — but
        // we aren't one yet at this exact moment, causing a false 42501.
        const newConversationId = crypto.randomUUID();

        const { error: insertError } = await supabase
          .from("conversations")
          .insert({
            id: newConversationId,
            is_group: true,
            name: `group:${groupId}`,
          });

        if (insertError) {
          console.error("CONVERSATION INSERT ERROR:", insertError);
          setChatError(true);
          setLoadingChat(false);
          return;
        }

        const { error: partError } = await supabase
          .from("conversation_participants")
          .insert({
            conversation_id: newConversationId,
            user_id: session.user.id,
          });

        if (partError) {
          console.error("PARTICIPANT INSERT ERROR:", partError);
          setChatError(true);
          setLoadingChat(false);
          return;
        }

        // Now that we're a recognized participant, this SELECT passes RLS
        const { data: fetchedConv } = await supabase
          .from("conversations")
          .select("id")
          .eq("id", newConversationId)
          .single();

        conv = fetchedConv;
      } else {
        // Existing conversation — make sure we're registered as a participant
        await supabase
          .from("conversation_participants")
          .upsert({ conversation_id: conv.id, user_id: session.user.id });
      }

      if (!conv) {
        setChatError(true);
        setLoadingChat(false);
        return;
      }

      setConversationId(conv.id);

      const { data: msgs } = await supabase
        .from("messages")
        .select(
          "id, content, created_at, sender_id, profiles:sender_id(username, avatar_url)",
        )
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: true })
        .limit(100);

      setMessages(((msgs as RawMessage[] | null) ?? []).map(normalizeMessage));
      setLoadingChat(false);
    }

    init();
  }, [groupId]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select(
              "id, content, created_at, sender_id, profiles:sender_id(username, avatar_url)",
            )
            .eq("id", payload.new.id)
            .single();
          if (data)
            setMessages((m) => [...m, normalizeMessage(data as RawMessage)]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || !conversationId || !userId) return;
    setSending(true);

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: input.trim(),
    });

    if (error) {
      console.error("SEND ERROR:", error);
    } else {
      setInput("");
    }

    setSending(false);
    inputRef.current?.focus();
  }

  const canSend = !sending && !!input.trim() && !!conversationId && !!userId;

  return (
    <section className="max-w-3xl mx-auto px-6 py-8 md:py-12 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <Link
          href={`/community/${groupId}`}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors shrink-0"
        >
          <ArrowLeft size={17} strokeWidth={2} />
        </Link>
        <div className="min-w-0">
          <h1 className="font-heading font-semibold text-lg tracking-tight leading-tight truncate">
            Circle chat
          </h1>
          {conversationId && (
            <p className="text-xs text-[var(--color-ink)]/40">
              {loadingChat ? "Connecting…" : "Live"}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4 px-1">
        {loadingChat && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--color-ink)]/40">
            <Loader2 size={20} strokeWidth={2} className="animate-spin" />
            <p className="text-sm">Setting up this chat…</p>
          </div>
        )}

        {!loadingChat && chatError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-8">
            <p className="text-sm text-[var(--color-ink)]/60 font-medium">
              Couldn't load this chat
            </p>
            <p className="text-xs text-[var(--color-ink)]/40">
              Make sure you're signed in and a member of this circle, then try
              again.
            </p>
          </div>
        )}

        {!loadingChat && !chatError && messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[var(--color-ink)]/40 text-center">
              No messages yet — say something.
            </p>
          </div>
        )}

        {!loadingChat &&
          !chatError &&
          messages.map((msg, i) => {
            const isMe = msg.sender_id === userId;
            const initials =
              msg.profiles?.username?.slice(0, 2).toUpperCase() ?? "?";
            const prev = messages[i - 1];
            const sameSenderAsPrev = prev?.sender_id === msg.sender_id;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : ""} ${
                  sameSenderAsPrev ? "mt-0" : "mt-2"
                }`}
              >
                {!isMe && (
                  <Avatar
                    className={`w-7 h-7 shrink-0 ${sameSenderAsPrev ? "opacity-0" : ""}`}
                  >
                    <AvatarImage src={msg.profiles?.avatar_url ?? ""} />
                    <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
                >
                  {!isMe && !sameSenderAsPrev && (
                    <span className="text-xs text-[var(--color-ink)]/40 px-1">
                      {msg.profiles?.username}
                    </span>
                  )}
                  <div
                    className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-[var(--color-ink)] text-[var(--color-paper)] rounded-br-sm"
                          : "bg-black/5 text-[var(--color-ink)] rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-[var(--color-ink)]/30 shrink-0 pb-0.5">
                      {formatTime(msg.created_at)}
                    </span>
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
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={loadingChat ? "Connecting…" : "Type a message…"}
          disabled={loadingChat || chatError}
          className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] flex items-center justify-center hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {sending ? (
            <Loader2 size={15} strokeWidth={2} className="animate-spin" />
          ) : (
            <Send size={15} strokeWidth={2} />
          )}
        </button>
      </div>
    </section>
  );
}
