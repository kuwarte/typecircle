"use client";

import { useState } from "react";
import { enneagramQuestions, enneagramTypes } from "@/data/enneagram-questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { updateEnneagramType } from "@/services/supabase/actions/profile";
import { FileText, Target, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import AssessmentLoading from "@/components/assessment-loading";
import { motion, AnimatePresence } from "framer-motion";

export default function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (rating: number) => {
    const newAnswers = { ...answers, [currentQuestion]: rating };
    setAnswers(newAnswers);

    if (currentQuestion < enneagramQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 100);
    } else {
      setTimeout(() => {
        calculateResult(newAnswers);
      }, 100);
    }
  };

  const calculateResult = async (finalAnswers: Record<number, number>) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const typeScores: Record<number, number> = {};

    enneagramQuestions.forEach((question, index) => {
      const answer = finalAnswers[index] || 0;
      const type = question.type;
      typeScores[type] = (typeScores[type] || 0) + answer;
    });

    const dominantType = Object.entries(typeScores).reduce((a, b) =>
      typeScores[parseInt(a[0])] > typeScores[parseInt(b[0])] ? a : b
    )[0];

    const resultType = parseInt(dominantType);
    setResult(resultType);

    await updateEnneagramType(resultType);

    setIsLoading(false);
    setShowResults(true);
  };

  const progress = ((currentQuestion + 1) / enneagramQuestions.length) * 100;

  if (showInstructions) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 md:py-0 px-1 md:px-6 bg-gradient-to-b from-background via-background to-muted/10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
                <FileText className="w-8 h-8 text-[var(--typecircle-green)]" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-foreground">
                Enneagram Assessment Instructions
              </h1>
            </div>

            <div className="space-y-4 text-left mb-8">
              <div className="glass-subtle rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[var(--typecircle-green)]" />
                  <h3 className="font-semibold text-foreground">
                    How to Answer
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Rate each statement based on how true it feels for you most of
                  the time, not just occasionally.
                </p>
              </div>
              <div className="glass-subtle rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[var(--typecircle-green)]" />
                  <h3 className="font-semibold text-foreground">Be Honest</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Choose answers that reflect your natural tendencies, not how
                  you think you should be.
                </p>
              </div>
              <div className="glass-subtle rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[var(--typecircle-green)]" />
                  <h3 className="font-semibold text-foreground">
                    Take Your Time
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  There are {enneagramQuestions.length} questions. Think about
                  each one carefully.
                </p>
              </div>
              <div className="glass-subtle rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[var(--typecircle-green)]" />
                  <h3 className="font-semibold text-foreground">
                    No Wrong Answers
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  This assessment helps identify patterns - answer based on your
                  core motivations.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowInstructions(false)}
              className="btn-typecircle px-8 py-3 w-full"
            >
              Start Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <AssessmentLoading />;
  }

  if (showResults && result) {
    const resultType = enneagramTypes[result as keyof typeof enneagramTypes];
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 md:py-0 px-1 md:px-4 bg-gradient-to-b from-background via-background to-muted/10">
        <div className="max-w-2xl mx-auto text-center w-full">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
                <span className="text-2xl sm:text-3xl font-bold text-[var(--typecircle-green)]">
                  {result}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground">
                You are Type {result}
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[var(--typecircle-green)]">
                {resultType.name}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6">
                {resultType.description}
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="glass-subtle rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  Core Motivation
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {resultType.motivation}
                </p>
              </div>
              <div className="glass-subtle rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  Basic Fear
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {resultType.fear}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                  setResult(null);
                }}
                className="flex-1 glass-button text-sm sm:text-base py-2 sm:py-3"
              >
                Retake Test
              </Button>
              <Button
                asChild
                className="flex-1 btn-typecircle text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href="/rooms">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 md:py-0 px-1 md:px-6 bg-gradient-to-b from-background via-background to-muted/10">
      <div className="max-w-2xl mx-auto w-full">
        <div className="glass-card rounded-3xl p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-foreground">
                Enneagram Assessment
              </h1>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {enneagramQuestions.length}
              </span>
            </div>
            <Progress
              value={progress}
              className="h-2 transition-all duration-500"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-8"
            >
              <h2 className="text-xl font-medium mb-6 text-foreground leading-relaxed">
                {enneagramQuestions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => handleAnswer(rating)}
                    className="w-full p-4 text-left glass-subtle rounded-xl hover:bg-white/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-[var(--typecircle-green)]/30 group-hover:border-[var(--typecircle-green)] transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--typecircle-green)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="font-medium text-foreground">
                        {rating === 1 && "Strongly Disagree"}
                        {rating === 2 && "Disagree"}
                        {rating === 3 && "Neutral"}
                        {rating === 4 && "Agree"}
                        {rating === 5 && "Strongly Agree"}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
              className="glass-subtle"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion(
                  Math.min(enneagramQuestions.length - 1, currentQuestion + 1)
                )
              }
              disabled={currentQuestion === enneagramQuestions.length - 1}
              className="glass-subtle"
            >
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
