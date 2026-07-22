"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MemberControls from "@/components/member-controls";

type MemberProfile = {
  username: string | null;
  avatar_url: string | null;
  primary_type: number | null;
};
type Member = {
  user_id: string;
  role: string;
  profiles: MemberProfile[] | MemberProfile | null;
};

const TYPE_COLORS: Record<number, string> = {
  1: "#C97B4A",
  2: "#D65D6E",
  3: "#D9A73B",
  4: "#7B5EA7",
  5: "#4C6B8A",
  6: "#4A7A8C",
  7: "#E08A3E",
  8: "#A23B3B",
  9: "#5B8C5A",
};

function firstRelated<Row>(row: Row[] | Row | null | undefined) {
  if (!row) return null;
  return Array.isArray(row) ? (row[0] ?? null) : row;
}

export default function GroupMembersList({
  groupId,
  members,
  isAdmin,
}: {
  groupId: string;
  members: Member[];
  isAdmin: boolean;
}) {
  if (members.length === 0) {
    return (
      <p className="px-5 py-6 text-sm text-[var(--color-ink)]/45">
        No members yet.
      </p>
    );
  }

  const sorted = [...members].sort((a, b) =>
    a.role === b.role ? 0 : a.role === "admin" ? -1 : 1,
  );

  return (
    <div className="flex flex-col divide-y divide-[var(--color-ink)]/10">
      {sorted.map((member) => {
        const profile = firstRelated(member.profiles);
        const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?";
        const accent = profile?.primary_type
          ? TYPE_COLORS[profile.primary_type]
          : undefined;

        return (
          <div
            key={member.user_id}
            className="flex items-center gap-3 px-5 py-3"
          >
            <div className="flex flex-col items-center gap-1 shrink-0">
              <Avatar className="w-9 h-9 rounded-lg border border-[var(--color-ink)]/10">
                <AvatarImage
                  src={profile?.avatar_url ?? ""}
                  className="rounded-lg"
                />
                <AvatarFallback
                  className="rounded-lg text-[var(--color-paper)] text-xs font-semibold"
                  style={{ backgroundColor: accent ?? "var(--color-accent)" }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              {accent && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-[var(--color-ink)] truncate">
                  {profile?.username ?? "Unknown"}
                </p>
                {member.role === "admin" && (
                  <span className="shrink-0 rounded-full border border-[var(--color-accent)]/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                    Admin
                  </span>
                )}
              </div>
              {profile?.primary_type && (
                <p className="text-xs text-[var(--color-ink)]/40">
                  Type {profile.primary_type}
                </p>
              )}
            </div>

            {isAdmin && (
              <div className="shrink-0">
                <MemberControls
                  groupId={groupId}
                  member={{
                    user_id: member.user_id,
                    role: member.role,
                    username: profile?.username ?? null,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
