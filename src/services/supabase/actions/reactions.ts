"use server";

import { createAdminClient } from "../server";
import { getCurrentUser } from "../lib/getCurrentUser";

export async function addReaction(messageId: string, emoji: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = createAdminClient();
  
  const { data, error } = await (supabase as any)
    .from("message_reactions")
    .upsert({ 
      message_id: messageId, 
      user_id: user.id,
      emoji 
    })
    .select();
    
  return { data, error };
}

export async function removeReaction(messageId: string, emoji: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = createAdminClient();
  
  const { error } = await (supabase as any)
    .from("message_reactions")
    .delete()
    .eq("message_id", messageId)
    .eq("user_id", user.id)
    .eq("emoji", emoji);
    
  return { error };
}