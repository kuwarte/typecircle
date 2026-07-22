"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Member = {
  user_id: string;
  role: string;
  username?: string | null;
};

export default function MemberControls({
  groupId,
  member,
}: {
  groupId: string;
  member: Member;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function callAction(action: "promote" | "demote" | "kick") {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/groups/${groupId}/members/${member.user_id}/${action}`,
        {
          method: "POST",
          credentials: "same-origin",
        },
      );
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  function handleKick() {
    if (
      !confirm(`Remove ${member.username ?? "this member"} from this circle?`)
    )
      return;
    callAction("kick");
  }

  return (
    <div className="flex items-center gap-1.5">
      {member.role === "member" ? (
        <button
          onClick={() => callAction("promote")}
          disabled={busy}
          className="rounded-full border border-[var(--color-ink)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-ink)]/62 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors disabled:opacity-40"
        >
          Promote
        </button>
      ) : (
        <button
          onClick={() => callAction("demote")}
          disabled={busy}
          className="rounded-full border border-[var(--color-ink)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-ink)]/62 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors disabled:opacity-40"
        >
          Demote
        </button>
      )}
      <button
        onClick={handleKick}
        disabled={busy}
        className="rounded-full border border-[var(--color-ink)]/10 px-2.5 py-1 text-xs font-semibold text-red-500/80 hover:border-red-400/40 hover:text-red-600 transition-colors disabled:opacity-40"
      >
        Kick
      </button>
    </div>
  );
}
