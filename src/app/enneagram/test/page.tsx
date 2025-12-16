"use client";

import { useState } from "react";
import { enneagramQuestions, enneagramTypes } from "@/data/enneagram-questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const handleAnswer = (rating: number) => {
    const newAnswers = { ...answers, [currentQuestion]: rating };
    setAnswers(newAnswers);

    if (currentQuestion < enneagramQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, number>) => {
    const typeScores: Record<number, number> = {};
    
    enneagramQuestions.forEach((question, index) => {
      const answer = finalAnswers[index] || 0;
      const type = question.type;
      typeScores[type] = (typeScores[type] || 0) + answer;
    });

    const dominantType = Object.entries(typeScores).reduce((a, b) => 
      typeScores[parseInt(a[0])] > typeScores[parseInt(b[0])] ? a : b
    )[0];

    setResult(parseInt(dominantType));
    setShowResults(true);
  };

  const progress = ((currentQuestion + 1) / enneagramQuestions.length) * 100;

  if (showResults && result) {
    const resultType = enneagramTypes[result as keyof typeof enneagramTypes];
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
                <span className="text-3xl font-bold text-[var(--typecircle-green)]">{result}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-foreground">
                You are Type {result}
              </h1>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--typecircle-green)]">
                {resultType.name}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {resultType.description}
              </p>
            </div>
            
            <div className="space-y-4 text-left">
              <div className="glass-subtle rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2">Core Motivation</h3>
                <p className="text-muted-foreground">{resultType.motivation}</p>
              </div>
              <div className="glass-subtle rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-2">Basic Fear</h3>
                <p className="text-muted-foreground">{resultType.fear}</p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <Button 
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                  setResult(null);
                }}
                className="flex-1 glass-button"
              >
                Retake Test
              </Button>
              <Button asChild className="flex-1 bg-[var(--typecircle-green)] text-white hover:bg-[var(--typecircle-green)]/90">
                <Link href="/rooms">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-6">
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
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-6 text-foreground leading-relaxed">
              {enneagramQuestions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
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
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="glass-subtle"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(Math.min(enneagramQuestions.length - 1, currentQuestion + 1))}
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
