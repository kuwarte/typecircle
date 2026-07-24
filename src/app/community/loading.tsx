import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityLoading() {
  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        <Skeleton className="mt-8 h-11 w-full max-w-xl rounded-full" />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 rounded-2xl px-8 py-9 min-h-[240px] border border-[var(--color-ink)]/10 flex flex-col">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="mt-3 h-4 w-1/2" />
            <div className="mt-auto pt-8 flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl px-6 py-7 min-h-[200px] border border-[var(--color-ink)]/10 flex flex-col"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-3 h-3.5 w-1/2" />
              <div className="mt-auto pt-8 flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
