// src/app/feed/page.tsx
import { createClient } from "@/services/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      profiles ( username, avatar_url ),
      enneagram_types:type_tag ( name, color_hex )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-heading font-bold text-3xl tracking-tight mb-8">
        Feed
      </h1>

      {(!posts || posts.length === 0) && (
        <p className="text-[var(--color-ink)]/50 text-sm">
          No posts yet — be the first to share something.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {posts?.map((post) => (
          <div key={post.id} className="rounded-2xl border border-black/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-medium text-sm">
                {post.profiles?.username ?? "unknown"}
              </span>
              {post.enneagram_types && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-[var(--color-paper)]"
                  style={{ backgroundColor: post.enneagram_types.color_hex }}
                >
                  {post.enneagram_types.name}
                </span>
              )}
            </div>
            <p className="text-[var(--color-ink)]/80 text-sm leading-relaxed">
              {post.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
