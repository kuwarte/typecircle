// src/app/auth/callback/route.ts
import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("URL env:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(
    "KEY env (first 20 chars):",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20),
  );

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.log("NO CODE PARAM RECEIVED");
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("EXCHANGE CODE ERROR:", error);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("NO USER AFTER EXCHANGE");
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, primary_type")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("PROFILE FETCH ERROR:", profileError);
  }

  const isComplete = profile?.username && profile?.primary_type;

  return NextResponse.redirect(
    `${origin}${isComplete ? "/feed" : "/onboarding"}`,
  );
}
