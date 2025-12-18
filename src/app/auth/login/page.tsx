import { LoginForm } from "@/services/supabase/components/login-form";
import { FaRegCircle } from "react-icons/fa";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20">
            <FaRegCircle className="text-2xl text-[var(--typecircle-green)]" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Welcome to TypeCircle</h1>
          <p className="text-muted-foreground">Discover your personality type and connect with others</p>
        </div>
        <div className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
