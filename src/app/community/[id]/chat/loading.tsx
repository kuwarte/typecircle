import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 py-6 flex flex-col h-[100dvh] md:h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 pb-5 border-b border-[var(--color-ink)]/10">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end gap-4 py-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-9 rounded-2xl ${i % 3 === 0 ? "ml-auto" : ""}`}
            style={{ width: `${45 + ((i * 13) % 30)}%` }}
          />
        ))}
      </div>
      <Skeleton className="h-11 w-full rounded-full mt-4" />
    </section>
  );
}
