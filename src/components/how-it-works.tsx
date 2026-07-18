// src/components/how-it-works.tsx
"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "1",
    title: "Take the test",
    body: "Answer a set of scenario-based questions — no jargon, just how you actually react.",
    image: "/screenshots/step-1-quiz.png",
  },
  {
    n: "2",
    title: "Get your type",
    body: "See your core type, your wing, and the patterns driving your decisions and relationships.",
    image: "/screenshots/step-2-result.png",
  },
  {
    n: "3",
    title: "Join your circle",
    body: "Get matched into a small group with your type — or one that challenges how you think.",
    image: "/screenshots/step-3-circle.png",
  },
];

const STICKY_OFFSET = 96;
const MIN_SCALE = 0.9;
const MIN_OPACITY = 0.4;
const CATCH_UP = 0.22;

type Spring = { pos: number; target: number };

export function HowItWorks() {
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const springs = useRef<Spring[]>(STEPS.map(() => ({ pos: 0, target: 0 })));
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "none";
        card.style.opacity = "1";
      });
      return;
    }

    function computeTargets() {
      const viewportH = window.innerHeight;
      wrapperRefs.current.forEach((_, i) => {
        const nextWrapper = wrapperRefs.current[i + 1];
        if (!nextWrapper) {
          springs.current[i].target = 0;
          return;
        }
        const nextTop = nextWrapper.getBoundingClientRect().top;
        const progress =
          1 -
          Math.min(
            Math.max(
              (nextTop - STICKY_OFFSET) / (viewportH - STICKY_OFFSET),
              0,
            ),
            1,
          );
        springs.current[i].target = progress;
      });
    }

    function tick() {
      computeTargets();

      springs.current.forEach((spring, i) => {
        const card = cardRefs.current[i];
        if (!card) return;

        const delta = spring.target - spring.pos;
        spring.pos += delta * CATCH_UP;

        const clamped = Math.min(Math.max(spring.pos, 0), 1);

        const scale = 1 - clamped * (1 - MIN_SCALE);
        const opacity = 1 - clamped * (1 - MIN_OPACITY);
        const lift = clamped * -24;

        const shadowBlur = 24 + clamped * 36;
        const shadowY = 10 + clamped * 22;
        const shadowAlpha = 0.16 + clamped * 0.2;

        card.style.transform = `translateY(${lift}px) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha})`;
      });

      rafId.current = requestAnimationFrame(tick);
    }

    computeTargets();
    rafId.current = requestAnimationFrame(tick);

    function onResize() {
      computeTargets();
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="font-heading font-bold text-4xl md:text-6xl tracking-tight leading-[1.05] max-w-2xl">
            How it works?
          </h2>
        </div>
      </div>

      {STEPS.map((step, i) => (
        <div
          key={step.n}
          ref={(el) => {
            wrapperRefs.current[i] = el;
          }}
          className="relative h-[100vh] md:h-[110vh]"
        >
          <div
            className="sticky top-20 md:top-24 flex justify-center px-6"
            style={{ zIndex: i + 1 }}
          >
            <div
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="w-full max-w-6xl rounded-3xl bg-[var(--color-ink)] text-[var(--color-paper)] origin-top will-change-transform grid grid-cols-1 md:grid-cols-[3fr_2fr] min-h-[65vh] md:min-h-[75vh]"
            >
              {/* Image */}
              <div className="p-2 md:p-3 min-h-[320px] md:min-h-0">
                <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden bg-[var(--color-paper)]/5 flex items-center justify-center">
                  {/*
                    Swap this placeholder for your actual screenshot:
                    <img
                      src={step.image}
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  */}
                  <span className="text-[var(--color-paper)]/25 text-sm">
                    {step.image}
                  </span>

                  {/* Step number badge — same color as card, sits on the
                      image's top-left corner */}
                  <span className="absolute top-4 left-4 font-heading font-bold text-sm text-[var(--color-accent)] bg-[var(--color-ink)] rounded-full px-3.5 py-1.5 shadow-md">
                    {step.n}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center px-8 py-10 md:px-10 md:py-14">
                <h3 className="font-heading font-semibold text-3xl md:text-4xl tracking-tight leading-[1.05] mb-5">
                  {step.title}
                </h3>
                <p className="text-[var(--color-paper)]/70 text-base md:text-lg leading-relaxed max-w-md">
                  {step.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
