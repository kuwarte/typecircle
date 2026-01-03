"use client";

import { useState } from "react";
import { enneagramFAQ } from "@/data/enneagram-faq";
import { enneagramTypes } from "@/data/enneagram-questions";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function EnneagramFAQ() {
  const [activeSection, setActiveSection] = useState<string>("general");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container mx-auto px-1 md:px-6 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
            <BookOpen className="w-8 h-8 text-[var(--typecircle-green)]" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Enneagram Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the Enneagram personality system,
            types, wings, and subtypes.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Sections</h3>
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveSection("general")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "general"
                      ? "bg-[var(--typecircle-green)]/20 text-[var(--typecircle-green)]"
                      : "hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  General FAQ
                </button>
                <button
                  onClick={() => setActiveSection("types")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === "types"
                      ? "bg-[var(--typecircle-green)]/20 text-[var(--typecircle-green)]"
                      : "hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  Type Details
                </button>
                <Link
                  href="/enneagram/test"
                  className="block w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-muted/50 text-muted-foreground"
                >
                  Take Assessment
                </Link>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeSection === "general" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Frequently Asked Questions
                </h2>
                {enneagramFAQ.general.map((faq, index) => (
                  <div
                    key={index}
                    className="glass-card rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleExpanded(`general-${index}`)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-foreground">
                        {faq.question}
                      </h3>
                      {expandedItems.has(`general-${index}`) ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {expandedItems.has(`general-${index}`) && (
                      <div className="px-6 pb-6">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeSection === "types" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground mb-6 text-center md:text-left">
                  Enneagram Types Deep Dive
                </h2>
                <div className="grid gap-6">
                  {Object.entries(enneagramTypes).map(([typeNum, typeInfo]) => {
                    const typeDetails =
                      enneagramFAQ.typeDetails[
                        parseInt(typeNum) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
                      ];
                    return (
                      <div key={typeNum} className="glass-card rounded-2xl p-6">
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 p-2 md:p-0 rounded-full bg-[var(--typecircle-green)]/20 flex items-center justify-center">
                            <span className="text-xl font-bold text-[var(--typecircle-green)]">
                              {typeNum}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Type {typeNum}: {typeInfo.name}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {typeInfo.description}
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="glass-subtle rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="w-4 h-4 text-[var(--typecircle-green)]" />
                                  <span className="font-medium text-foreground">
                                    Motivation
                                  </span>
                                </div>
                                <p className="text-muted-foreground">
                                  {typeInfo.motivation}
                                </p>
                              </div>
                              <div className="glass-subtle rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users className="w-4 h-4 text-[var(--typecircle-green)]" />
                                  <span className="font-medium text-foreground">
                                    Basic Fear
                                  </span>
                                </div>
                                <p className="text-muted-foreground">
                                  {typeInfo.fear}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-semibold text-foreground mb-3">
                            Wings
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(typeDetails.wings).map(
                              ([wing, description]) => (
                                <div
                                  key={wing}
                                  className="glass-subtle rounded-lg p-4"
                                >
                                  <h5 className="font-medium text-[var(--typecircle-green)] mb-2">
                                    {wing}
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    {description}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-semibold text-foreground mb-3">
                            Integration & Disintegration
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="glass-subtle rounded-lg p-4">
                              <h5 className="font-medium text-green-600 mb-2">
                                Integration (Growth)
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {typeDetails.arrows.integration}
                              </p>
                            </div>
                            <div className="glass-subtle rounded-lg p-4">
                              <h5 className="font-medium text-red-600 mb-2">
                                Disintegration (Stress)
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {typeDetails.arrows.disintegration}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-3">
                            Instinctual Subtypes
                          </h4>
                          <div className="space-y-3">
                            <div className="glass-subtle rounded-lg p-4">
                              <h5 className="font-medium text-[var(--typecircle-green)] mb-2">
                                Self-Preservation (SP)
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {typeDetails.subtypes.sp}
                              </p>
                            </div>
                            <div className="glass-subtle rounded-lg p-4">
                              <h5 className="font-medium text-[var(--typecircle-green)] mb-2">
                                Social (SO)
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {typeDetails.subtypes.so}
                              </p>
                            </div>
                            <div className="glass-subtle rounded-lg p-4">
                              <h5 className="font-medium text-[var(--typecircle-green)] mb-2">
                                Sexual/One-to-One (SX)
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {typeDetails.subtypes.sx}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ready to Discover Your Type?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Take our comprehensive Enneagram assessment to discover your
              personality type and connect with others who share your
              perspective.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-typecircle">
                <Link href="/enneagram/test">Take Assessment</Link>
              </Button>
              <Button asChild className="glass-button">
                <Link href="/rooms">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
