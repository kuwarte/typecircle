"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/services/supabase/client";
import Link from "next/link";

export default function NewCommunityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    const { data: group, error: err } = await supabase
      .from("groups")
      .insert({ name: name.trim(), topic: topic.trim() || null, created_by: session.user.id })
      .select("id")
      .single();

    if (err) { setError(err.message); setSaving(false); return; }

    // Auto-join as creator
    await supabase.from("group_memberships").insert({ group_id: group.id, user_id: session.user.id });

    router.push(`/community/${group.id}`);
  }

  return (
    <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] text-[var(--color-paper)] p-8 md:p-14 min-h-[420px] flex flex-col justify-between gap-10">
        <div>
          <Link href="/community" className="text-xs text-[var(--color-paper)]/40 hover:text-[var(--color-paper)]/60 transition-colors block mb-6">
            ← Community
          </Link>
          <h1 className="font-heading font-semibold text-4xl md:text-5xl leading-[1.1] tracking-tight mb-2">
            Create a circle
          </h1>
          <p className="text-[var(--color-paper)]/55 text-sm max-w-sm">
            A circle is a small group matched around a type, topic, or shared pattern.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/40">
              Circle name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Type 4 deep dive"
              className="rounded-xl border border-[var(--color-paper)]/10 bg-[var(--color-paper)]/5 px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/25 outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/40">
              Topic <span className="normal-case font-normal text-[var(--color-paper)]/25">(optional)</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="What's this circle about?"
              className="rounded-xl border border-[var(--color-paper)]/10 bg-[var(--color-paper)]/5 px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/25 outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleCreate}
            disabled={saving || !name.trim()}
            className="self-start rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-7 py-3 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create circle"}
          </button>
        </div>
      </div>
    </section>
  );
}
