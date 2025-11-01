"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export default function PageProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!pathname) return;

    setLoading(true);
    setProgress(0);

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + Math.random() * 5;
        return prev;
      });
    }, 100);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [pathname]);

  useEffect(() => {
    if (!loading) return;

    const timeout = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }, 500);

    return () => clearTimeout(timeout);
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress
        value={progress}
        className="h-1 rounded-none bg-muted [&>div]:bg-[var(--typecircle-green)] transition-all duration-150"
      />
    </div>
  );
}
