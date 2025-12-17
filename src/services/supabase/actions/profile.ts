"use server";

import { getCurrentUser } from "../lib/getCurrentUser";
import { createClient } from "../server";

export async function updateEnneagramType(type: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();
  
  const { error } = await supabase
    .from("user_profile")
    .update({ enneagram_type: type })
    .eq("id", user.id);
    
  return { error };
}