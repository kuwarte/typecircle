import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="text-center max-w-2xl mx-auto">
        <div className="backdrop-blur-xl bg-background/30 border border-white/20 dark:border-white/10 rounded-3xl p-12 shadow-2xl shadow-black/10 dark:shadow-black/30">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[var(--typecircle-green)] to-[var(--typecircle-green)]/70 bg-clip-text text-transparent">
              404
            </h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[var(--typecircle-green)] hover:bg-[var(--typecircle-green)]/90">
              <Link href="/">
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/rooms">
                Browse Rooms
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
