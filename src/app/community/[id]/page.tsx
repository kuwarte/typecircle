import { createClient } from "@/services/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Users } from "lucide-react";
import JoinLeaveButton from "@/components/join-leave-button";
import FeedPosts, { type Post } from "@/components/feed-posts";
import GroupSettings from "@/components/group-settings";
import GroupMembersList from "@/components/group-members-list";

type RawPost = Post & {
  profiles?: Post["profiles"][] | Post["profiles"] | null;
  enneagram_types?: Post["enneagram_types"][] | Post["enneagram_types"] | null;
  image_url?: string | null;
};

function firstRelated<Row>(row: Row[] | Row | null | undefined) {
  if (!row) return null;
  return Array.isArray(row) ? (row[0] ?? null) : row;
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: group }, { data: posts }, { data: members }] =
    await Promise.all([
      supabase
        .from("groups")
        .select("id, name, topic, created_at, created_by")
        .eq("id", id)
        .single(),
      supabase
        .from("posts")
        .select(
          `id, content, created_at, profiles(username, avatar_url), enneagram_types:type_tag(name, color_hex), reactions(emoji, user_id), comments(id, content, created_at, profiles:author_id(username, avatar_url)), image_url`,
        )
        .eq("group_id", id)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("group_memberships")
        .select(
          "user_id, joined_at, role, profiles(username, avatar_url, primary_type)",
        )
        .eq("group_id", id)
        .limit(20),
    ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isMember = false;
  let isAdmin = false;
  if (user) {
    const { data: membership } = await supabase
      .from("group_memberships")
      .select("id, role")
      .eq("group_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    isMember = !!membership;
    isAdmin = !!membership && membership.role === "admin";
  }

  if (!group) notFound();

  const normalizedPosts: Post[] = ((posts as RawPost[] | null) ?? []).map(
    (post) => ({
      ...post,
      profiles: firstRelated(post.profiles),
      enneagram_types: firstRelated(post.enneagram_types),
      image_url: post.image_url ?? null,
    }),
  );

  const memberCount = members?.length ?? 0;

  return (
    <main className="max-w-6xl mx-auto px-6 pt-10 pb-16 md:pb-24">
      <Link
        href="/community"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)]/55 hover:text-[var(--color-accent)] transition-colors mb-6"
      >
        <ArrowLeft size={16} strokeWidth={2.25} />
        Community
      </Link>

      <section className="pb-6 mb-8 border-b border-[var(--color-ink)]/10">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="mt-2 font-heading font-semibold text-3xl md:text-4xl tracking-tight leading-tight">
              {group.name}
            </h1>
            {group.topic && (
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--color-ink)]/55">
                {group.topic}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[var(--color-ink)]/45">
              <span>
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {normalizedPosts.length}{" "}
                {normalizedPosts.length === 1 ? "post" : "posts"}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Created{" "}
                {new Date(group.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {!isMember &&
            (user ? (
              <JoinLeaveButton initialJoined={false} groupId={id} />
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-4 py-2 text-xs font-semibold hover:bg-[var(--color-accent)]/90 transition-colors"
              >
                Join circle
              </Link>
            ))}

          {isMember && (
            <>
              <Link
                href={`/community/${id}/chat`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ink)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-ink)]/62 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors"
              >
                <MessageSquare size={13} strokeWidth={2.25} />
                Chat room
              </Link>

              {isAdmin && (
                <GroupSettings
                  groupId={id}
                  initialName={group.name}
                  initialTopic={group.topic}
                  isAdmin={isAdmin}
                />
              )}

              <JoinLeaveButton initialJoined groupId={id} />
            </>
          )}
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <FeedPosts
            key={`${id}-${isMember}`}
            initialPosts={normalizedPosts}
            fixedGroupId={id}
            isMember={isMember}
          />
        </div>

        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-paper)] p-6 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-ink)]/10 pb-3">
              <div>
                <h2 className="font-heading font-semibold text-md tracking-tight">
                  Members
                </h2>
              </div>
              <span className="text-sm text-[var(--color-ink)]/42">
                {memberCount}
              </span>
            </div>

            <div className="mt-3">
              <GroupMembersList
                groupId={id}
                members={members ?? []}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
