import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FaComments, FaRegCircle, FaUser, FaUsers } from "react-icons/fa";

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="glass-card rounded-2xl p-8 h-full transition-all duration-200 group-hover:bg-white/5">
        <div className="text-center">
          <div className="mb-6">{icon}</div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 bg-gradient-to-b from-background via-background to-muted/10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
              <FaRegCircle className="text-3xl text-[var(--typecircle-green)]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-foreground mb-4 tracking-tight">
              Discover Your True Self
            </h1>
            <p className="text-xl md:text-2xl text-[var(--typecircle-green)] font-medium mb-6">
              Through the Enneagram Personality System
            </p>
          </div>

          <div className="mb-10">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
              Understanding your personality type is the first step toward
              personal growth, better relationships, and meaningful connections.
              Join thousands who have discovered their Enneagram type and
              transformed their lives.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--typecircle-green)] rounded-full"></div>
                Scientific Assessment
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--typecircle-green)] rounded-full"></div>
                Personalized Results
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--typecircle-green)] rounded-full"></div>
                Community Support
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/enneagram/test"
              className="bg-[var(--typecircle-green)] text-white px-8 py-4 rounded-lg font-medium hover:bg-[var(--typecircle-green)]/90 transition-colors duration-200"
            >
              Start Your Assessment
            </Link>
            <Link
              href="/rooms"
              className="border-2 border-[var(--typecircle-green)] text-[var(--typecircle-green)] px-8 py-4 rounded-lg font-medium hover:bg-[var(--typecircle-green)]/5 transition-colors duration-200"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-b from-muted/10 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--typecircle-green)]/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
                  <FaRegCircle className="text-2xl text-[var(--typecircle-green)]" />
                </div>
                <h2 className="text-3xl font-semibold text-foreground mb-4">
                  Your Journey to Self-Discovery
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  A simple three-step process to unlock deeper understanding of
                  yourself and connect with others
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={
                    <FaUser className="text-4xl text-[var(--typecircle-green)]" />
                  }
                  title="Take the Assessment"
                  description="Complete our comprehensive Enneagram test designed by personality experts to accurately identify your type and core motivations."
                  href="/enneagram/test"
                />
                <FeatureCard
                  icon={
                    <FaUsers className="text-4xl text-[var(--typecircle-green)]" />
                  }
                  title="Learn About Types"
                  description="Explore comprehensive guides about all 9 Enneagram types, wings, subtypes, and growth paths to deepen your understanding."
                  href="/enneagram/faq"
                />
                <FeatureCard
                  icon={
                    <FaComments className="text-4xl text-[var(--typecircle-green)]" />
                  }
                  title="Grow Together"
                  description="Engage in supportive discussions, share experiences, and learn from others on similar journeys of personal development."
                  href="/rooms"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
