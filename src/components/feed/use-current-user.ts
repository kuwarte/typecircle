import { useEffect, useState } from "react";
import { createClient } from "@/services/supabase/client";
import type { Profile } from "./types";

/** Tracks the logged-in user's id and their own profile row, so the
 *  composer avatar isn't a generic placeholder. Assumes `profiles.id`
 *  matches the auth user id. */
export function useCurrentUser(supabase: ReturnType<typeof createClient>) {
  const [userId, setUserId] = useState<string | null>(null);
  const [ownProfile, setOwnProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (alive) setUserId(session?.user.id ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user.id ?? null);
      },
    );

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!userId) {
      setOwnProfile(null);
      return;
    }
    let alive = true;
    supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (alive) setOwnProfile((data as Profile) ?? null);
      });
    return () => {
      alive = false;
    };
  }, [userId, supabase]);

  return { userId, ownProfile };
}
