"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { InviteUserModal } from "@/components/invite-user-modal";
import { Button } from "@/components/ui/button";
import { Message } from "@/services/supabase/actions/messages";
import { createClient } from "@/services/supabase/client";
import { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";

export function RoomClient({
  room,
  user,
  messages,
}: {
  user: {
    id: string;
    name: string;
    image_url: string | null;
  };
  room: {
    id: string;
    name: string;
  };
  messages: Message[];
}) {
  const { connectedUsers, messages: realtimeMessages } = useRealtimeChat({
    roomId: room.id,
    userId: user.id,
  });
  const {
    loadMoreMessages,
    messages: oldMessages,
    status,
    triggerQueryRef,
  } = useInfiniteScrollChat({
    roomId: room.id,
    startingMessages: messages.toReversed(),
  });
  const [sentMessages, setSentMessages] = useState<
    (Message & { status: "pending" | "error" | "success" })[]
  >([]);
  const [replyTo, setReplyTo] = useState<{
    id: string;
    author: string;
    text: string;
  } | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const visibleMessages = oldMessages.concat(
    realtimeMessages,
    sentMessages.filter((m) => !realtimeMessages.find((rm) => rm.id === m.id))
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="glass-navbar border-b border-border px-4 sm:px-6 py-3 sm:py-4 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground capitalize truncate">
              {room.name}
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <FaCircle
                size={6}
                className={`${
                  connectedUsers > 1 ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {connectedUsers} {connectedUsers === 1 ? "user" : "users"}{" "}
                online
              </span>
            </div>
          </div>
          <div className="ml-2">
            <InviteUserModal roomId={room.id} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-3 sm:px-6">
          <div
            className="h-full overflow-y-auto flex flex-col-reverse py-3 sm:py-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--border) transparent",
            }}
          >
            <div className="space-y-3 sm:space-y-4">
              {status === "loading" && (
                <div className="text-center py-4">
                  <div className="glass-subtle rounded-xl px-4 py-2 inline-block">
                    <p className="text-sm text-muted-foreground">
                      Loading more messages...
                    </p>
                  </div>
                </div>
              )}
              {status === "error" && (
                <div className="text-center py-4">
                  <div className="glass-subtle rounded-xl p-4 inline-block">
                    <p className="text-sm text-destructive mb-2">
                      Error loading messages.
                    </p>
                    <Button
                      onClick={loadMoreMessages}
                      variant="outline"
                      size="sm"
                      className="glass-button"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}
              {visibleMessages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  {...message}
                  ref={
                    index === 0 && status === "idle" ? triggerQueryRef : null
                  }
                  onReply={(msg) =>
                    setReplyTo({
                      id: msg.id,
                      author: msg.author?.name || "User",
                      text: msg.text,
                    })
                  }
                />
              ))}

              {typingUsers.length > 0 && (
                <div className="px-4 py-2">
                  <div className="glass-subtle rounded-xl px-4 py-2 inline-block">
                    <span className="text-sm text-muted-foreground">
                      {typingUsers.join(", ")}{" "}
                      {typingUsers.length === 1 ? "is" : "are"} typing...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {room.id !== "3fc9aa8a-81b7-4a60-92ce-066dcd9baa45" && (
        <div className="glass-navbar border-t border-border px-3 sm:px-6 py-3 sm:py-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              roomId={room.id}
              replyTo={replyTo}
              onClearReply={() => setReplyTo(null)}
              onTyping={(isTyping) => {
                console.log("User typing:", isTyping);
              }}
              onSend={(message) => {
                setSentMessages((prev) => [
                  ...prev,
                  {
                    id: message.id,
                    text: message.text,
                    created_at: new Date().toISOString(),
                    author_id: user.id,
                    author: {
                      name: user.name,
                      image_url: user.image_url,
                    },
                    status: "pending",
                  },
                ]);
              }}
              onSuccessfulSend={(message) => {
                setSentMessages((prev) =>
                  prev.map((m) =>
                    m.id === message.id ? { ...message, status: "success" } : m
                  )
                );
              }}
              onErrorSend={(id) => {
                setSentMessages((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, status: "error" } : m))
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function useRealtimeChat({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  useEffect(() => {
    let presenceChannel: ReturnType<typeof supabase.channel> | null = null;
    let messageChannel: ReturnType<typeof supabase.channel> | null = null;
    let profileChannel: ReturnType<typeof supabase.channel> | null = null;
    let reactionsChannel: ReturnType<typeof supabase.channel> | null = null;

    async function setupRealtime() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      presenceChannel = supabase.channel(`room:${roomId}:presence`, {
        config: { presence: { key: userId } },
      });

      presenceChannel
        .on("presence", { event: "sync" }, () => {
          setConnectedUsers(
            Object.keys(presenceChannel!.presenceState()).length
          );
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            presenceChannel!.track({ userId });
          }
        });

      messageChannel = supabase.channel(`room:${roomId}:messages`);

      messageChannel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
          filter: `chat_room_id=eq.${roomId}`,
        },
        async (payload) => {
          const record = payload.new;

          const { data: authorData } = await supabase
            .from("user_profile")
            .select("name, image_url, enneagram_type")
            .eq("id", record.author_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              id: record.id,
              text: record.text,
              created_at: record.created_at,
              author_id: record.author_id,
              reply_to: record.reply_to,
              author: {
                name:
                  authorData?.name ?? `user_${record.author_id.slice(0, 8)}`,
                image_url: authorData?.image_url ?? null,
                enneagram_type: authorData?.enneagram_type ?? null,
              },
            },
          ]);
        }
      );

      messageChannel.subscribe((status) =>
        console.log("Message channel status:", status)
      );

      profileChannel = supabase.channel(`profiles:updates`);

      profileChannel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_profile",
        },
        (payload) => {
          const updatedProfile = payload.new;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.author_id === updatedProfile.id
                ? {
                    ...msg,
                    author: {
                      name: updatedProfile.name,
                      image_url: updatedProfile.image_url,
                    },
                  }
                : msg
            )
          );
        }
      );

      profileChannel.subscribe();
      reactionsChannel = supabase.channel(`reactions:${roomId}`);

      (reactionsChannel as any).on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
        },
        (payload: any) => {
          console.log("Reaction change:", payload);
        }
      );

      reactionsChannel.subscribe();
    }

    setupRealtime();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        console.log("Realtime: user signed in, reconnecting...");
        setupRealtime();
      }
    });

    return () => {
      if (presenceChannel) supabase.removeChannel(presenceChannel);
      if (messageChannel) supabase.removeChannel(messageChannel);
      if (profileChannel) supabase.removeChannel(profileChannel);
      if (reactionsChannel) supabase.removeChannel(reactionsChannel);
      listener.subscription.unsubscribe();
    };
  }, [roomId, userId, supabase]);

  return { connectedUsers, messages };
}

const LIMIT = 25;
function useInfiniteScrollChat({
  startingMessages,
  roomId,
}: {
  startingMessages: Message[];
  roomId: string;
}) {
  const [messages, setMessages] = useState<Message[]>(startingMessages);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    startingMessages.length === 0 ? "done" : "idle"
  );

  async function loadMoreMessages() {
    if (status === "done" || status === "loading") return;
    const supabase = createClient();
    setStatus("loading");

    const { data, error } = await supabase
      .from("message")
      .select(
        "id, text, created_at, author_id, author:user_profile (name, image_url)"
      )
      .eq("chat_room_id", roomId)
      .lt("created_at", messages[0].created_at)
      .order("created_at", { ascending: false })
      .limit(LIMIT);

    if (error) {
      setStatus("error");
      return;
    }

    setMessages((prev) => [...data.toReversed(), ...prev]);
    setStatus(data.length < LIMIT ? "done" : "idle");
  }

  function triggerQueryRef(node: HTMLDivElement | null) {
    if (node == null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === node) {
            observer.unobserve(node);
            loadMoreMessages();
          }
        });
      },
      {
        rootMargin: "50px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }

  return { loadMoreMessages, messages, status, triggerQueryRef };
}
