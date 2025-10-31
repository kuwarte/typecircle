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

  const visibleMessages = oldMessages.concat(
    realtimeMessages,
    sentMessages.filter((m) => !realtimeMessages.find((rm) => rm.id === m.id))
  );

  return (
    <div className="container mx-auto h-screen-with-header border border-y-0 flex flex-col max-w-200 border-none">
      <div className="flex items-center justify-between gap-2 p-4 bg-card/50 mt-2 mx-2 rounded-md outline outline-card-border">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{room.name}</h1>
          <p className="text-muted-foreground text-sm italic rounded-md px-2 inline-flex items-center gap-1">
            <FaCircle size={12} color={connectedUsers > 1 ? "green" : "gray"} />
            {connectedUsers} {connectedUsers === 1 ? "user" : "users"} online
          </p>
        </div>
        <InviteUserModal roomId={room.id} />
      </div>
      <div
        className="grow overflow-y-auto flex flex-col-reverse"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        <div className="px-4">
          {status === "loading" && (
            <p className="text-center text-sm text-muted-foreground py-2">
              Loading more messages...
            </p>
          )}
          {status === "error" && (
            <div className="text-center">
              <p className="text-sm text-destructive py-2">
                Error loading messages.
              </p>
              <Button onClick={loadMoreMessages} variant="outline">
                Retry
              </Button>
            </div>
          )}
          {visibleMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              {...message}
              ref={index === 0 && status === "idle" ? triggerQueryRef : null}
            />
          ))}
        </div>
      </div>
      <ChatInput
        roomId={room.id}
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
  );
}
function useRealtimeChat({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;

      const presenceChannel = supabase.channel(`room:${roomId}:presence`, {
        config: { presence: { key: userId } },
      });

      presenceChannel
        .on("presence", { event: "sync" }, () => {
          setConnectedUsers(
            Object.keys(presenceChannel.presenceState()).length
          );
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") presenceChannel.track({ userId });
        });

      const messageChannel = supabase.channel(`room:${roomId}:messages`);

      messageChannel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
          filter: `chat_room_id=eq.${roomId}`,
        },
        (payload) => {
          const record = payload.new;
          setMessages((prev) => [
            ...prev,
            {
              id: record.id,
              text: record.text,
              created_at: record.created_at,
              author_id: record.author_id,
              author: {
                name:
                  record.author_name ?? `user_${record.author_id.slice(0, 8)}`,
                image_url: record.author_image_url,
              },
            },
            // prepend for flex-col-reverse
          ]);
        }
      );

      messageChannel.subscribe((status) =>
        console.log("Message channel status:", status)
      );

      return () => {
        supabase.removeChannel(presenceChannel);
        supabase.removeChannel(messageChannel);
      };
    });
  }, [roomId, userId]);

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
