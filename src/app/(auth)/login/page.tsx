"use client";

import { signInWithProvider } from "@/services/supabase/auth";
import { FaGithub, FaGoogle } from "react-icons/fa";

const LOGIN_ASCII = `
                     \`^oáÓÓèF%                                   
                    :åÓÓÓÓÓÓ¥èÓ¿                                 
                    xÓ†††7†††òÓñ                                 
                    Iè7îòi7±SÎòñ                                 
                    ‹á7Ïz††7ë77±’                                
                    ¡>†††i7>†††7­                                
                    ·!777†¿{{77´                     ´”´         
                      ‚771òc<†}                     ‹†–          
                       ‘j>††ìƒ7*\`                 \`(7°           
                      ½y77i>i†=µOÝhhù~           ˜7%ƒi“\`         
                  ·*½ÇOOxí7††7¾OOPáááááS¨       ´¿7lrj7˜         
               ÷Çñááááµ9ZZeI<hñáñZááááááá…      ­7†ìï¯\`          
              hááááááááááááááááááááááááááñ¯    îññk&˜            
             /ñáááááááááááááááááááááááááááñ¾\` \`ûáááñ·            
            ´ñááááááááááááááááááááááááñFááááñ?/ñáááŸ             
            ˆááááááFááááááááááááááááááá¥ááááááááááái             
            ›ñááááá¥áááááááááááááááááááFDáááááááááá’             
            (ááááááÒáááááááááááááááááááÎ\`àááááááááá\`             
            üáááááñåáááááááááááááááááááO  ·úáááááš…              
           ¸ñáááááñÖñáááááááááááááááááá9     +hàí                
           ›ñáááááñbbbÒ¥Fe™wYVÍaññáááááÇ                         
           :ñáááááááááááñ1†††††††7ïnûäáñ´                        
            íáááááááááááñ1††††††7OhžÎúOñ˜                        
             ¨¾Ÿkhšññññññdñšòì7¼ñááááááñ¹                        
                   cáááááñááááááááááááááì                        
                   tááááááááááááááááááááç                        
                   Iáááááááááááááááááááá9                        
`;

export default function LoginPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] text-[var(--color-paper)] p-8 flex flex-col md:flex-row md:items-stretch md:justify-between gap-8 min-h-[520px]">
        {/* ASCII decoration — bottom left of dark container */}
        <pre
          aria-hidden="true"
          className="hidden md:block absolute left-0 bottom-0 font-mono text-[var(--color-accent)] opacity-40 pointer-events-none select-none leading-[0.95] text-[11px]"
        >
          {LOGIN_ASCII}
        </pre>

        {/* Left: branding */}
        <div className="relative max-w-sm">
          <h1 className="font-heading font-semibold text-4xl md:text-5xl leading-[1.1] tracking-tight">
            Know your type.
            <br />
            Find your circle.
          </h1>
          <p className="mt-5 text-[var(--color-paper)]/60 text-base max-w-xs">
            Sign in to access your profile, circles, and type results.
          </p>
        </div>

        {/* Right: auth card */}
        <div className="relative w-full md:w-auto md:min-w-[320px] bg-[var(--color-paper)] rounded-2xl px-7 py-6 flex flex-col justify-between self-stretch overflow-hidden">
          {/* Dot pattern fading down */}
          <div
            aria-hidden="true"
            className="h-24 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, var(--color-ink) 1px, transparent 1px)`,
              backgroundSize: "18px 18px",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)",
            }}
          />

          <div className="flex flex-col gap-3">
            <button
              onClick={() => signInWithProvider("github")}
              className="flex items-center justify-center gap-3 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] py-3 px-5 text-sm font-medium hover:bg-[var(--color-ink)]/85 transition-colors"
            >
              <FaGithub size={16} />
              Continue with GitHub
            </button>

            <button
              onClick={() => signInWithProvider("google")}
              className="flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white py-3 px-5 text-sm font-medium text-[var(--color-ink)] hover:bg-black/[0.02] transition-colors"
            >
              <FaGoogle size={16} />
              Continue with Google
            </button>

            <p className="mt-1 text-center text-xs text-[var(--color-ink)]/35 leading-relaxed">
              By continuing, you agree to typecircle's{" "}
              <a
                href="/terms"
                className="underline hover:text-[var(--color-ink)]/60 transition-colors"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline hover:text-[var(--color-ink)]/60 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
