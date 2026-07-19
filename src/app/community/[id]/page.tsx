import { createClient } from "@/services/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users } from "lucide-react";
import { GroupFeed } from "./group-feed";

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: group }, { data: posts }, { data: members }] = await Promise.all([
    supabase
      .from("groups")
      .select("id, name, topic, created_at, created_by")
      .eq("id", id)
      .single(),
    supabase
      .from("posts")
      .select(`id, content, created_at, profiles(username, avatar_url), enneagram_types:type_tag(name, color_hex), reactions(emoji, user_id)`)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("group_memberships")
      .select("user_id, joined_at, profiles(username, avatar_url, primary_type)")
      .eq("group_id", id)
      .limit(20),
  ]);

  if (!group) notFound();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
        <div>
          <Link href="/community" className="text-xs text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]/60 transition-colors mb-3 block">
            ← Community
          </Link>
          <h1 className="font-heading font-bold text-3xl tracking-tight">{group.name}</h1>
          {group.topic && (
            <p className="mt-2 text-[var(--color-ink)]/55 text-sm max-w-lg">{group.topic}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/community/${id}/chat`}
            className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[var(--color-ink)]/70 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            <MessageSquare size={15} strokeWidth={2} />
            Chat
          </Link>
          <JoinButton groupId={id} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Feed */}
        <div className="flex-1 min-w-0">
          <GroupFeed groupId={id} initialPosts={posts ?? []} />
        </div>

        {/* Members sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="rounded-2xl border border-black/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={15} strokeWidth={2} className="text-[var(--color-ink)]/40" />
              <h2 className="text-sm font-semibold text-[var(--color-ink)]/70">
                Members · {members?.length ?? 0}
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {members?.map((m) => {
                const profile = m.profiles as { username: string; avatar_url: string; primary_type: number } | null;
                const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?";
                return (
                  <div key={m.user_id} className="flex items-center gap-2.5">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={profile?.avatar_url ?? ""} />
                      <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{profile?.username ?? "—"}</p>
                      {profile?.primary_type && (
                        <p className="text-xs text-[var(--color-ink)]/40">Type {profile.primary_type}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function JoinButton({ groupId }: { groupId: string }) {
  return (
    <form action={`/api/groups/${groupId}/join`} method="POST">
      <button
        type="submit"
        className="rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-5 py-2 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors"
      >
        Join circle
      </button>
    </form>
  );
}
