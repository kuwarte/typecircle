// src/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/feed",
  "/onboarding",
  "/profile",
  "/community",
  "/quiz",
];
const AUTH_ROUTES = ["/login"];
const ONBOARDING_ROUTE = "/onboarding";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((r) => path.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => path.startsWith(r));

  // Not logged in and trying to hit a protected route → login.
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in and hitting /login → skip straight to the feed.
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // Logged in and on a protected route: enforce onboarding completeness.
  // This is what stops someone from typing /feed (or any other protected
  // path) into the URL bar, or hitting back/forward, to skip onboarding.
  if (isProtected && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, primary_type")
      .eq("id", user.id)
      .maybeSingle();

    const onboardingComplete =
      !!profile?.username && profile?.primary_type != null;

    if (!onboardingComplete && path !== ONBOARDING_ROUTE) {
      return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url));
    }

    if (onboardingComplete && path === ONBOARDING_ROUTE) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
