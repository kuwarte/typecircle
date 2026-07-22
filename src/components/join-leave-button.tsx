"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinLeaveButton({
  initialJoined,
  groupId,
}: {
  initialJoined: boolean;
  groupId: string;
}) {
  const router = useRouter();
  const [joined, setJoined] = useState<boolean>(initialJoined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setError(null);
    const next = !joined;
    setJoined(next);
    setBusy(true);
    try {
      const res = await fetch(
        `/api/groups/${groupId}/${next ? "join" : "leave"}`,
        {
          method: "POST",
          credentials: "same-origin",
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to ${next ? "join" : "leave"}`);
      }
      router.refresh(); // re-run the server component so isMember/isAdmin,
      // the chat link, and GroupSettings pick up the change
    } catch (e: any) {
      setJoined(!next); // rollback
      setError(e?.message ?? "An error occurred");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        onClick={toggle}
        disabled={busy}
        className={
          joined
            ? "rounded-full bg-white border border-black/10 text-[var(--color-ink)] px-5 py-2 text-sm font-medium hover:bg-black/5 transition-colors"
            : "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-5 py-2 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors"
        }
      >
        {busy ? "Processing…" : joined ? "Leave circle" : "Join circle"}
      </button>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
