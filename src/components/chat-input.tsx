"use client";

import { SendIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Message, sendMessage } from "@/services/supabase/actions/messages";

type Props = {
  roomId: string;
  onSend: (message: { id: string; text: string }) => void;
  onSuccessfulSend: (message: Message) => void;
  onErrorSend: (id: string) => void;
};

export function ChatInput({
  roomId,
  onSend,
  onSuccessfulSend,
  onErrorSend,
}: Props) {
  const [message, setMessage] = useState("");

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const text = message.trim();
    if (!text) return;

    setMessage("");
    const id = crypto.randomUUID();
    onSend({ id, text });
    const result = await sendMessage({ id, text, roomId });
    console.log("sendMessage result:", result);
    if (result.error) {
      toast.error(result.message);
      onErrorSend(id);
    } else {
      onSuccessfulSend(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <InputGroup>
        <InputGroupTextarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field-sizing-content min-h-auto bg-background text-foreground rounded-md resize-none focus:ring-2 focus:ring-ring focus:border-ring/50 dark:bg-input/30 dark:border-input dark:focus:ring-ring/40 dark:focus:border-ring/40"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            aria-label="Send"
            title="Send"
            size="icon-sm"
          >
            <SendIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
