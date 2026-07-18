// src/app/page.tsx
import { Hero } from "@/components/hero";
import { StatsStrip } from "@/components/stats-strip";
import { HowItWorks } from "@/components/how-it-works";
import { TypesGrid } from "@/components/types-grid";
import { Mission } from "@/components/mission";
import { Community } from "@/components/community";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <Mission />
      <HowItWorks />
      <TypesGrid />
      <Community />
    </>
  );
}
