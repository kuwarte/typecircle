import { createClient } from "@/services/supabase/server";
import Link from "next/link";
import { Users } from "lucide-react";

export default async function CommunityPage() {
  const supabase = await createClient();

  const [{ data: groups }, { data: types }] = await Promise.all([
    supabase
      .from("groups")
      .select(`id, name, topic, created_at, group_memberships(count)`)
      .order("created_at", { ascending: false }),
    supabase.from("enneagram_types").select("id, name, color_hex").order("id"),
  ]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-heading font-bold text-4xl tracking-tight">Community</h1>
          <p className="mt-2 text-[var(--color-ink)]/55 text-sm max-w-md">
            Find circles matched by type — go deeper with people who share yours, or challenge how you think.
          </p>
        </div>
        <Link
          href="/community/new"
          className="rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors whitespace-nowrap self-start md:self-auto"
        >
          + Create circle
        </Link>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/community"
          className="rounded-full border border-[var(--color-ink)]/20 px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink)]/60 hover:border-[var(--color-ink)]/40 transition-colors"
        >
          All
        </Link>
        {types?.map((t) => (
          <Link
            key={t.id}
            href={`/community?type=${t.id}`}
            className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{ borderColor: t.color_hex + "60", color: t.color_hex }}
          >
            Type {t.id}
          </Link>
        ))}
      </div>

      {/* Groups grid */}
      {(!groups || groups.length === 0) ? (
        <div className="rounded-2xl border border-black/5 px-8 py-16 text-center">
          <p className="text-[var(--color-ink)]/40 text-sm">No circles yet — be the first to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => {
            const memberCount = (g.group_memberships as unknown as { count: number }[])?.[0]?.count ?? 0;
            return (
              <Link
                key={g.id}
                href={`/community/${g.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-black/5 bg-[var(--color-paper)] p-6 hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.08)] transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] flex items-center justify-center">
                  <Users size={18} strokeWidth={2} className="text-[var(--color-paper)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-base tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
                    {g.name}
                  </h3>
                  {g.topic && (
                    <p className="mt-1 text-sm text-[var(--color-ink)]/55 line-clamp-2">{g.topic}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink)]/40">
                  <Users size={12} strokeWidth={2} />
                  {memberCount} {memberCount === 1 ? "member" : "members"}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
