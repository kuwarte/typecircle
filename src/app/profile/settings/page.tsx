"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "default", label: "Default", bg: "#f7f3ec", ink: "#181a20", accent: "#5b8c5a" },
  { value: "dark", label: "Dark", bg: "#181a20", ink: "#f7f3ec", accent: "#5b8c5a" },
  { value: "stone", label: "Stone", bg: "#f5f0e8", ink: "#2c2c2c", accent: "#8b7355" },
  { value: "slate", label: "Slate", bg: "#f0f4f8", ink: "#1e2a3a", accent: "#4a7fa5" },
];

const FONT_SIZES = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState("default");
  const [fontSize, setFontSize] = useState("md");
  const [compactFeed, setCompactFeed] = useState(false);
  const [showType, setShowType] = useState(true);

  return (
    <div className="max-w-xl">
      <h1 className="font-heading font-bold text-2xl tracking-tight mb-8">Settings</h1>

      <div className="flex flex-col gap-10">
        {/* Theme */}
        <Section title="Theme" description="Choose how typecircle looks for you.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border-2 p-3 transition-colors text-left",
                  theme === t.value ? "border-[var(--color-accent)]" : "border-black/10 hover:border-black/20"
                )}
              >
                <div
                  className="w-full h-10 rounded-lg flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: t.bg, border: `1px solid ${t.ink}10` }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
                  <div className="w-5 h-1.5 rounded-full" style={{ backgroundColor: t.ink, opacity: 0.3 }} />
                </div>
                <span className="text-xs font-medium text-[var(--color-ink)]/70">{t.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Font size */}
        <Section title="Font size" description="Adjust the reading size across the app.">
          <div className="flex gap-2">
            {FONT_SIZES.map((f) => (
              <button
                key={f.value}
                onClick={() => setFontSize(f.value)}
                className={cn(
                  "flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-colors",
                  fontSize === f.value
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)]"
                    : "border-black/10 text-[var(--color-ink)]/60 hover:border-black/20"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Display */}
        <Section title="Display" description="Control what's visible in your feed and profile.">
          <div className="flex flex-col gap-3">
            <Toggle
              label="Show type badge on posts"
              description="Display your Enneagram type next to your posts."
              checked={showType}
              onChange={setShowType}
            />
            <Toggle
              label="Compact feed"
              description="Show more posts with less spacing."
              checked={compactFeed}
              onChange={setCompactFeed}
            />
          </div>
        </Section>

        {/* Danger zone */}
        <Section title="Account" description="Irreversible actions for your account.">
          <button className="rounded-full border-2 border-red-200 text-red-500 px-5 py-2 text-sm font-medium hover:bg-red-50 transition-colors">
            Delete account
          </button>
        </Section>
      </div>

      <button className="mt-10 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-6 py-2.5 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors">
        Save settings
      </button>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">{title}</h2>
        <p className="text-xs text-[var(--color-ink)]/45 mt-0.5">{description}</p>
      </div>
      <div className="h-px bg-black/5" />
      {children}
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium text-[var(--color-ink)]/80">{label}</p>
        <p className="text-xs text-[var(--color-ink)]/40 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-5.5 rounded-full transition-colors shrink-0",
          checked ? "bg-[var(--color-accent)]" : "bg-black/15"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
