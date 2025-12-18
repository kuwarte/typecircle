"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/services/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    const supabase = createClient();
    setGithubLoading(true);
    setGithubError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setGithubError(
        error instanceof Error ? error.message : "An error occurred"
      );
      setGithubLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setGoogleLoading(true);
    setGoogleError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setGoogleError(
        error instanceof Error ? error.message : "An error occurred"
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--typecircle-green)]/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Sign In</h2>
            <p className="text-muted-foreground">Choose your preferred sign-in method</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {githubError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
                {githubError}
              </div>
            )}
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 btn-typecircle-outline transition-all duration-200"
              onClick={handleGithubLogin}
              disabled={githubLoading}
            >
              {githubLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  <FaGithub className="text-lg" /> Continue with GitHub
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {googleError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
                {googleError}
              </div>
            )}
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 btn-typecircle transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  <FaGoogle className="text-lg" /> Continue with Google
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-6">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-[var(--typecircle-green)] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[var(--typecircle-green)] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
