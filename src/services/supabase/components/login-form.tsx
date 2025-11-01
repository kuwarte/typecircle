"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/services/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {githubError && (
              <p className="text-sm text-destructive-500">{githubError}</p>
            )}
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGithubLogin}
              disabled={githubLoading}
            >
              {githubLoading ? (
                "Logging in..."
              ) : (
                <>
                  <FaGithub /> Continue with GitHub
                </>
              )}
            </Button>

            {googleError && (
              <p className="text-sm text-destructive-500">{googleError}</p>
            )}
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                "Logging in..."
              ) : (
                <>
                  <FaGoogle /> Continue with Google
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
