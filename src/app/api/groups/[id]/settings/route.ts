import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: any) {
  const supabase = await createClient();
  const params = await Promise.resolve(context.params || {});
  const groupId = params.id;

  if (!groupId)
    return NextResponse.json({ error: "missing params" }, { status: 400 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { data: adminRow } = await supabase
    .from("group_memberships")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow || adminRow.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, topic } = body;

  const { error } = await supabase
    .from("groups")
    .update({ name, topic })
    .eq("id", groupId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
