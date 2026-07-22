import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: any) {
  const supabase = await createClient();
  const params = await Promise.resolve(context.params || {});
  const groupId = params.id;
  const targetUserId = params.userId;

  if (!groupId || !targetUserId)
    return NextResponse.json({ error: "missing params" }, { status: 400 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  // check admin
  const { data: adminRow } = await supabase
    .from("group_memberships")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow || adminRow.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Prevent demoting the last admin
  const { data: admins } = await supabase
    .from("group_memberships")
    .select("user_id")
    .eq("group_id", groupId)
    .eq("role", "admin");

  if (admins && admins.length <= 1 && admins[0].user_id === targetUserId) {
    return NextResponse.json(
      { error: "cannot demote the last admin" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("group_memberships")
    .update({ role: "member" })
    .eq("group_id", groupId)
    .eq("user_id", targetUserId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
