// src/app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/services/supabase/client";
import { QUIZ_QUESTIONS, scoreQuiz } from "@/lib/quiz-data";
import { cn } from "@/lib/utils";

type Step = "username" | "quiz" | "result";

const SCALE = [
  { value: 1, label: "Not me" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Very me" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [checking, setChecking] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [result, setResult] = useState<{
    primary_type: number;
    wing: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleUsernameSubmit() {
    setUsernameError("");
    const trimmed = username.trim().toLowerCase();

    if (trimmed.length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmed)) {
      setUsernameError("Only lowercase letters, numbers, and underscores.");
      return;
    }

    setChecking(true);
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", trimmed)
      .maybeSingle();
    setChecking(false);

    if (existing) {
      setUsernameError("That username is taken.");
      return;
    }

    setUsername(trimmed);
    setStep("quiz");
  }

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

  async function handleFinish() {
    if (!result) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    await supabase
      .from("profiles")
      .update({
        username,
        primary_type: result.primary_type,
        wing: result.wing,
      })
      .eq("id", user.id);

    setSaving(false);
    router.push("/feed");
  }

  const progress =
    ((qIndex + (step === "result" ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* USERNAME STEP */}
        {step === "username" && (
          <div>
            <h1 className="font-heading font-bold text-3xl tracking-tight">
              Pick a username
            </h1>
            <p className="mt-2 text-[var(--color-ink)]/60 text-sm">
              This is how people will find you on typecircle.
            </p>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
              placeholder="e.g. jasper_kw"
              className="mt-6 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            {usernameError && (
              <p className="mt-2 text-sm text-red-600">{usernameError}</p>
            )}

            <button
              onClick={handleUsernameSubmit}
              disabled={checking}
              className={cn(
                "mt-6 w-full rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] py-3 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-50",
              )}
            >
              {checking ? "Checking…" : "Continue"}
            </button>
          </div>
        )}

        {/* QUIZ STEP */}
        {step === "quiz" && (
          <div>
            <div className="h-1.5 w-full bg-black/5 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-[var(--color-accent)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-[var(--color-ink)]/40 mb-2">
              {qIndex + 1} of {QUIZ_QUESTIONS.length}
            </p>
            <h2 className="font-heading font-semibold text-2xl tracking-tight leading-snug">
              {QUIZ_QUESTIONS[qIndex].statement}
            </h2>

            <div className="mt-8 flex flex-col gap-2">
              {SCALE.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleAnswer(s.value)}
                  className="flex items-center justify-between rounded-xl border border-black/10 px-5 py-3 text-sm font-medium hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors text-left"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT STEP */}
        {step === "result" && result && (
          <div className="text-center">
            <p className="text-sm text-[var(--color-ink)]/50 mb-2">
              Your type is
            </p>
            <h1 className="font-heading font-bold text-5xl tracking-tight text-[var(--color-accent)]">
              Type {result.primary_type}
              <span className="text-2xl text-[var(--color-ink)]/40">
                {" "}
                w{result.wing}
              </span>
            </h1>

            <p className="mt-4 text-[var(--color-ink)]/60 text-sm max-w-sm mx-auto">
              This is a starting point, not a box. You'll be able to explore
              your full type breakdown and connect with your circle next.
            </p>

            <button
              onClick={handleFinish}
              disabled={saving}
              className="mt-8 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-8 py-3 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Enter typecircle"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
