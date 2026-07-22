import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: any) {
  const supabase = await createClient();

  // `params` can be a Promise in some Next.js versions; await to be safe
  const resolvedParams = await Promise.resolve(context.params || {});
  const groupId = resolvedParams?.id;

  if (!groupId) {
    return NextResponse.redirect(
      new URL(`/community?error=join_failed`, request.url),
    );
  }

  // Use getUser() to validate the user with Supabase Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }

  // Upsert membership so duplicate inserts don't error
  const { error } = await supabase.from("group_memberships").upsert({
    group_id: groupId,
    user_id: user.id,
  });

  if (error) {
    console.error("GROUP JOIN ERROR:", error);
    return NextResponse.redirect(
      new URL(`/community/${groupId}?error=join_failed`, request.url),
    );
  }

  return NextResponse.redirect(new URL(`/community/${groupId}`, request.url));
}
