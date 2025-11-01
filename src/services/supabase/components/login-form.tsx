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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: "github" | "google") => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
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
            {error && <p className="text-sm text-destructive-500">{error}</p>}

            {/* GitHub Button */}
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin("github")}
              disabled={isLoading}
            >
              {isLoading ? (
                "Logging in..."
              ) : (
                <>
                  <FaGithub /> Continue with GitHub
                </>
              )}
            </Button>

            {/* Google Button */}
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
            >
              {isLoading ? (
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
