"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/services/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type Profile = {
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  primary_type: number | null;
  wing: number | null;
  dominant_instinct: string;
  instinct_stack: string;
};

export default function ProfilePage() {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<Profile>({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
    primary_type: null,
    wing: null,
    dominant_instinct: "",
    instinct_stack: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);

      const { data } = await supabase
        .from("profiles")
        .select("username, full_name, bio, avatar_url, primary_type, wing, dominant_instinct, instinct_stack")
        .eq("id", session.user.id)
        .single();

      if (data) setForm((f) => ({ ...f, ...data }));
      setLoading(false);
    }
    load();
  }, []);

  function set(key: keyof Profile, value: string | number | null) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("Avatar upload failed.");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    set("avatar_url", publicUrl);
    setUploading(false);
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setError("");

    const { error: saveError } = await supabase
      .from("profiles")
      .update({
        username: form.username,
        full_name: form.full_name,
        bio: form.bio,
        avatar_url: form.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setSaving(false);
    if (saveError) setError(saveError.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }

  const initials = form.username?.slice(0, 2).toUpperCase() || "?";

  if (loading) return <div className="text-sm text-[var(--color-ink)]/40">Loading…</div>;

  return (
    <div className="max-w-xl">
      <h1 className="font-heading font-bold text-2xl tracking-tight mb-8">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={form.avatar_url} alt={form.username} />
            <AvatarFallback className="bg-[var(--color-accent)] text-[var(--color-paper)] text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center hover:bg-[var(--color-ink)]/80 transition-colors"
          >
            <Camera size={13} strokeWidth={2} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="text-sm font-medium">{form.username || "—"}</p>
          <p className="text-xs text-[var(--color-ink)]/40 mt-0.5">
            {uploading ? "Uploading…" : "Click the camera to change"}
          </p>
        </div>
      </div>

      {/* Editable fields */}
      <div className="flex flex-col gap-5">
        <Field label="Username">
          <input
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            className={inputCls()}
            placeholder="jasper_kw"
          />
        </Field>

        <Field label="Full name">
          <input
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            className={inputCls()}
            placeholder="Jasper"
          />
        </Field>

        <Field label="Bio">
          <textarea
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            rows={3}
            className={cn(inputCls(), "resize-none")}
            placeholder="A short bio about yourself…"
          />
        </Field>
      </div>

      {/* Type results — read only */}
      <div className="mt-8 rounded-2xl bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-paper)]/40 mb-4">
          Your type results
        </p>
        <div className="grid grid-cols-2 gap-4">
          <TypeStat label="Primary type" value={form.primary_type ? `Type ${form.primary_type}` : "—"} />
          <TypeStat label="Wing" value={form.wing ? `w${form.wing}` : "—"} />
          <TypeStat label="Dominant instinct" value={form.dominant_instinct?.toUpperCase() || "—"} />
          <TypeStat label="Instinct stack" value={form.instinct_stack || "—"} />
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--color-ink)]/35">
        Results come from your quiz.{" "}
        <a href="/quiz" className="underline hover:text-[var(--color-ink)]/60 transition-colors">
          Retake the quiz
        </a>{" "}
        to update them.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-8 rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] px-6 py-2.5 text-sm font-medium hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}

function TypeStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[var(--color-paper)]/40 mb-1">{label}</p>
      <p className="font-heading font-semibold text-lg">{value}</p>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--color-ink)]/70">
        {label}
        {hint && <span className="ml-2 text-xs text-[var(--color-ink)]/35 font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function inputCls() {
  return "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)] transition-colors";
}
