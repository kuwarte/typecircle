import FeatureCard from "@/components/feature-card";
import Link from "next/link";
import {
  FaComments,
  FaRegCircle,
  FaUser,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Your Enneagram Personality Type | TypeCircle",
  description:
    "Start your journey of self-discovery with our comprehensive Enneagram personality assessment. Understand your core motivations, fears, and growth opportunities.",
  keywords: [
    "enneagram test",
    "personality assessment",
    "self discovery",
    "enneagram types",
    "personal growth",
    "personality quiz",
  ],
  openGraph: {
    title: "Discover Your True Self with the Enneagram | TypeCircle",
    description:
      "Take our Enneagram assessment to better understand your personality, motivations, and growth opportunities while connecting with others on similar journeys.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://typecircle.vercel.app",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "TypeCircle Home - Enneagram Personality Assessment",
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 bg-gradient-to-b from-background via-background to-muted/10">
        <div className="max-w-5xl mx-auto text-center w-full">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
              <FaRegCircle className="text-2xl sm:text-3xl text-[var(--typecircle-green)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold text-foreground mb-3 sm:mb-4 tracking-tight px-2">
              Discover Your True Self
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[var(--typecircle-green)] font-medium mb-4 sm:mb-6 px-2">
              Through the Enneagram Personality System
            </p>
          </div>

          <div className="mb-8 sm:mb-10">
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 px-4">
              Learn your personality type and take steps toward personal growth,
              stronger relationships, and meaningful connections. Join thousands
              who have explored their Enneagram type.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-6 text-sm text-muted-foreground px-4">
              <span className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[var(--typecircle-green)] rounded-full"></div>
                Simple Assessment
              </span>
              <span className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[var(--typecircle-green)] rounded-full"></div>
                Clear Results
              </span>
              <span className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[var(--typecircle-green)] rounded-full"></div>
                Community Support
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center px-4">
            <Link
              href="/enneagram/test"
              className="btn-typecircle px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-center"
            >
              Start Your Assessment
            </Link>
            <Link
              href="/rooms"
              className="btn-typecircle-outline px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-center"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-muted/10 via-background to-background">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-only rounded-2xl sm:rounded-3xl p-6 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--typecircle-green)]/5 via-transparent to-blue-500/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
                  <FaRegCircle className="text-xl sm:text-2xl text-[var(--typecircle-green)]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3 sm:mb-4 px-2">
                  Your Journey to Self-Discovery
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                  Follow three simple steps to understand yourself and connect
                  with others.
                </p>
              </div>

              <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                <FeatureCard
                  icon={
                    <FaUser className="text-4xl text-[var(--typecircle-green)]" />
                  }
                  title="Take the Assessment"
                  description="Complete our easy Enneagram test to find your type and understand your motivations."
                  href="/enneagram/test"
                />
                <FeatureCard
                  icon={
                    <FaUsers className="text-4xl text-[var(--typecircle-green)]" />
                  }
                  title="Learn About Types"
                  description="Read about all 9 Enneagram types, wings, and growth paths to better understand yourself."
                  href="/enneagram/faq"
                />
                <FeatureCard
                  icon={
                    <FaComments className="text-4xl text-[var(--typecircle-green)]" />
                  }
                  title="Grow Together"
                  description="Join discussions, share experiences, and learn from others in the community."
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
