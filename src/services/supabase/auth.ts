// src/services/supabase/auth.ts
import { createClient } from "@/services/supabase/client";

export async function signInWithProvider(provider: "google" | "github") {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${location.origin}/auth/callback` },
  });
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  location.href = "/";
}
