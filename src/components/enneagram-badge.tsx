import { enneagramTypes } from "@/data/enneagram-questions";

interface EnneagramBadgeProps {
  type: number;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function EnneagramBadge({ type, size = "md", showName = false }: EnneagramBadgeProps) {
  const typeInfo = enneagramTypes[type as keyof typeof enneagramTypes];
  
  if (!typeInfo) return null;

  return (
    <div className="flex items-center">
      <div className="sm:hidden px-2 py-1 rounded-full bg-[var(--typecircle-green)]/20 border border-[var(--typecircle-green)]/40 text-xs font-bold text-[var(--typecircle-green)]">
        {type}
      </div>
      <div className="hidden sm:block px-2 py-1 rounded-full bg-[var(--typecircle-green)]/20 border border-[var(--typecircle-green)]/40 text-xs font-medium text-[var(--typecircle-green)]">
        {typeInfo.name}
      </div>
    </div>
  );
}