// src/app/onboarding/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/services/supabase/client";
import {
    QUIZ_QUESTIONS,
    scoreQuiz,
    shuffleQuestions,
    orderQuestionsById,
    type ScoredQuizResult,
    type QuizQuestion,
} from "@/lib/quiz-data";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Loader2,
    RefreshCw,
} from "lucide-react";

type Step = "checking" | "username" | "quiz" | "result";

const SCALE = [
    { value: 1, label: "Not me" },
    { value: 2, label: "Rarely" },
    { value: 3, label: "Sometimes" },
    { value: 4, label: "Often" },
    { value: 5, label: "Very me" },
];


const ONBOARDING_QUIZ_PROGRESS_KEY = "typecircle:onboarding-quiz-progress";

type SavedProgress = {
    qIndex: number;
    answers: Record<string, number>;
    order: string[];
};

function loadSavedProgress(): SavedProgress | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem(ONBOARDING_QUIZ_PROGRESS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as SavedProgress;
        if (typeof parsed.qIndex === "number" && parsed.answers && Array.isArray(parsed.order)) {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}

function saveProgress(progress: SavedProgress) {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.setItem(
            ONBOARDING_QUIZ_PROGRESS_KEY,
            JSON.stringify(progress),
        );
    } catch {
        // ignore
    }
}

function clearSavedProgress() {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.removeItem(ONBOARDING_QUIZ_PROGRESS_KEY);
    } catch {
        // ignore
    }
}

// Small curated word lists for username suggestions — kept short,
// gender-neutral, and free of anything that could combine into
// something inappropriate.
const NAME_ADJECTIVES = [
    "swift",
    "quiet",
    "bold",
    "calm",
    "bright",
    "gentle",
    "sharp",
    "brave",
    "kind",
    "quick",
    "wild",
    "warm",
    "cool",
    "deep",
    "still",
    "keen",
    "wise",
    "true",
    "free",
    "steady",
];
const NAME_NOUNS = [
    "owl",
    "fox",
    "wolf",
    "hawk",
    "otter",
    "lynx",
    "raven",
    "falcon",
    "badger",
    "heron",
    "panda",
    "tiger",
    "whale",
    "crane",
    "wren",
    "stag",
    "seal",
    "dove",
    "bear",
    "elk",
];

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// e.g. "quiet_falcon482" — matches the username regex (lowercase,
// digits, underscores only).
function generateUsernameCandidate() {
    const adjective = randomItem(NAME_ADJECTIVES);
    const noun = randomItem(NAME_NOUNS);
    const number = Math.floor(Math.random() * 900) + 100; // 100–999
    return `${adjective}_${noun}${number}`;
}

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();

    // Starts on "checking" instead of "username" — this closes the
    // back/forward-button hole: if someone finished onboarding, then hits
    // back to land on this page again, we catch it here client-side
    // instead of briefly flashing the username form before the proxy's
    // redirect (or a stale bfcache page) takes over.
    const [step, setStep] = useState<Step>("checking");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [checking, setChecking] = useState(false);
    const [orderedQuestions, setOrderedQuestions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);


    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);

    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});

    const [result, setResult] = useState<ScoredQuizResult | null>(null);
    const [saving, setSaving] = useState(false);

    // On mount, confirm this user actually still needs onboarding.
    useEffect(() => {
        let cancelled = false;

        async function checkOnboardingStatus() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.replace("/login");
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("username, primary_type")
                .eq("id", user.id)
                .maybeSingle();

            const alreadyComplete =
                !!profile?.username && profile?.primary_type != null;

            if (cancelled) return;

            if (alreadyComplete) {
                router.replace("/feed");
                return;
            }

            setStep("username");
        }

        checkOnboardingStatus();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Generates a batch of candidates, filters out any that are already
    // taken (checked in one query), and keeps 3 available ones.
    async function refreshSuggestions() {
        setSuggestionsLoading(true);

        const candidates = new Set<string>();
        while (candidates.size < 8) {
            candidates.add(generateUsernameCandidate());
        }
        const candidateList = Array.from(candidates);

        const { data: taken } = await supabase
            .from("profiles")
            .select("username")
            .in("username", candidateList);

        const takenSet = new Set((taken || []).map((row) => row.username));
        const available = candidateList.filter((c) => !takenSet.has(c));

        setSuggestions(available.slice(0, 2));
        setSuggestionsLoading(false);
    }

    // Fetch an initial batch as soon as the username step is reached (it
    // starts blank while "checking" runs first).
    useEffect(() => {
        if (step === "username" && suggestions.length === 0) {
            refreshSuggestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

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

        const saved = loadSavedProgress();
        if (saved && Object.keys(saved.answers).length > 0) {
            setOrderedQuestions(orderQuestionsById(saved.order));
            setAnswers(saved.answers);
            setQIndex(Math.min(saved.qIndex, QUIZ_QUESTIONS.length - 1));
        } else {
            setOrderedQuestions(shuffleQuestions());
        }

        setStep("quiz");
    }

    useEffect(() => {
        if (step !== "quiz") return;
        saveProgress({ qIndex, answers, order: orderedQuestions.map((q) => q.id) });
    }, [step, qIndex, answers, orderedQuestions]);

    function handleAnswer(value: number) {
        const question = orderedQuestions[qIndex];
        const next = { ...answers, [question.id]: value };
        setAnswers(next);

        if (qIndex < orderedQuestions.length - 1) {
            setQIndex(qIndex + 1);
        } else {
            const scored = scoreQuiz(next);
            setResult(scored);
            clearSavedProgress();
            setStep("result");
        }
    }

    function goBackQuestion() {
        if (qIndex === 0) {
            setStep("username");
            return;
        }
        setQIndex(qIndex - 1);
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

        // Tell the nav (and anything else listening) that the profile changed
        // so it refetches username/avatar instead of showing stale state.
        window.dispatchEvent(new Event("profile-updated"));

        setSaving(false);
        // router.replace (not push) so this onboarding page isn't left sitting
        // in browser history for a back-button to return to post-completion.
        router.replace("/feed");
    }

    useEffect(() => {
        if (step !== "quiz") return;
        const saved = loadSavedProgress();
        if (saved && Object.keys(saved.answers).length > 0 && qIndex === 0) {
            setAnswers(saved.answers);
            setQIndex(Math.min(saved.qIndex, QUIZ_QUESTIONS.length - 1));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    // Keyboard shortcuts: 1–5 answer the current question, but only while
    // on the quiz step — disabled during username entry and the result
    // screen so typing into the username field isn't hijacked.
    useEffect(() => {
        if (step !== "quiz") return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const value = Number(e.key);
            if (value >= 1 && value <= 5) {
                e.preventDefault();
                handleAnswer(value);
            } else if (e.key === "Backspace" || e.key === "ArrowLeft") {
                e.preventDefault();
                goBackQuestion();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, qIndex, answers]);

    const safeLength = QUIZ_QUESTIONS?.length || 1;
    const progress =
        step === "checking" || step === "username"
            ? 0
            : step === "result"
                ? 100
                : (qIndex / safeLength) * 100;

    const currentAnswer = QUIZ_QUESTIONS?.[qIndex]
        ? answers[QUIZ_QUESTIONS[qIndex].id]
        : undefined;

    return (
        <section className="max-w-2xl mx-auto px-6 py-16">
            <style jsx global>{`
        @keyframes onboarding-step-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .onboarding-step-in {
          animation: onboarding-step-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        @keyframes onboarding-result-pop {
          0% {
            transform: scale(0.85);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .onboarding-result-pop {
          animation: onboarding-result-pop 0.5s
            cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .onboarding-step-in,
          .onboarding-result-pop {
            animation: none !important;
          }
        }
      `}</style>

            <div
                className={cn(
                    "flex flex-col",
                    step === "checking" || step === "username"
                        ? "min-h-[calc(100vh-12rem)] justify-center"
                        : "min-h-[calc(100vh-12rem)] justify-between",
                )}
            >
                {/* Progress bar (hidden on the username/checking steps, matches quiz page) */}
                {step === "quiz" && (
                    <div className="flex items-center gap-4 mb-10">
                        <button
                            onClick={goBackQuestion}
                            aria-label="Go back"
                            className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-ink)]/80 disabled:opacity-0 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 active:scale-95"
                        >
                            <ArrowLeft size={18} strokeWidth={2.25} />
                        </button>
                        <div
                            className="flex-1 h-1.5 rounded-full bg-[var(--color-ink)]/10 overflow-hidden"
                            role="progressbar"
                            aria-valuenow={Math.round(progress)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {step === "quiz" && (
                            <span className="text-xs font-medium text-[var(--color-ink)]/40 tabular-nums shrink-0">
                                {qIndex + 1} / {QUIZ_QUESTIONS?.length || 0}
                            </span>
                        )}
                    </div>
                )}

                {/* CHECKING STEP — brief guard while we confirm onboarding is
            actually still needed for this user */}
                {step === "checking" && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2
                            size={28}
                            strokeWidth={2.25}
                            className="animate-spin text-[var(--color-accent)]"
                        />
                    </div>
                )}

                {/* USERNAME STEP */}
                {step === "username" && (
                    <div
                        key="username"
                        className="onboarding-step-in flex flex-col items-center justify-center gap-10 text-center"
                    >
                        <div className="w-full">
                            <h1 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-[var(--color-ink)]">
                                Pick a username
                            </h1>
                            <p className="mt-2 text-[var(--color-ink)]/60 text-sm max-w-sm mx-auto">
                                This is how people will find you on typecircle.
                            </p>

                            <div className="mt-8 max-w-sm mx-auto text-left">
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
                                    placeholder="e.g. jasper_kw"
                                    className="w-full rounded-2xl border-2 border-[var(--color-ink)]/10 bg-[var(--color-paper)] px-5 py-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/20 transition-all shadow-sm"
                                />
                                {usernameError && (
                                    <p className="mt-2 text-sm text-rose-600 font-medium">
                                        {usernameError}
                                    </p>
                                )}

                                <div className="mt-4 flex flex-nowrap items-center gap-2 overflow-x-auto">
                                    <span className="text-xs font-medium text-[var(--color-ink)]/40 shrink-0 whitespace-nowrap">
                                        Need ideas?
                                    </span>

                                    {suggestionsLoading && suggestions.length === 0 ? (
                                        <Loader2
                                            size={14}
                                            strokeWidth={2.25}
                                            className="animate-spin text-[var(--color-ink)]/40"
                                        />
                                    ) : (
                                        suggestions.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => {
                                                    setUsername(s);
                                                    setUsernameError("");
                                                }}
                                                className="shrink-0 whitespace-nowrap rounded-full border border-[var(--color-ink)]/10 bg-[var(--color-ink)]/[0.02] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)]/70 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
                                            >
                                                {s}
                                            </button>
                                        ))
                                    )}

                                    <button
                                        type="button"
                                        onClick={refreshSuggestions}
                                        disabled={suggestionsLoading}
                                        aria-label="Shuffle suggestions"
                                        className="flex items-center justify-center w-7 h-7 rounded-full text-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-accent)] transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40"
                                    >
                                        <RefreshCw
                                            size={13}
                                            strokeWidth={2.5}
                                            className={cn(suggestionsLoading && "animate-spin")}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleUsernameSubmit}
                                disabled={checking}
                                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-8 py-3.5 text-base font-medium hover:bg-[var(--color-accent)]/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-[var(--color-accent)]/20"
                            >
                                {checking ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            strokeWidth={2.25}
                                            className="animate-spin"
                                        />
                                        Checking…
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight size={18} strokeWidth={2.25} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* QUIZ STEP */}
                {step === "quiz" && (
                    <div className="flex flex-col justify-between h-full gap-10 w-full">
                        <div key={qIndex} className="quiz-step-in mt-10 min-h-[120px]" aria-live="polite">
                            <h2 className="font-heading font-semibold text-2xl md:text-4xl tracking-tight leading-[1.3] text-[var(--color-ink)] text-center">
                                {QUIZ_QUESTIONS?.[qIndex]?.statement}
                            </h2>
                        </div>

                        <div className="max-w-md mx-auto w-full">
                            <div
                                key={`scale-${qIndex}`}
                                className="onboarding-step-in flex flex-col gap-2.5"
                            >
                                {SCALE.map((s) => {
                                    const isSelected = currentAnswer === s.value;
                                    return (
                                        <button
                                            key={s.value}
                                            onClick={() => handleAnswer(s.value)}
                                            className={cn(
                                                "group flex items-center justify-between rounded-2xl border-2 px-5 py-3.5 text-base font-medium transition-all text-left active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/20",
                                                isSelected
                                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)] shadow-sm"
                                                    : "border-[var(--color-ink)]/10 text-[var(--color-ink)]/70 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/[0.02]",
                                            )}
                                        >
                                            {s.label}
                                            <span
                                                className={cn(
                                                    "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all",
                                                    isSelected
                                                        ? "bg-[var(--color-accent)] text-[var(--color-paper)] scale-110"
                                                        : "bg-[var(--color-ink)]/10 text-[var(--color-ink)]/40 group-hover:bg-[var(--color-accent)]/15 group-hover:text-[var(--color-accent)]",
                                                )}
                                            >
                                                {isSelected ? (
                                                    <Check size={13} strokeWidth={3} />
                                                ) : (
                                                    s.value
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="mt-6 text-center text-xs font-medium text-[var(--color-ink)]/35">
                                Tip: Use{" "}
                                <kbd className="font-sans px-1.5 py-0.5 rounded-md bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/10">
                                    1
                                </kbd>
                                –
                                <kbd className="font-sans px-1.5 py-0.5 rounded-md bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/10">
                                    5
                                </kbd>{" "}
                                to answer,{" "}
                                <kbd className="font-sans px-1.5 py-0.5 rounded-md bg-[var(--color-ink)]/5 border border-[var(--color-ink)]/10">
                                    Backspace
                                </kbd>{" "}
                                to go back.
                            </p>
                        </div>
                    </div>
                )}

                {/* RESULT STEP */}
                {step === "result" && result && (
                    <div
                        key="result"
                        className="onboarding-step-in flex flex-1 flex-col items-center justify-center text-center gap-8"
                    >
                        <div>
                            <span className="onboarding-result-pop inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--color-accent)] text-[var(--color-paper)] font-heading font-bold text-3xl shadow-md shadow-[var(--color-accent)]/20 rotate-3">
                                {result.primary_type}
                            </span>

                            <p className="mt-6 text-sm font-medium text-[var(--color-ink)]/50">
                                Your type is
                            </p>
                            <h1 className="mt-1 font-heading font-bold text-4xl md:text-5xl tracking-tight text-[var(--color-ink)]">
                                Type {result.primary_type}
                                <span className="text-[var(--color-ink)]/40">
                                    {" "}
                                    w{result.wing}
                                </span>
                            </h1>
                            {result.isClose && result.secondaryType && (
                                <p className="mt-3 text-xs font-medium text-[var(--color-accent-ink)] bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/20 rounded-xl px-4 py-2.5 max-w-sm mx-auto">
                                    This was close with Type {result.secondaryType} — worth comparing both
                                    once you're in.
                                </p>
                            )}

                            <p className="mt-4 text-[var(--color-ink)]/60 text-sm max-w-sm mx-auto leading-relaxed">
                                This is a starting point, not a box. You'll be able to explore
                                your full type breakdown and connect with your circle next.
                            </p>
                        </div>

                        <button
                            onClick={handleFinish}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-8 py-3.5 text-base font-medium hover:bg-[var(--color-accent)]/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-[var(--color-accent)]/20"
                        >
                            {saving && (
                                <Loader2
                                    size={18}
                                    strokeWidth={2.25}
                                    className="animate-spin"
                                />
                            )}
                            {saving ? "Saving…" : "Enter typecircle"}
                            {!saving && <ArrowRight size={18} strokeWidth={2.25} />}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
