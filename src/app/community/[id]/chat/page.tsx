// src/app/community/[id]/chat/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Loader2,
  Heart,
  Reply as ReplyIcon,
  MoreHorizontal,
  EyeOff,
  Trash2,
  MessagesSquare,
} from "lucide-react";
import { use } from "react";

type Profile = {
  username: string;
  avatar_url: string | null;
};

type Reaction = {
  emoji: string;
  user_id: string;
};

type RawReply = {
  id: string;
  content: string;
  sender_id: string;
  profiles: Profile[] | Profile | null;
};

type RawMessage = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  reply_to_id?: string | null;
  reply_to?: RawReply | RawReply[] | null;
  message_reactions?: Reaction[] | null;
  profiles: Profile[] | Profile | null;
};

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: Profile | null;
  replyTo?: {
    id: string;
    content: string;
    sender_id: string;
    profiles: Profile | null;
  } | null;
  reactions: Reaction[];
};

type RealtimeRow = {
  id?: string;
  message_id?: string;
  sender_id?: string;
  user_id?: string;
};

type RealtimePayload = {
  new?: RealtimeRow | null;
  old?: RealtimeRow | null;
  eventType?: string;
};

const HEART_REACTION = "heart";

function normalizeMessage(raw: RawMessage): Message {
  let profile: Profile | null = null;
  if (!raw.profiles) profile = null;
  else if (Array.isArray(raw.profiles)) profile = raw.profiles[0] ?? null;
  else profile = raw.profiles as Profile;

  let replyTo = null;
  if (raw.reply_to) {
    const reply = Array.isArray(raw.reply_to) ? raw.reply_to[0] : raw.reply_to;
    const replyProfiles = reply?.profiles;
    let replyProfile: Profile | null = null;
    if (!replyProfiles) replyProfile = null;
    else if (Array.isArray(replyProfiles))
      replyProfile = replyProfiles[0] ?? null;
    else replyProfile = replyProfiles as Profile;

    if (reply) {
      replyTo = {
        id: reply.id,
        content: reply.content,
        sender_id: reply.sender_id,
        profiles: replyProfile,
      };
    }
  }

  return {
    id: raw.id,
    content: raw.content,
    created_at: raw.created_at,
    sender_id: raw.sender_id,
    profiles: profile,
    replyTo,
    reactions: raw.message_reactions ?? [],
  };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}

export default function GroupChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = use(params);
  const supabase = useMemo(() => createClient(), []);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [poppingId, setPoppingId] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState(true);
  const [chatError, setChatError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [sending, setSending] = useState(false);
  const [typingFeedback, setTypingFeedback] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const userIdRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prevLastMessageId = useRef<string | null>(null);
  const hasScrolledInitially = useRef(false);

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

      const { data: groupRow } = await supabase
        .from("groups")
        .select("name")
        .eq("id", groupId)
        .maybeSingle();

      if (groupRow?.name) setGroupName(groupRow.name);

      let { data: conv } = await supabase
        .from("conversations")
        .select("id")
        .eq("name", `group:${groupId}`)
        .eq("is_group", true)
        .maybeSingle();

      if (!conv) {
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
          .upsert(
            {
              conversation_id: newConversationId,
              user_id: session.user.id,
            },
            {
              onConflict: "conversation_id,user_id",
              ignoreDuplicates: true,
            },
          );

        if (partError && partError.code !== "23505") {
          console.error("PARTICIPANT INSERT ERROR:", partError);
          setChatError(true);
          setLoadingChat(false);
          return;
        }

        const { data: fetchedConv } = await supabase
          .from("conversations")
          .select("id")
          .eq("id", newConversationId)
          .single();

        conv = fetchedConv;
      } else {
        const { error: partError } = await supabase
          .from("conversation_participants")
          .upsert(
            { conversation_id: conv.id, user_id: session.user.id },
            {
              onConflict: "conversation_id,user_id",
              ignoreDuplicates: true,
            },
          );
        if (partError && partError.code !== "23505") {
          console.error("PARTICIPANT INSERT ERROR:", partError);
          setChatError(true);
          setLoadingChat(false);
          return;
        }
      }

      if (!conv) {
        setChatError(true);
        setLoadingChat(false);
        return;
      }

      setConversationId(conv.id);

      const PAGE_SIZE = 40;

      const { data: msgs } = await supabase
        .from("messages")
        .select(
          `id, content, created_at, sender_id, reply_to_id, reply_to:reply_to_id(id, content, sender_id, profiles:sender_id(username, avatar_url)), message_reactions:message_reactions(emoji, user_id), profiles:sender_id(username, avatar_url)`,
        )
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      const rawMessages = (msgs as RawMessage[] | null) ?? [];
      const list = rawMessages.map(normalizeMessage).reverse();
      setMessages(list);
      setHasMore(rawMessages.length === PAGE_SIZE);
      setLoadingChat(false);
      setConversationId(conv.id);
    }

    init();
  }, [groupId, supabase]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (!openMenuId) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenuId]);

  const fetchMessageById = useCallback(
    async (messageId: string) => {
      const { data } = await supabase
        .from("messages")
        .select(
          `id, content, created_at, sender_id, reply_to_id, reply_to:reply_to_id(id, content, sender_id, profiles:sender_id(username, avatar_url)), message_reactions:message_reactions(emoji, user_id), profiles:sender_id(username, avatar_url)`,
        )
        .eq("id", messageId)
        .maybeSingle();

      if (!data) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        return null;
      }

      return normalizeMessage(data as RawMessage);
    },
    [supabase],
  );

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase.channel(`chat:${conversationId}`);

    const handleMessageChange = async (payload: RealtimePayload) => {
      if (!payload.new?.id && !payload.old?.id) return;
      const messageId = payload.new?.id ?? payload.old?.id;
      if (!messageId) return;
      const { data } = await supabase
        .from("messages")
        .select(
          `id, content, created_at, sender_id, reply_to_id, reply_to:reply_to_id(id, content, sender_id, profiles:sender_id(username, avatar_url)), message_reactions:message_reactions(emoji, user_id), profiles:sender_id(username, avatar_url)`,
        )
        .eq("id", messageId)
        .maybeSingle();

      if (!data) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        return;
      }

      const normalized = normalizeMessage(data as RawMessage);
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === messageId);
        return exists
          ? prev.map((msg) => (msg.id === messageId ? normalized : msg))
          : [...prev, normalized];
      });

      if (
        payload.eventType === "INSERT" &&
        payload.new?.sender_id !== userIdRef.current
      ) {
        setTypingFeedback(true);
        if (typingTimeoutRef.current)
          window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = window.setTimeout(() => {
          setTypingFeedback(false);
        }, 1200);
      }
    };

    const handleReactionChange = async (payload: RealtimePayload) => {
      const messageId = payload.new?.message_id ?? payload.old?.message_id;
      if (!messageId) return;
      const updated = await fetchMessageById(messageId);
      if (!updated) return;
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? updated : msg)),
      );
    };

    const handleHiddenChange = (payload: RealtimePayload) => {
      const messageId = payload.new?.message_id ?? payload.old?.message_id;
      if (!messageId || payload.new?.user_id !== userIdRef.current) return;
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    };

    const subscription = channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => handleMessageChange(payload),
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => handleMessageChange(payload),
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const messageId = payload.old?.id;
          if (!messageId) return;
          setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_reactions" },
        (payload) => handleReactionChange(payload),
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "message_reactions" },
        (payload) => handleReactionChange(payload),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_hidden" },
        (payload) => handleHiddenChange(payload),
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setLoadingChat(false);
        }
      });

    return () => {
      if (typingTimeoutRef.current)
        window.clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessageById, supabase]);

  useEffect(() => {
    const lastId = messages[messages.length - 1]?.id ?? null;
    if (!lastId) return;
    const container = containerRef.current;
    if (!container) return;

    if (!hasScrolledInitially.current) {
      container.scrollTop = container.scrollHeight;
      hasScrolledInitially.current = true;
      prevLastMessageId.current = lastId;
      return;
    }

    if (prevLastMessageId.current !== lastId) {
      prevLastMessageId.current = lastId;
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  async function loadOlder() {
    if (!conversationId || loadingOlder || !hasMore) return;
    setLoadingOlder(true);
    const container = containerRef.current;
    if (!container) return;
    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;

    const earliest = messages[0];
    if (!earliest) {
      setLoadingOlder(false);
      return;
    }

    const PAGE_SIZE = 40;
    const { data: older } = await supabase
      .from("messages")
      .select(
        `id, content, created_at, sender_id, reply_to_id, reply_to:reply_to_id(id, content, sender_id, profiles:sender_id(username, avatar_url)), message_reactions:message_reactions(emoji, user_id), profiles:sender_id(username, avatar_url)`,
      )
      .eq("conversation_id", conversationId)
      .lt("created_at", earliest.created_at)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    const olderList = ((older as RawMessage[] | null) ?? [])
      .map(normalizeMessage)
      .reverse();
    if (olderList.length === 0) {
      setHasMore(false);
    } else {
      setMessages((prev) => [...olderList, ...prev]);
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          newScrollHeight - prevScrollHeight + prevScrollTop;
      }, 50);
    }

    setLoadingOlder(false);
  }

  async function handleAddReaction(messageId: string) {
    if (!userId) return;
    const emoji = HEART_REACTION;
    const current = messagesRef.current.find((msg) => msg.id === messageId);
    const hasReacted = current?.reactions.some(
      (reaction) => reaction.user_id === userId && reaction.emoji === emoji,
    );

    // Optimistic update: reflect the toggle instantly, reconcile with the
    // server after, and roll back if the write fails.
    if (hasReacted) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: msg.reactions.filter(
                  (r) => !(r.user_id === userId && r.emoji === emoji),
                ),
              }
            : msg,
        ),
      );

      const { error } = await supabase
        .from("message_reactions")
        .delete()
        .match({ message_id: messageId, user_id: userId, emoji });

      if (error) {
        console.error("REACTION DELETE ERROR:", {
          message: error.message,
          code: error.code,
          details: error.details,
        });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  reactions: [...msg.reactions, { user_id: userId, emoji }],
                }
              : msg,
          ),
        );
      }
      return;
    }

    setPoppingId(messageId);
    window.setTimeout(() => {
      setPoppingId((id) => (id === messageId ? null : id));
    }, 320);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: [...msg.reactions, { user_id: userId, emoji }],
            }
          : msg,
      ),
    );

    const { error } = await supabase
      .from("message_reactions")
      .upsert(
        { message_id: messageId, user_id: userId, emoji },
        { onConflict: "message_id,user_id,emoji", ignoreDuplicates: true },
      );

    if (error) {
      console.error("REACTION INSERT ERROR:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: msg.reactions.filter(
                  (r) => !(r.user_id === userId && r.emoji === emoji),
                ),
              }
            : msg,
        ),
      );
    }
  }

  async function handleReplyTo(message: Message) {
    setReplyTo(message);
    setOpenMenuId(null);
    inputRef.current?.focus();
  }

  async function handleHideForMe(messageId: string) {
    if (!userId) return;
    setOpenMenuId(null);
    const { error } = await supabase
      .from("message_hidden")
      .upsert(
        { message_id: messageId, user_id: userId },
        { onConflict: "message_id,user_id", ignoreDuplicates: true },
      );
    if (error)
      console.error("HIDE MESSAGE ERROR:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
  }

  async function handleDeleteForEveryone(messageId: string) {
    setOpenMenuId(null);
    const { error } = await supabase
      .from("messages")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", messageId);
    if (error) {
      console.error("DELETE MESSAGE ERROR:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
    }
  }

  async function handleSend() {
    if (!input.trim() || !conversationId || !userId) return;
    setSending(true);

    const messageId = crypto.randomUUID();
    const content = input.trim();
    const createdAt = new Date().toISOString();
    const ownProfile =
      messagesRef.current.find((msg) => msg.sender_id === userId)?.profiles ??
      null;

    const payload = {
      id: messageId,
      conversation_id: conversationId,
      sender_id: userId,
      content,
      ...(replyTo ? { reply_to_id: replyTo.id } : {}),
    };

    const { error } = await supabase.from("messages").insert(payload);

    if (error) {
      console.error("SEND ERROR:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      const sentReply = replyTo
        ? {
            id: replyTo.id,
            content: replyTo.content,
            sender_id: replyTo.sender_id,
            profiles: replyTo.profiles,
          }
        : null;

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === messageId)) return prev;
        return [
          ...prev,
          {
            id: messageId,
            content,
            created_at: createdAt,
            sender_id: userId,
            profiles: ownProfile,
            replyTo: sentReply,
            reactions: [],
          },
        ];
      });
      setInput("");
      setReplyTo(null);
    }

    setSending(false);
    inputRef.current?.focus();
  }

  const canSend = !sending && !!input.trim() && !!conversationId && !!userId;

  return (
    <section className="relative max-w-3xl mx-auto px-4 md:px-6 py-6 flex flex-col h-[100dvh] md:h-[calc(100vh-4rem)] overflow-hidden">
      <style jsx global>{`
        .chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: color-mix(
              in srgb,
              var(--color-accent) 35%,
              transparent
            )
            transparent;
        }
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: color-mix(
            in srgb,
            var(--color-accent) 25%,
            transparent
          );
          border-radius: 999px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background-color: color-mix(
            in srgb,
            var(--color-accent) 45%,
            transparent
          );
        }

        @keyframes heart-pop {
          0% {
            transform: scale(1);
          }
          35% {
            transform: scale(1.35);
          }
          60% {
            transform: scale(0.92);
          }
          100% {
            transform: scale(1);
          }
        }
        .heart-pop {
          animation: heart-pop 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes skeleton-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            100deg,
            color-mix(in srgb, var(--color-ink) 6%, transparent) 30%,
            color-mix(in srgb, var(--color-ink) 12%, transparent) 50%,
            color-mix(in srgb, var(--color-ink) 6%, transparent) 70%
          );
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.6s ease-in-out infinite;
        }

        @keyframes live-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0
              color-mix(in srgb, var(--color-accent) 45%, transparent);
          }
          50% {
            box-shadow: 0 0 0 4px
              color-mix(in srgb, var(--color-accent) 0%, transparent);
          }
        }
        .live-dot {
          animation: live-pulse 2s ease-in-out infinite;
        }

        @keyframes typing-bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-3px);
            opacity: 1;
          }
        }
        .typing-dot {
          animation: typing-bounce 1.1s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes msg-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .msg-in {
          animation: msg-in 0.22s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer,
          .live-dot,
          .typing-dot,
          .msg-in,
          .heart-pop {
            animation: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-[var(--color-ink)]/10 shrink-0">
        <Link
          href={`/community/${groupId}`}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-ink)]/10 text-[var(--color-ink)]/60 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
        >
          <ArrowLeft size={17} strokeWidth={2} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading font-semibold text-xl tracking-tight leading-tight truncate">
            {groupName ?? "Circle chat"}
          </h1>
          <p className="flex items-center gap-1.5 text-xs text-[var(--color-ink)]/40 mt-0.5">
            {loadingChat ? "Connecting…" : "Connected"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 min-h-0">
        {/* Minimal dot-grid texture, scoped to the messages area only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-ink) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div
          ref={containerRef}
          onScroll={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            if (el.scrollTop < 160 && hasMore && !loadingOlder) loadOlder();
          }}
          className="chat-scroll absolute inset-0 overflow-y-auto flex flex-col py-5"
        >
          {loadingOlder && (
            <div className="flex justify-center pb-3">
              <Loader2
                size={14}
                className="animate-spin text-[var(--color-ink)]/30"
              />
            </div>
          )}

          {loadingChat && (
            <div className="flex-1 flex flex-col gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 ${
                    i % 3 === 0 ? "items-end" : "items-start"
                  }`}
                >
                  <div className="skeleton-shimmer h-2.5 rounded w-16" />
                  <div
                    className="skeleton-shimmer rounded-2xl h-9"
                    style={{ width: `${45 + ((i * 13) % 30)}%` }}
                  />
                </div>
              ))}
            </div>
          )}

          {!loadingChat && chatError && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
              <div className="w-11 h-11 rounded-full bg-[var(--color-ink)]/5 flex items-center justify-center text-[var(--color-ink)]/30">
                <MessagesSquare size={19} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm text-[var(--color-ink)]/70 font-medium">
                  Could not load this chat
                </p>
                <p className="text-xs text-[var(--color-ink)]/40 mt-1 max-w-[26ch] mx-auto">
                  Make sure you are signed in and a member of this circle, then
                  try again.
                </p>
              </div>
            </div>
          )}

          {!loadingChat && !chatError && messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                <MessagesSquare size={19} strokeWidth={1.75} />
              </div>
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
              const sameSenderAsPrev =
                prev?.sender_id === msg.sender_id &&
                formatDayLabel(prev.created_at) ===
                  formatDayLabel(msg.created_at);
              const showDayDivider =
                !prev ||
                formatDayLabel(prev.created_at) !==
                  formatDayLabel(msg.created_at);

              const reactionCounts = msg.reactions.reduce<
                Record<string, number>
              >((acc, reaction) => {
                acc[reaction.emoji] = (acc[reaction.emoji] ?? 0) + 1;
                return acc;
              }, {});
              const iReacted = msg.reactions.some(
                (r) => r.user_id === userId && r.emoji === HEART_REACTION,
              );

              return (
                <div key={msg.id} className="msg-in">
                  {showDayDivider && (
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-[var(--color-ink)]/8" />
                      <span className="shrink-0 rounded-full bg-[var(--color-ink)]/[0.05] px-3 py-1 text-[11px] font-medium text-[var(--color-ink)]/45">
                        {formatDayLabel(msg.created_at)}
                      </span>
                      <div className="flex-1 h-px bg-[var(--color-ink)]/8" />
                    </div>
                  )}
                  <div
                    className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""} ${
                      sameSenderAsPrev ? "mt-0.5" : "mt-3"
                    }`}
                  >
                    {!isMe && (
                      <Avatar
                        className={`w-6 h-6 shrink-0 rounded-lg border border-[var(--color-ink)]/10 mb-0.5 ${
                          sameSenderAsPrev ? "opacity-0" : ""
                        }`}
                      >
                        <AvatarImage
                          src={msg.profiles?.avatar_url ?? ""}
                          className="rounded-lg"
                        />
                        <AvatarFallback className="rounded-lg bg-[var(--color-accent)] text-[var(--color-paper)] text-[10px] font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`group relative max-w-[75%] flex flex-col gap-1 ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      {!isMe && !sameSenderAsPrev && (
                        <span className="text-xs font-medium text-[var(--color-ink)]/45 px-1">
                          {msg.profiles?.username}
                        </span>
                      )}

                      <div
                        className={`absolute -top-9 ${isMe ? "right-0" : "left-0"} z-10 flex items-center gap-0.5 rounded-full border border-[var(--color-ink)]/10 bg-[var(--color-paper)] px-1 py-1 opacity-0 shadow-md scale-95 origin-bottom transition-all duration-150 group-hover:opacity-100 group-hover:scale-100`}
                      >
                        <button
                          onClick={() => handleAddReaction(msg.id)}
                          className={`p-1.5 rounded-full hover:bg-[var(--color-ink)]/5 transition-colors ${
                            iReacted
                              ? "text-[var(--color-accent)]"
                              : "text-[var(--color-ink)]/50"
                          }`}
                          type="button"
                          aria-label="React"
                        >
                          <Heart
                            size={13}
                            fill={iReacted ? "currentColor" : "none"}
                            className={poppingId === msg.id ? "heart-pop" : ""}
                          />
                        </button>
                        <button
                          onClick={() => handleReplyTo(msg)}
                          className="p-1.5 rounded-full text-[var(--color-ink)]/50 hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-ink)]/80 transition-colors"
                          type="button"
                          aria-label="Reply"
                        >
                          <ReplyIcon size={13} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId((current) =>
                                current === msg.id ? null : msg.id,
                              );
                            }}
                            className="p-1.5 rounded-full text-[var(--color-ink)]/50 hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-ink)]/80 transition-colors"
                            type="button"
                            aria-label="More"
                          >
                            <MoreHorizontal size={13} />
                          </button>
                          {openMenuId === msg.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute top-full mt-1 ${
                                isMe ? "right-0" : "left-0"
                              } w-max min-w-[10rem] max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--color-ink)]/10 bg-[var(--color-paper)] p-1 shadow-lg z-20`}
                            >
                              <button
                                onClick={() => handleHideForMe(msg.id)}
                                className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-ink)]/70 hover:bg-[var(--color-ink)]/5 transition-colors"
                              >
                                <EyeOff size={13} className="shrink-0" /> Hide
                                for me
                              </button>
                              {isMe && (
                                <button
                                  onClick={() =>
                                    handleDeleteForEveryone(msg.id)
                                  }
                                  className="flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-500/8 transition-colors"
                                >
                                  <Trash2 size={13} className="shrink-0" />{" "}
                                  Delete for everyone
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {msg.replyTo && (
                        <div
                          className={`flex items-stretch gap-2 max-w-full px-1 ${
                            isMe ? "flex-row-reverse text-right" : ""
                          }`}
                        >
                          <span className="w-[3px] shrink-0 rounded-full bg-[var(--color-accent)]/40" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium text-[var(--color-accent)]/80 leading-tight">
                              {msg.replyTo.profiles?.username ?? "Reply"}
                            </p>
                            <p className="truncate text-[12px] leading-snug text-[var(--color-ink)]/45">
                              {msg.replyTo.content}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-end gap-1.5">
                        <div
                          onDoubleClick={() => handleAddReaction(msg.id)}
                          className={`px-3.5 py-2 rounded-2xl text-[14px] leading-relaxed cursor-default select-text shadow-sm transition-shadow hover:shadow-md ${
                            isMe
                              ? "bg-[var(--color-accent)] text-[var(--color-paper)] rounded-br-md"
                              : "bg-[var(--color-ink)]/[0.05] text-[var(--color-ink)] rounded-bl-md"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-[var(--color-ink)]/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pb-1 tabular-nums">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>

                      {Object.keys(reactionCounts).length > 0 && (
                        <div className="flex flex-wrap gap-1 px-1">
                          {Object.entries(reactionCounts).map(
                            ([emoji, count]) => (
                              <button
                                key={emoji}
                                onClick={() => handleAddReaction(msg.id)}
                                type="button"
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-all ${
                                  emoji === HEART_REACTION && iReacted
                                    ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/12 text-[var(--color-accent)] font-semibold shadow-sm"
                                    : "border-[var(--color-ink)]/10 bg-[var(--color-paper)] text-[var(--color-ink)]/70 hover:border-[var(--color-ink)]/20"
                                }`}
                              >
                                {emoji === HEART_REACTION ? (
                                  <Heart
                                    size={10}
                                    strokeWidth={2.25}
                                    className={`text-[var(--color-accent)] ${
                                      poppingId === msg.id ? "heart-pop" : ""
                                    }`}
                                    fill="currentColor"
                                  />
                                ) : (
                                  emoji
                                )}
                                {count}
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[var(--color-ink)]/10 pt-4">
        {(replyTo || typingFeedback) && (
          <div className="mb-2.5 border-l-3 border-[var(--color-accent)]/50 bg-[var(--color-ink)]/[0.04] px-4 py-2.5 text-sm text-[var(--color-ink)]">
            {replyTo ? (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    Replying to {replyTo.profiles?.username ?? "message"}
                  </p>
                  <p className="truncate text-[13px] text-[var(--color-ink)]/60">
                    {replyTo.content}
                  </p>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  type="button"
                  className="text-xs font-semibold text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] transition-colors shrink-0"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--color-ink)]/40" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--color-ink)]/40" />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--color-ink)]/40" />
                </span>
                <p className="text-[var(--color-ink)]/50">Someone is typing</p>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={loadingChat ? "Connecting…" : "Type a message…"}
            disabled={loadingChat || chatError}
            className="flex-1 rounded-full border border-[var(--color-ink)]/12 bg-[var(--color-paper)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] flex items-center justify-center hover:bg-[var(--color-accent)]/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 focus-visible:ring-offset-2"
          >
            {sending ? (
              <Loader2 size={15} strokeWidth={2} className="animate-spin" />
            ) : (
              <Send size={15} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
