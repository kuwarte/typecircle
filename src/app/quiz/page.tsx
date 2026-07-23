"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/services/supabase/client";
import { QUIZ_QUESTIONS, scoreQuiz } from "@/lib/quiz-data";
import { TYPES } from "@/lib/types-data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
  Loader2,
  Compass,
  Sparkles,
  Clock,
  Check,
  Brain,
  Heart,
  Footprints,
  Feather,
  Send,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

type Step = "onboarding" | "quiz" | "analyzing" | "result";

type AiInsight = {
  summary: string | null;
  traits: { head: number; heart: number; body: number; wing: number };
};

type ChatMessage = { role: "user" | "assistant"; content: string };

const SCALE = [
  { value: 1, label: "Not me" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Very me" },
];

const ONBOARDING_STEPS = [
  {
    icon: Compass,
    title: "Answer honestly",
    description:
      "Go with how you actually react day to day, not how you wish you would.",
  },
  {
    icon: Sparkles,
    title: "There's no right answer",
    description:
      "This is a mirror, not a test to pass. Consistency matters more than sounding good.",
  },
  {
    icon: Clock,
    title: "About 8 minutes",
    description: `${QUIZ_QUESTIONS?.length || 0} short statements, rated 1–5. Nothing is saved until the end.`,
  },
];

// Cycled while we wait on the AI insight call. Text messages only now —
// the icon is replaced by the ASCII animation below.
const ANALYZE_STEPS = [
  { message: "Reading your answers…" },
  { message: "Mapping how you connect…" },
  { message: "Weighing instinct against intention…" },
  { message: "Shaping your wing…" },
];

// --- Custom ASCII loading animation -----------------------------------
// The two frames swap back and forth while results are being analyzed.
const ASCII_FRAMES = [
  `                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                   ..                                               
                                                    .::::.                                          
                                             ....  :..:   ..                                        
                                    .:.....::. :..:. .. ...:.                                       
                                   .:    :::.  :::-::.::  .:.                                       
                                   :.  .::::::::::  .:::. :.:                                       
                                   .:.--:  -..:::..::::::-: :                                       
                                    ::-:. :-::... :-::-::-::.                                       
                                    ::::. :--:   :-:::-.::.:.                                       
                                    .-.:. .:.:.::: .::.-: .:--.                                     
                                     ::.::-:.:.:--::.  :.:..:.                                      
                                     ..  .:::  .:.:. .:::..::                                       
                                      :.   ::...::::-::::. ..                                       
                                        ...:.   .. .:..:  :.                                        
                                            ..  :.:.  ::::                                          
                                             .:...                                                  
                                                  .                                                 
                                                 --                                                 
                                                .+#-                                                
                                                                                                    
                                                .*=                                                 
                                                 ::                                                 
                                                                                                    
                                                :+                                                  
                                                                                                    
                                           :=*#%@@%*-                                               
                                        .*@@@@@@@@@@#+***-                                          
                                       .+%**#@@@@%-.-#%%@@@=                                        
                                      .*##*+===-:.      :%@=                                        
                                      :*%:               :@*                                        
                                       -#. :=:.          .@%:                                       
                                       =#*+-:=#%-         %@+:                                      
                                       -#. .+*::=.   .-+*=@#:*+                                     
                                       :#: *#=*+   -=++ +==. #*                                     
                                       .--.*  .*:::+*:  =+%++%:                                     
                                     :##+: *:  =: *..-+-:.-: =+                                     
                                    =@=:-  .*+=- .%-   .-:.:+-*:                                    
                                   -%- +  .:.    *@+   -**++: -=                                    
                                  .%= *+***##:  =%*:  ::   -#..*.                                   
                                  -%.-@--#*#:       =%--*%%+: .+-                                   
                                  +#:#.-@*+#@-     -++@#:   :%@%:                                   
                                  +%=: ...    :#:  :##.  .+%#-:#-                                   
                                   :=%@%*=:.   +#%@@#= :*@*.   -%:                                  
                                    -@: .-#@@=.%==@%:*:--:%-    *@                                  
                                   .%+    -:  #+  *#: +:.-++-   .@+                                 
                                   ##.  :-.==+%.  #@- *%-   ++   +%:                                
                                  #%:  =:.  :%=   %@= .**    -#.  #*.                               
                                 *@- .=   =:+@=  .@@-  .##.   :*: :%=                               
                                =@-.-:    .##.   :@@-   .#%:   .+*.-%:                              
                               -@=:+     =@=     :@@-     =%-    .+++@:                             
                              -@++:    .*%.      :@@=      =@=      =@#.                            
                             -@#=.    .#*.       :@@#.      :%*.      *%:                           
                            :#+.     -@=         :@@@:       .*#.     :-#                           
                         -==+@:     +%-+**######%%%%%%%%%%%%%%%%@:     .%%+*###*=                   
                            .#*   .#*.                          :%#:  .#@=                          
                             :%*:=@=                              -##*@@%+-                         
                                                                     .:...                          
                                                                                                    
                                       -*#%+==%@@%##++-:.                                           
                                         .:=++@@@@@@@@@@@@@@%=*=:                                   
                                              -=*#%%@@@@@@@%: .*@@:                                 
                                                      .:-=*#*++%@%:                                 
                                                               ..                                   
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    `,
  `                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                       ...                                          
                                                       .::  ..                                      
                                                .:::... ..   .:                                     
                                               .: .:.-:::::. .:                                     
                                               :.:::::..:::. :.:                                    
                                               ::.:..  ::::::. :                                    
                                              .-::..:.:: ::. ::.                                    
                                              .:::.:.--:::. .:.                                     
                                                 .:::--::.. ..                                      
                                                    .:    .                                         
                                                                                                    
                                                      .                                             
                                                     %@%.                                           
                                                                                                    
                                                                                                    
                                                     %@:                                            
                                                                                                    
                                                     .                                              
                                                    -+.                                             
                                                               -.                                   
                                                            .-=+##%*+-                              
                                                         .=**##*++#@#%@-                            
                                                       -#+:.   .:=*##@@@*.                          
                                                     :%*%=           .+@%-                          
                                                    *#=#+--.    .-#=  .%@=                          
                                                  .*%+.  =-        **:@@@*.                         
                                                  -:#:  :+.  #@*:   .@@@@@-                         
                                                  ...:***=  #=.  == :@@@@#:                         
                                                .-%@@@%-    *-. :+- #@@@%-                          
                                               =*             :-: .#@@@#:                           
                                               %:    ...          ==. -#.                           
                                              .@:::=####+.           :%+                            
                                              .@+%+++**++++-.   .. -*#-                             
                                               +#:====++*#-:#: +%#+=:                               
                                                =#:.+@@+==: :@%+.                                   
                                                 .-#@=**---. %#+:                                   
                                            .=*#*-.-%+-*#-.  ##:*+:                                 
                                        -#%%*-.       -%-    #%  .:-=*+:                            
                                       *@*.         -%@@#:.  +@.       .-*=.                        
                                      =@*          **.:%:==   %*        .*@-                        
                                     :@%              .@+ :*%@@**.       =@+                        
                                    .%@.   =:         .@*  *:   -#:      -%#.                       
                                    *@-    +:         :@*  :#.   +#:     .#@.                       
                                   -%*     +-         -@*   *%   .*%.    .*@:                       
                                  .*%:     =+.        =@*   +%.   .#%.    *@:                       
                                  =@=      +*.        +@*    %*    .%@.   +@-                       
                                 :%#:     :%#.        *@#.   :@:    .%%:  +@=                       
                                .+%-     .+%*.        *@%:    *#.    .%%: =@+                       
                                -@+    .-*%@@%##=:    +@%-    .%=     .#%:=@+                       
                               .%#.   -#*=-.   #-:-=. =@@+     -#:     .**+@+                       
                               +@=             %=  .*+*@@+     .**.      .+@+                       
                 .:-=+******#**@#           .=#@%%%%%@@@@@%%###+-#=       +@#********+-             
                              =@-      .-*%%*=:.      ........:. =%:      +@-........               
                               .:..-*%@#=:.                      .**.    .*#.                       
                                 .:::.                       ..   -%#=. .**.                        
                                                   .:=*%@@@*. .+    :%%#=.                          
                                            .-*%@@@@@@@@@@@@*%#.                                    
                                       .=##@@@@@@@@@@@@%#=.                                         
                                   .:*@=  .#@@@@@%#=:                                               
                                 .+@@@@#::+%%#=:                                                    
                                                                                                    
                                                                                                    
                                                                                                    `,
];
// ------------------------------------------------------------------------

const ONBOARDING_STORAGE_KEY = "typecircle:quiz-onboarding-last-seen";

function seenOnboardingToday() {
  if (typeof window === "undefined") return true;
  try {
    const last = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const today = new Date().toDateString();
    return last === today;
  } catch {
    return true;
  }
}

function markOnboardingSeen() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      new Date().toDateString(),
    );
  } catch {
    // localStorage unavailable — non-critical, just skip persisting
  }
}

// Small deterministic hash so placeholder stat values stay stable for a
// given result instead of reshuffling on every re-render.
function seededPercent(seed: string, min = 40, max = 95) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const span = max - min;
  return min + (Math.abs(hash) % span);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function QuizPage() {
  const router = useRouter();
  // Memoize supabase client to avoid re-creation if component re-renders heavily
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const [step, setStep] = useState<Step>(() => {
    return seenOnboardingToday() ? "quiz" : "onboarding";
  });
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    primary_type: number;
    wing: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  // AI insight (summary + real trait scores)
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [analyzeIndex, setAnalyzeIndex] = useState(0);

  // ASCII loading animation frame (cycles independently/faster than the
  // message text above)
  const [asciiFrame, setAsciiFrame] = useState(0);

  // Chat about your type
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatPanelRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  function beginAfterOnboarding() {
    markOnboardingSeen();
    setStep("quiz");
  }

  async function fetchInsight(
    scored: { primary_type: number; wing: number },
    allAnswers: Record<string, number>,
  ) {
    setAiError(null);
    const minDelay = wait(2000); // Give the new loading animation time to breathe

    try {
      const [res] = await Promise.all([
        fetch("/api/type-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            primary_type: scored.primary_type,
            wing: scored.wing,
            answers: allAnswers,
          }),
        }),
        minDelay,
      ]);

      if (!res.ok) throw new Error("Insight request failed");
      const data = await res.json();
      setAiInsight(data);
    } catch (err) {
      console.error(err);
      setAiError(
        "Couldn't reach the AI insight service — showing standard results instead.",
      );
      setAiInsight(null);
    } finally {
      setStep("result");
    }
  }

  function handleAnswer(value: number) {
    if (!QUIZ_QUESTIONS?.length) return;
    const question = QUIZ_QUESTIONS[qIndex];
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      const scored = scoreQuiz(next);
      setResult(scored);
      setAiInsight(null);
      setChatMessages([]);
      setChatOpen(false);
      setStep("analyzing");
      fetchInsight(scored, next);
    }
  }

  function goBackQuestion() {
    if (qIndex === 0) return;
    setQIndex(qIndex - 1);
  }

  // Keyboard shortcuts: 1–5 answer the current question while on the quiz step
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

  // Cycle the message on the analyzing screen smoothly
  useEffect(() => {
    if (step !== "analyzing") return;
    setAnalyzeIndex(0);
    const id = setInterval(() => {
      setAnalyzeIndex((i) => (i + 1) % ANALYZE_STEPS.length);
    }, 1200);
    return () => clearInterval(id);
  }, [step]);

  // Cycle the ASCII animation frame (independent, faster interval)
  useEffect(() => {
    if (step !== "analyzing") return;
    setAsciiFrame(0);
    const id = setInterval(() => {
      setAsciiFrame((f) => (f === 0 ? 1 : 0));
    }, 500); // swap speed — tune to taste
    return () => clearInterval(id);
  }, [step]);

  // Bring the whole "Ask AI" panel into view when it opens (NOT the
  // footer — using `block: "nearest"` on the panel itself instead of
  // relying on the end-of-messages ref) and focus the input.
  useEffect(() => {
    if (!chatOpen) return;
    chatPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
    const id = setTimeout(() => {
      chatInputRef.current?.focus({ preventScroll: true });
    }, 300);
    return () => clearTimeout(id);
  }, [chatOpen]);

  // Only autoscroll to the latest message once there's actually a
  // conversation going — prevents the empty-panel scroll jumping to
  // whatever sits at the bottom of the page (e.g. the footer).
  useEffect(() => {
    if (!chatOpen || chatMessages.length === 0) return;
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [chatMessages, chatOpen]);

  async function handleSave() {
    if (!result || !supabase) return;
    setSaving(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      await supabase
        .from("profiles")
        .update({
          primary_type: result.primary_type,
          wing: result.wing,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      router.push("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function sendChatMessage() {
    const trimmed = chatInput.trim();
    if (!trimmed || !result || chatLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const historyForRequest = chatMessages.map(({ role, content }) => ({
      role,
      content,
    }));

    setChatMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", content: "" },
    ]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/type-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_type: result.primary_type,
          wing: result.wing,
          message: trimmed,
          history: historyForRequest,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setChatMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry — I couldn't get a response just now. Try again?",
        };
        return copy;
      });
    } finally {
      setChatLoading(false);
    }
  }

  const safeLength = QUIZ_QUESTIONS?.length || 1;
  const progress =
    step === "result" || step === "analyzing"
      ? 100
      : (qIndex / safeLength) * 100;

  const typeData = result
    ? TYPES.find((t) => t.n === result.primary_type)
    : null;
  const currentAnswer = QUIZ_QUESTIONS?.[qIndex]
    ? answers[QUIZ_QUESTIONS[qIndex].id]
    : undefined;

  // Trait breakdown
  const stats = useMemo(() => {
    if (!result) return [];
    const seed = `${result.primary_type}-${result.wing}`;
    const traits = aiInsight?.traits;
    return [
      {
        icon: Brain,
        label: "Head center",
        description: "Thinking, analysis, and planning ahead.",
        value: traits?.head ?? seededPercent(seed + "head"),
      },
      {
        icon: Heart,
        label: "Heart center",
        description: "Feeling, image, and connection with others.",
        value: traits?.heart ?? seededPercent(seed + "heart"),
      },
      {
        icon: Footprints,
        label: "Body center",
        description: "Instinct, action, and gut response.",
        value: traits?.body ?? seededPercent(seed + "body"),
      },
      {
        icon: Feather,
        label: `Wing ${result.wing} influence`,
        description: "How strongly your wing flavors your core type.",
        value: traits?.wing ?? seededPercent(seed + "wing"),
      },
    ];
  }, [result, aiInsight]);

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <style jsx global>{`
        @keyframes quiz-step-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .quiz-step-in {
          animation: quiz-step-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes result-pop {
          0% {
            transform: scale(0.85);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .result-pop {
          animation: result-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Sleek analyzing animations */
        @keyframes fade-scale-in-out {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          20% {
            opacity: 1;
            transform: scale(1);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.05);
          }
        }
        .analyzing-sequence {
          animation: fade-scale-in-out 1.2s ease-in-out infinite;
        }

        /* Quick crossfade for the ASCII frame swap */
        @keyframes ascii-fade {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .ascii-fade-anim {
          animation: ascii-fade 0.5s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(0.9);
            opacity: 0;
          }
        }
        .pulse-ring-anim {
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        @keyframes dash-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .dash-spin-anim {
          animation: dash-spin 8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .quiz-step-in,
          .result-pop,
          .analyzing-sequence,
          .ascii-fade-anim,
          .pulse-ring-anim,
          .dash-spin-anim {
            animation: none !important;
          }
        }
      `}</style>

      {step !== "quiz" && step !== "analyzing" && (
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)]/50 hover:text-[var(--color-accent)] transition-colors mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 rounded-full"
        >
          <ArrowLeft size={16} strokeWidth={2.25} />
          Home
        </Link>
      )}

      {/* Main Container */}
      <div className="min-h-[500px] flex flex-col justify-between">
        {/* Onboarding */}
        {step === "onboarding" && (
          <div
            key="onboarding"
            className="quiz-step-in flex flex-col items-center justify-center h-full gap-10 max-w-xl mx-auto text-center"
          >
            <div className="w-full">
              <p className="text-sm font-semibold text-[var(--color-accent)] mb-6">
                Before you start
              </p>
              <div className="flex flex-col gap-6 text-left">
                {ONBOARDING_STEPS.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-start gap-5 p-5 rounded-3xl border border-[var(--color-ink)]/5 bg-[var(--color-ink)]/[0.02]"
                  >
                    <span className="shrink-0 w-11 h-11 rounded-2xl bg-[var(--color-paper)] border border-[var(--color-ink)]/10 text-[var(--color-accent)] flex items-center justify-center shadow-sm">
                      <Icon size={20} strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="font-heading font-semibold text-lg tracking-tight text-[var(--color-ink)]">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink)]/60">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button
                onClick={beginAfterOnboarding}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-8 py-3.5 text-base font-medium hover:bg-[var(--color-accent)]/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] shadow-sm shadow-[var(--color-accent)]/20"
              >
                Let's begin
                <ArrowRight size={18} strokeWidth={2.25} />
              </button>
            </div>
          </div>
        )}

        {/* Quiz */}
        {step === "quiz" && (
          <div className="flex flex-col justify-between h-full gap-10 max-w-2xl mx-auto w-full">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <button
                  onClick={goBackQuestion}
                  disabled={qIndex === 0}
                  aria-label="Previous question"
                  className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/5 hover:text-[var(--color-ink)]/80 disabled:opacity-0 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 active:scale-95"
                >
                  <ArrowLeft size={18} strokeWidth={2.25} />
                </button>
                <div className="flex-1 flex items-center gap-4">
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
                  <span className="text-xs font-medium text-[var(--color-ink)]/40 tabular-nums shrink-0">
                    {qIndex + 1} / {QUIZ_QUESTIONS?.length || 0}
                  </span>
                </div>
              </div>

              <div key={qIndex} className="quiz-step-in mt-10 min-h-[120px]">
                <h2 className="font-heading font-semibold text-2xl md:text-4xl tracking-tight leading-[1.3] text-[var(--color-ink)] text-center">
                  {QUIZ_QUESTIONS?.[qIndex]?.statement}
                </h2>
              </div>
            </div>

            <div className="max-w-md mx-auto w-full">
              <div
                key={`scale-${qIndex}`}
                className="quiz-step-in flex flex-col gap-2.5"
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

        {/* Analyzing (sleek loading state) */}
        {step === "analyzing" && (
          <div
            key="analyzing"
            className="quiz-step-in flex flex-col items-center justify-center h-[70vh] gap-12 text-center"
          >
            <div className="relative flex items-center justify-center w-full overflow-hidden">
              <pre
                key={asciiFrame}
                aria-hidden="true"
                className="ascii-fade-anim font-mono text-[4px] sm:text-[5px] md:text-[6px] leading-[1.05] text-[var(--color-accent)] text-center select-none whitespace-pre"
              >
                {ASCII_FRAMES[asciiFrame]}
              </pre>
            </div>

            {/* `relative` restored here so the absolutely-positioned message
                below centers against this box instead of the page. */}
            <div className="relative h-16 w-full flex flex-col items-center justify-start">
              {ANALYZE_STEPS.map(({ message }, i) =>
                i === analyzeIndex ? (
                  <p
                    key={i}
                    className="absolute inset-x-0 font-heading font-semibold text-xl tracking-tight text-[var(--color-ink)] analyzing-sequence"
                  >
                    {message}
                  </p>
                ) : null,
              )}
            </div>
          </div>
        )}

        {/* Result */}
        {step === "result" && result && (
          <div key="result" className="quiz-step-in flex flex-col gap-8">
            <div className="bg-[var(--color-ink)]/[0.02] border border-[var(--color-ink)]/10 rounded-3xl p-8 md:p-14 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 items-stretch">
                {/* Left: Type Info */}
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-5">
                      <span className="result-pop shrink-0 flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--color-accent)] text-[var(--color-paper)] font-heading font-bold text-3xl shadow-md shadow-[var(--color-accent)]/20 rotate-3">
                        {result.primary_type}
                      </span>
                      <div className="min-w-0">
                        {typeData && (
                          <h1 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-[var(--color-ink)] leading-tight">
                            {typeData.name}
                          </h1>
                        )}
                        <span className="inline-flex items-center gap-1.5 mt-2 rounded-full border border-[var(--color-ink)]/10 bg-[var(--color-paper)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                          <Feather size={12} strokeWidth={2.5} />
                          Wing {result.wing}
                        </span>
                      </div>
                    </div>

                    <p className="mt-8 text-[var(--color-ink)]/70 text-lg leading-relaxed font-medium">
                      {aiInsight?.summary ?? typeData?.blurb}
                    </p>

                    {aiError && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-500/10 text-rose-600/90 p-3 text-xs font-medium border border-rose-500/20">
                        <AlertCircle
                          size={14}
                          strokeWidth={2.5}
                          className="shrink-0 mt-0.5"
                        />
                        <p>{aiError}</p>
                      </div>
                    )}

                    <Link
                      href={`/types/${result.primary_type}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 rounded-full"
                    >
                      Explore Type {result.primary_type} in depth
                      <ArrowUpRight size={16} strokeWidth={2.5} />
                    </Link>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] text-[var(--color-paper)] px-6 py-3.5 text-sm font-semibold hover:bg-[var(--color-accent)]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/30 shadow-sm shadow-[var(--color-accent)]/20"
                    >
                      {saving && (
                        <Loader2
                          size={16}
                          strokeWidth={2.5}
                          className="animate-spin"
                        />
                      )}
                      {saving ? "Saving…" : "Save Results"}
                    </button>
                    <button
                      onClick={() => setChatOpen((v) => !v)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-2xl border-2 px-6 py-3.5 text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/30",
                        chatOpen
                          ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5"
                          : "border-[var(--color-ink)]/15 text-[var(--color-ink)]/70 hover:border-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/[0.02] hover:text-[var(--color-ink)]",
                      )}
                    >
                      <MessageCircle size={16} strokeWidth={2.5} />
                      Ask AI
                    </button>
                    <button
                      onClick={() => {
                        setStep("quiz");
                        setQIndex(0);
                        setAnswers({});
                        setResult(null);
                        setAiInsight(null);
                        setAiError(null);
                        setChatMessages([]);
                        setChatOpen(false);
                      }}
                      className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[var(--color-ink)]/15 text-[var(--color-ink)]/60 px-5 py-3.5 hover:border-[var(--color-ink)]/30 hover:text-[var(--color-ink)] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/30"
                      aria-label="Retake Quiz"
                    >
                      <RotateCcw size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Right: Trait Breakdown */}
                <div className="bg-[var(--color-paper)] border border-[var(--color-ink)]/10 rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <h2 className="font-heading font-semibold text-lg tracking-tight text-[var(--color-ink)]">
                      Trait Breakdown
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/35 bg-[var(--color-ink)]/5 px-2 py-1 rounded-md">
                      {aiInsight ? "AI-Scored" : "Preview"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-6">
                    {stats.map(({ icon: Icon, label, description, value }) => (
                      <div key={label} className="flex items-start gap-4">
                        <span className="shrink-0 w-10 h-10 rounded-xl text-[var(--color-accent)] flex items-center justify-center mt-1">
                          <Icon size={30} strokeWidth={2.25} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                              {label}
                            </h3>
                            <span className="text-sm font-bold text-[var(--color-accent)] tabular-nums shrink-0">
                              {value}%
                            </span>
                          </div>
                          <p className="mb-3 text-[13px] text-[var(--color-ink)]/50 leading-snug">
                            {description}
                          </p>
                          <div
                            className="h-2 rounded-full bg-[var(--color-ink)]/10 overflow-hidden border border-black/5"
                            role="progressbar"
                            aria-valuenow={value}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 transition-all duration-700 ease-out rounded-full"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Panel */}
            {chatOpen && (
              <div
                ref={chatPanelRef}
                className="quiz-step-in bg-[var(--color-ink)]/[0.02] border border-[var(--color-ink)]/10 rounded-3xl p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                    <MessageCircle size={16} strokeWidth={2.5} />
                  </div>
                  <h2 className="font-heading font-semibold text-lg tracking-tight text-[var(--color-ink)]">
                    Ask about Type {result.primary_type}
                  </h2>
                </div>

                <div className="max-h-80 overflow-y-auto flex flex-col gap-4 mb-6 pr-2">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-6 px-4">
                      <p className="text-sm font-medium text-[var(--color-ink)]/50">
                        Ask anything—how this type shows up at work, in
                        relationships, under stress, whatever you're curious
                        about.
                      </p>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[85%] px-5 py-3.5 text-sm leading-relaxed shadow-sm",
                        m.role === "user"
                          ? "self-end bg-[var(--color-accent)] text-[var(--color-paper)] rounded-2xl rounded-br-sm"
                          : "self-start bg-[var(--color-paper)] border border-[var(--color-ink)]/10 text-[var(--color-ink)]/90 rounded-2xl rounded-bl-sm",
                      )}
                    >
                      {m.content || (
                        <span className="inline-flex items-center gap-1 h-5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink)]/40 animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink)]/40 animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink)]/40 animate-bounce" />
                        </span>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendChatMessage();
                  }}
                  className="flex items-center gap-3 relative"
                >
                  <input
                    ref={chatInputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="How does this type handle conflict?"
                    disabled={chatLoading}
                    className="flex-1 rounded-full border border-[var(--color-ink)]/15 bg-[var(--color-paper)] px-5 py-3.5 pr-14 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 focus-visible:border-transparent disabled:opacity-50 shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    aria-label="Send message"
                    className="absolute right-2 shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/30 active:scale-[0.95]"
                  >
                    {chatLoading ? (
                      <Loader2
                        size={16}
                        strokeWidth={2.5}
                        className="animate-spin"
                      />
                    ) : (
                      <Send
                        size={15}
                        strokeWidth={2.5}
                        className="mr-0.5 mt-0.5"
                      />
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
