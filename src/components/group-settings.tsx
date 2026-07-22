"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

export default function GroupSettings({
  groupId,
  initialName,
  initialTopic,
  isAdmin,
}: {
  groupId: string;
  initialName: string;
  initialTopic?: string | null;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [topic, setTopic] = useState(initialTopic ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin) return null;

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/groups/${groupId}/settings`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, topic }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to save");
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((state) => !state)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ink)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-ink)]/62 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors"
      >
        <Settings size={13} strokeWidth={2.25} />
        Edit circle
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-paper)] p-4 shadow-[8px_8px_0_0_rgba(0,0,0,0.10)]">
          <label className="block text-xs font-semibold text-[var(--color-ink)]/55">
            Circle name
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--color-ink)]/12 bg-white/55 px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />

          <label className="mt-3 block text-xs font-semibold text-[var(--color-ink)]/55">
            Topic
          </label>
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--color-ink)]/12 bg-white/55 px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
          />

          {error && (
            <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
          )}

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-[var(--color-ink)]/55 hover:text-[var(--color-ink)]/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={busy || !name.trim()}
              className="rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-3.5 py-1.5 text-xs font-semibold hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-40"
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
