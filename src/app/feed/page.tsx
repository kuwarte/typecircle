// src/app/feed/page.tsx
import { createClient } from "@/services/supabase/server";
import FeedPosts from "@/components/feed-posts";
import Link from "next/link";
import { ArrowUpRight, Newspaper, Plus, Users } from "lucide-react";

type MembershipRow = {
  group_id: string | null;
};

type JoinedGroup = {
  group_id: string | null;
  groups:
    | {
        id: string | null;
        name: string | null;
        topic: string | null;
      }[]
    | {
        id: string | null;
        name: string | null;
        topic: string | null;
      }
    | null;
};

function firstRelated<Row>(row: Row[] | Row | null | undefined) {
  if (!row) return null;
  return Array.isArray(row) ? (row[0] ?? null) : row;
}

export default async function FeedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let postsQuery = supabase.from("posts").select(
    `
      id,
      content,
      created_at,
      group:groups(id, name, topic),
      profiles ( username, avatar_url ),
      enneagram_types:type_tag ( name, color_hex ),
      reactions(emoji, user_id),
      comments(id, content, created_at, profiles:author_id(username, avatar_url)),
      image_url
    `,
  );

  let joinedGroups: JoinedGroup[] = [];

  if (user) {
    const { data: memberships } = await supabase
      .from("group_memberships")
      .select("group_id")
      .eq("user_id", user.id);

    const groupIds = ((memberships as MembershipRow[] | null) ?? [])
      .map((membership) => membership.group_id)
      .filter(Boolean);

    if (groupIds.length > 0) {
      postsQuery = postsQuery.or(
        `group_id.is.null,group_id.in.(${groupIds.join(",")})`,
      );
    } else {
      postsQuery = postsQuery.is("group_id", null);
    }

    const { data: groupMemberships } = await supabase
      .from("group_memberships")
      .select("group_id, groups(id, name, topic)")
      .eq("user_id", user.id)
      .order("joined_at", { ascending: false })
      .limit(8);

    joinedGroups = (groupMemberships as JoinedGroup[] | null) ?? [];
  } else {
    postsQuery = postsQuery.is("group_id", null);
  }

  const { data: posts } = await postsQuery
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--color-ink)]/10 pb-6">
          <div>
            <h1 className="font-heading font-semibold text-3xl md:text-4xl tracking-tight leading-tight">
              Latest posts
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
          <div>
            {(!posts || posts.length === 0) && (
              <div className="rounded-3xl bg-[var(--color-accent)] text-[var(--color-paper)] px-8 py-14">
                <h2 className="font-heading font-semibold text-3xl tracking-tight">
                  No posts yet.
                </h2>
                <p className="mt-3 text-sm text-[var(--color-paper)]/70">
                  Be the first to share something from your circle.
                </p>
              </div>
            )}

            <FeedPosts initialPosts={posts ?? []} />
          </div>

          <aside className="border border-[var(--color-ink)]/10 lg:sticky lg:top-24 p-6 rounded-xl">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-ink)]/10 pb-3">
              <div>
                <h2 className="font-heading font-semibold text-xl tracking-tight">
                  Circles
                </h2>
                <p className="mt-0.5 text-xs text-[var(--color-ink)]/42">
                  Groups you follow
                </p>
              </div>
              <Link
                href="/community"
                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ink)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)]/58 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors"
              >
                Browse
                <ArrowUpRight size={13} strokeWidth={2.25} />
              </Link>
            </div>

            {joinedGroups.length > 0 ? (
              <div className="mt-3 flex flex-col divide-y divide-[var(--color-ink)]/8">
                {joinedGroups.map((membership) => {
                  const group = firstRelated(membership.groups);
                  if (!group?.id) return null;
                  const initial = (group.name ?? "?").slice(0, 1).toUpperCase();
                  return (
                    <Link
                      key={group.id}
                      href={`/community/${group.id}`}
                      className="group -mx-2 flex items-center gap-3 rounded-2xl px-2 py-3.5 hover:bg-[var(--color-ink)]/[0.04] transition-colors"
                    >
                      <span className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] flex items-center justify-center shrink-0 font-heading text-sm font-semibold">
                        {initial}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-normal truncate group-hover:text-[var(--color-accent)] transition-colors">
                          {group.name ?? "Untitled circle"}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--color-ink)]/45 truncate">
                          {group.topic || "Open circle"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-paper)] px-5 py-5">
                <span className="w-10 h-10 rounded-full bg-[var(--color-accent)]/12 text-[var(--color-accent-ink)] flex items-center justify-center">
                  <Users size={17} strokeWidth={2.25} />
                </span>
                <h3 className="mt-4 font-heading font-semibold text-lg tracking-tight">
                  No circles yet
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink)]/55">
                  Join a circle to personalize your feed.
                </p>
                <Link
                  href="/community"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent)]/90 transition-colors"
                >
                  <Plus size={14} strokeWidth={2.25} />
                  Find circles
                </Link>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
