// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/services/supabase/client";
// import { Message } from "@/services/supabase/actions/messages";

// export function useGlobalNotifications(userId: string) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const supabase = createClient();

//   useEffect(() => {
//     type Payload = { new: Message & { chat_room_id: string } };

//     const channel = supabase
//       .channel("public:message")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "message" },
//         (payload: Payload) => {
//           setMessages((prev) => [...prev, payload.new]);
//         }
//       );

//     channel.subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [userId, supabase]);

//   return messages;
// }
