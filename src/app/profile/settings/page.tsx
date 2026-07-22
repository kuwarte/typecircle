"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const THEMES = [
  {
    value: "default",
    label: "Default",
    bg: "#f7f3ec",
    ink: "#181a20",
    accent: "#5b8c5a",
  },
  {
    value: "dark",
    label: "Dark",
    bg: "#181a20",
    ink: "#f7f3ec",
    accent: "#5b8c5a",
  },
  {
    value: "stone",
    label: "Stone",
    bg: "#f5f0e8",
    ink: "#2c2c2c",
    accent: "#8b7355",
  },
  {
    value: "slate",
    label: "Slate",
    bg: "#f0f4f8",
    ink: "#1e2a3a",
    accent: "#4a7fa5",
  },
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
      <h1 className="font-heading font-bold text-2xl tracking-tight mb-1">
        Settings
      </h1>
      <p className="text-sm text-[var(--color-ink)]/45 mb-8">
        Personalize how typecircle looks and feels.
      </p>

      <div className="flex flex-col gap-10">
        {/* Theme */}
        <Section
          title="Theme"
          description="Choose how typecircle looks for you."
          comingSoon
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                disabled
                onClick={() => setTheme(t.value)}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border p-3 transition-colors text-left cursor-not-allowed opacity-50",
                  theme === t.value
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                    : "border-[var(--color-ink)]/10",
                )}
              >
                <div
                  className="w-full h-10 rounded-lg flex items-center justify-center gap-1.5"
                  style={{
                    backgroundColor: t.bg,
                    border: `1px solid ${t.ink}10`,
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: t.accent }}
                  />
                  <div
                    className="w-5 h-1.5 rounded-full"
                    style={{ backgroundColor: t.ink, opacity: 0.3 }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--color-ink)]/70">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </Section>

        {/* Font size */}
        <Section
          title="Font size"
          description="Adjust the reading size across the app."
          comingSoon
        >
          <div className="flex gap-2">
            {FONT_SIZES.map((f) => (
              <button
                key={f.value}
                disabled
                onClick={() => setFontSize(f.value)}
                className={cn(
                  "flex-1 rounded-full border py-2.5 text-sm font-medium transition-colors cursor-not-allowed opacity-50",
                  fontSize === f.value
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)]"
                    : "border-[var(--color-ink)]/10 text-[var(--color-ink)]/60",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Section>

        {/* Display */}
        <Section
          title="Display"
          description="Control what's visible in your feed and profile."
          comingSoon
        >
          <div className="flex flex-col gap-3">
            <Toggle
              label="Show type badge on posts"
              description="Display your Enneagram type next to your posts."
              checked={showType}
              onChange={setShowType}
              disabled
            />
            <Toggle
              label="Compact feed"
              description="Show more posts with less spacing."
              checked={compactFeed}
              onChange={setCompactFeed}
              disabled
            />
          </div>
        </Section>
      </div>

      <button
        disabled
        className="mt-10 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-6 py-2.5 text-sm font-medium opacity-50 cursor-not-allowed"
      >
        Save settings
      </button>

      {/* Danger zone — sits below Save since it's unrelated to it */}
      <div className="mt-10">
        <Section title="Account" description="Manage your account." comingSoon>
          <div className="rounded-2xl border border-[var(--color-ink)]/10 px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-ink)]/70">
                Delete account
              </p>
            </div>
            <button
              disabled
              className="shrink-0 rounded-full border border-[var(--color-ink)]/10 text-[var(--color-ink)]/35 px-4 py-2 text-xs font-semibold cursor-not-allowed"
            >
              Delete account
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  comingSoon,
  children,
}: {
  title: string;
  description: string;
  comingSoon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-semibold text-sm tracking-tight text-[var(--color-ink)]">
            {title}
          </h2>
          {comingSoon && (
            <span className="rounded-full bg-[var(--color-ink)]/8 text-[var(--color-ink)]/45 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5">
              Coming soon
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-ink)]/45 mt-0.5">
          {description}
        </p>
      </div>
      <div className="h-px bg-[var(--color-ink)]/10" />
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-1",
        disabled && "opacity-50",
      )}
    >
      <div>
        <p className="text-sm font-medium text-[var(--color-ink)]/80">
          {label}
        </p>
        <p className="text-xs text-[var(--color-ink)]/40 mt-0.5">
          {description}
        </p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors shrink-0",
          disabled && "cursor-not-allowed",
          checked ? "bg-[var(--color-accent)]" : "bg-[var(--color-ink)]/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[var(--color-paper)] shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
