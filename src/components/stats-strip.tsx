// src/components/stats-strip.tsx
import { Suspense } from "react";
import { createClient } from "@/services/supabase/server";
import { StatsStripClient } from "./stats-strip-client";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-ink)]/10 border-y border-[var(--color-ink)]/10">
      {[0, 1, 2].map((i) => (
        <div key={i} className="px-8 py-10 first:pt-0 sm:first:pt-10 sm:px-8 animate-pulse">
          <div className="h-4 w-24 rounded bg-[var(--color-ink)]/10 mb-4" />
          <div className="h-14 w-32 rounded bg-[var(--color-ink)]/10" />
          <div className="mt-3 h-4 w-40 rounded bg-[var(--color-ink)]/10" />
        </div>
      ))}
    </div>
  );
}

async function StatsData() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("groups")
    .select("*", { count: "exact", head: true });

  return <StatsStripClient circleCount={count ?? 0} />;
}

export function StatsStrip() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-12">
      <Suspense fallback={<StatsSkeleton />}>
        <StatsData />
      </Suspense>
    </section>
  );
}
