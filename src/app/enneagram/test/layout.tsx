import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enneagram Personality Test | TypeCircle",
  description:
    "Take our comprehensive Enneagram assessment to discover your personality type. Answer carefully crafted questions to identify your core motivations, fears, and growth opportunities.",
  keywords: [
    "enneagram test",
    "personality quiz",
    "enneagram assessment",
    "personality types",
    "self assessment",
  ],
  openGraph: {
    title: "Take the Enneagram Personality Test | TypeCircle",
    description:
      "Discover your Enneagram type with our scientifically designed assessment. Understand yourself better and start your journey of personal growth.",
  },
};

export default function TestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
