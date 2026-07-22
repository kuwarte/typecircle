"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { createClient } from "@/services/supabase/client";

export default function NewCommunityPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const { data: group, error: createError } = await supabase
      .from("groups")
      .insert({
        name: name.trim(),
        topic: topic.trim() || null,
        created_by: session.user.id,
      })
      .select("id")
      .single();

    if (createError) {
      setError(createError.message);
      setSaving(false);
      return;
    }

    await supabase.from("group_memberships").insert({
      group_id: group.id,
      user_id: session.user.id,
    });

    router.push(`/community/${group.id}`);
  }

  return (
    <main className="max-w-2xl mx-auto px-6 pt-10 pb-16 md:pb-24">
      <Link
        href="/community"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)]/55 hover:text-[var(--color-accent)] transition-colors mb-6"
      >
        <ArrowLeft size={16} strokeWidth={2.25} />
        Community
      </Link>

      {/* Header — plain, no card, no giant decorative icon */}
      <div className="mb-10">
        <h1 className="font-heading font-semibold text-3xl md:text-5xl leading-[1.05] tracking-tight">
          Create Community
        </h1>
        <p className="mt-4 text-[var(--color-ink)]/62 text-base md:text-lg">
          Create a small group around a type, shared pattern, question, or
          growth edge.
        </p>
      </div>

      {/* Form — plain bordered fields, same language as the rest of the site */}
      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/40">
            Circle name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Type 4 deep dive"
            className="rounded-2xl border border-[var(--color-ink)]/12 bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/32 outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/40">
            Topic
          </span>
          <textarea
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            rows={5}
            placeholder="What should people talk through here?"
            className="rounded-2xl border border-[var(--color-ink)]/12 bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/32 outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
          />
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={saving || !name.trim()}
          className="self-start inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-6 py-3 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-50"
          type="button"
        >
          <Plus size={16} strokeWidth={2.25} />
          {saving ? "Creating..." : "Create circle"}
        </button>
      </div>
    </main>
  );
}
