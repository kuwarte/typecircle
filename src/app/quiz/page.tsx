"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/services/supabase/client";
import { QUIZ_QUESTIONS, scoreQuiz } from "@/lib/quiz-data";
import { TYPES } from "@/lib/types-data";
import { cn } from "@/lib/utils";

type Step = "intro" | "quiz" | "result";

const SCALE = [
  { value: 1, label: "Not me" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Very me" },
];

export default function QuizPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ primary_type: number; wing: number } | null>(null);
  const [saving, setSaving] = useState(false);

  function handleAnswer(value: number) {
    const question = QUIZ_QUESTIONS[qIndex];
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      const scored = scoreQuiz(next);
      setResult(scored);
      setStep("result");
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    await supabase.from("profiles").update({
      primary_type: result.primary_type,
      wing: result.wing,
      updated_at: new Date().toISOString(),
    }).eq("id", session.user.id);

    setSaving(false);
    router.push("/profile");
  }

  const progress = step === "result" ? 100 : (qIndex / QUIZ_QUESTIONS.length) * 100;
  const typeData = result ? TYPES.find((t) => t.n === result.primary_type) : null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] text-[var(--color-paper)] p-8 md:p-14 min-h-[520px] flex flex-col justify-between">

        {/* Progress bar */}
        {step === "quiz" && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-paper)]/10">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Intro */}
        {step === "intro" && (
          <div className="flex flex-col justify-between h-full gap-12">
            <div className="max-w-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/40 block mb-4">
                enneagram assessment
              </span>
              <h1 className="font-heading font-semibold text-4xl md:text-5xl leading-[1.1] tracking-tight">
                Find out what drives you.
              </h1>
              <p className="mt-5 text-[var(--color-paper)]/60 text-base max-w-sm">
                {QUIZ_QUESTIONS.length} statements, rated 1–5. Takes about 8 minutes. No jargon — just how you actually react.
              </p>
            </div>
            <button
              onClick={() => setStep("quiz")}
              className="self-start rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-7 py-3 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors"
            >
              Start the test
            </button>
          </div>
        )}

        {/* Quiz */}
        {step === "quiz" && (
          <div className="flex flex-col justify-between h-full gap-10">
            <div>
              <p className="text-xs text-[var(--color-paper)]/40 mb-4">
                {qIndex + 1} of {QUIZ_QUESTIONS.length}
              </p>
              <h2 className="font-heading font-semibold text-2xl md:text-3xl tracking-tight leading-snug max-w-xl">
                {QUIZ_QUESTIONS[qIndex].statement}
              </h2>
            </div>
            <div className="flex flex-col gap-2 max-w-md">
              {SCALE.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleAnswer(s.value)}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-paper)]/10 px-5 py-3 text-sm font-medium hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors text-left text-[var(--color-paper)]/80"
                >
                  {s.label}
                  <span className="text-[var(--color-paper)]/30 text-xs">{s.value}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {step === "result" && result && (
          <div className="flex flex-col justify-between h-full gap-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/40 block mb-4">
                your result
              </span>
              <h1 className="font-heading font-bold text-5xl md:text-7xl tracking-tight text-[var(--color-accent)]">
                Type {result.primary_type}
                <span className="text-3xl text-[var(--color-paper)]/30 ml-3">w{result.wing}</span>
              </h1>
              {typeData && (
                <>
                  <p className="mt-3 font-heading font-semibold text-xl text-[var(--color-paper)]/80">{typeData.name}</p>
                  <p className="mt-3 text-[var(--color-paper)]/55 text-base max-w-md">{typeData.blurb}</p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-7 py-3 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save to my profile"}
              </button>
              <button
                onClick={() => { setStep("intro"); setQIndex(0); setAnswers({}); setResult(null); }}
                className="rounded-full border border-[var(--color-paper)]/20 text-[var(--color-paper)]/60 px-7 py-3 text-sm font-medium hover:border-[var(--color-paper)]/40 transition-colors"
              >
                Retake
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
