"use client";

import { createClient } from "@/services/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button 
      onClick={logout} 
      className={`glass-button hover:!bg-red-600 hover:!text-white hover:!border-red-600 transition-colors ${className}`}
    >
      Logout
    </Button>
  );
}
