import { createClient } from "@/services/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Plus, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// Rank is communicated purely by size + background strength — no label text.
// Top 4 get a themed accent background, decreasing in strength; #1 is also
// physically bigger. Everything past #4 is a plain neutral card.
const ACCENT_TIERS = [
  { bg: "bg-[var(--color-accent)]", onDark: true },
  { bg: "bg-[var(--color-accent)]/95", onDark: true },
  { bg: "bg-[var(--color-accent)]/90", onDark: false },
  { bg: "bg-[var(--color-accent)]/85", onDark: false },
];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const query = ((await searchParams)?.q ?? "").trim();

  let groupsQuery = supabase
    .from("groups")
    .select(`id, name, topic, created_at, group_memberships(count)`)
    .order("created_at", { ascending: false });

  if (query) {
    const escapedQuery = query.replaceAll("%", "\\%").replaceAll("_", "\\_");
    groupsQuery = groupsQuery.or(
      `name.ilike.%${escapedQuery}%,topic.ilike.%${escapedQuery}%`,
    );
  }

  const { data: groups } = await groupsQuery;

  const getMemberCount = (group: NonNullable<typeof groups>[number]) =>
    (group.group_memberships as unknown as { count: number }[])?.[0]?.count ??
    0;

  const sortedGroups = groups
    ? [...groups].sort((a, b) => getMemberCount(b) - getMemberCount(a))
    : [];

  return (
    <main>
      {/* Header — title + primary action share a row, search sits on its
          own line below, so the two actions don't compete */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-heading font-semibold text-3xl md:text-5xl leading-[1.05] tracking-tight">
              Communities
            </h1>
          </div>

          <Link
            href="/community/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors shrink-0 w-fit"
          >
            <Plus size={16} strokeWidth={2.25} />
            Create circle
          </Link>
        </div>

        <form
          action="/community"
          className="mt-8 flex items-center gap-3 max-w-xl"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              size={18}
              strokeWidth={2.25}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink)]/38"
            />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search circles by name or topic..."
              className="w-full rounded-full border border-[var(--color-ink)]/12 bg-[var(--color-paper)] pl-11 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full border border-[var(--color-ink)]/12 text-[var(--color-ink)]/50 px-5 py-2.5 text-sm font-semibold hover:border-[var(--color-ink)]/30 hover:text-[var(--color-ink)]/60 transition-colors"
          >
            Search
          </button>
        </form>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        {sortedGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="w-11 h-11 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
              <Users size={19} strokeWidth={1.75} />
            </div>
            <h2 className="font-heading font-semibold text-xl tracking-tight">
              {query ? "No matching circles" : "No circles yet"}
            </h2>
            <p className="text-sm text-[var(--color-ink)]/50 max-w-xs">
              {query
                ? "Try another search, or start a circle with that idea."
                : "Start the first one and give the room a shape."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedGroups.map((group, index) => {
              const memberCount = getMemberCount(group);
              const isBiggest = index === 0;
              const tier = ACCENT_TIERS[index];

              return (
                <Link
                  key={group.id}
                  href={`/community/${group.id}`}
                  className={cn(
                    "group rounded-2xl flex flex-col transition-colors transition-shadow duration-200 hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.40)]",
                    tier
                      ? tier.bg
                      : "border border-[var(--color-ink)]/10 hover:border-[var(--color-accent)]/40",
                    isBiggest
                      ? "sm:col-span-2 px-8 py-9 min-h-[240px]"
                      : "px-6 py-7 min-h-[200px]",
                  )}
                >
                  <div>
                    <h2
                      className={cn(
                        "font-heading font-semibold tracking-tight leading-snug",
                        isBiggest
                          ? "text-3xl md:text-4xl"
                          : "text-xl md:text-2xl",
                        tier
                          ? tier.onDark
                            ? "text-[var(--color-paper)]"
                            : "text-[var(--color-ink)]"
                          : "text-[var(--color-ink)]",
                      )}
                    >
                      {group.name}
                    </h2>
                    {group.topic && (
                      <p
                        className={cn(
                          "mt-2 leading-relaxed",
                          isBiggest ? "text-base max-w-lg" : "text-sm max-w-md",
                          tier
                            ? tier.onDark
                              ? "text-[var(--color-paper)]/70"
                              : "text-[var(--color-ink)]/60"
                            : "text-[var(--color-ink)]/58",
                        )}
                      >
                        {group.topic}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs",
                        tier
                          ? tier.onDark
                            ? "text-[var(--color-paper)]/60"
                            : "text-[var(--color-ink)]/50"
                          : "text-[var(--color-ink)]/45",
                      )}
                    >
                      {memberCount} {memberCount === 1 ? "member" : "members"}
                    </span>
                    <span
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                        tier
                          ? tier.onDark
                            ? "bg-[var(--color-paper)]/15 text-[var(--color-paper)] group-hover:bg-[var(--color-paper)] group-hover:text-[var(--color-accent)]"
                            : "bg-[var(--color-ink)]/10 text-[var(--color-ink)]/60 group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-paper)]"
                          : "border border-[var(--color-ink)]/15 text-[var(--color-ink)]/50 group-hover:border-[var(--color-accent)]/40 group-hover:text-[var(--color-accent)]",
                      )}
                    >
                      <ArrowUpRight size={16} strokeWidth={2.25} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
