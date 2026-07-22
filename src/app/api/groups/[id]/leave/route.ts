import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: any) {
  const supabase = await createClient();

  const resolvedParams = await Promise.resolve(context.params || {});
  const groupId = resolvedParams?.id;

  if (!groupId) {
    return NextResponse.redirect(
      new URL(`/community?error=leave_failed`, request.url),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(`/login`, request.url));
  }

  const { error } = await supabase
    .from("group_memberships")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  if (error) {
    console.error("GROUP LEAVE ERROR:", error);
    return NextResponse.redirect(
      new URL(`/community/${groupId}?error=leave_failed`, request.url),
    );
  }

  return NextResponse.redirect(new URL(`/community/${groupId}`, request.url));
}
