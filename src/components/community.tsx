// src/components/community.tsx
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MEMBERS = [
  { initials: "MJ" },
  { initials: "AR" },
  { initials: "SK" },
  { initials: "TP" },
  { initials: "LN" },
];

const COMMUNITY_ASCII = `
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                             ..:--=+**##%%*                                         
                      .:-=+*#%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@-                                        
        :%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#                                        
        #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                        
        *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                        
        =@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.                                       
        .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=                                       
         %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#                                       
         *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                       
         -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.                                      
         .%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:                                      
          %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=                                      
          *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#                                      
          -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%                                      
          .%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@:                                     
           #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-                                     
           +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+                                     
           -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#                                     
            %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                     
            #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-                                    
            +@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+                                    
            -@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#+                                    
            .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%#+-.                                   
             #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%@@@@#*+=--=++=-=::-::.                            
             +@@@@@@@@@@@@@@@@@@@@@@@@@%%@@@@@@#+----=+#*###%#*=-:---=-::::-::                      
             -@@@@@@@@@@@@@@@@@@%%@@@@%%*=----=+######%###%##*+=-:--=--=---=--=----.                
             .@@@@@@@@@@%%%@@@@%*+=-:-==***###%#####%%#*#*##*+=====---------:.............          
              %@%%%%@@@@%*----:-+%**#+#%####%%%%**##%%%*+**#**+=-==--=:..........................   
              +%#+-:-:--=**#*#*###%##%##%***#%#%#**######*#**++=-............................:-:    
               .+-=*#%####%**#%*%#*#*#%#%#*####%%###%%%%*+-:............  .............:=+=.        
                -++-.:=%%*##*#%%%%*#*+%%+%%+#%%#+#*+-:::::............  ..........:=+=.             
                    :+*=::=#+##%%%%#####*##++=:::::::::::...................:-==:.                  
                        .=++-:-+#%#%#*+=-:-::::::::::::::::............:==:                         
                             -+*=.:::::-:::::::::::::::::::.......:++-                              
                                 :+*=::::::::::::::::::::...:-++-                                   
                                     .=*+-:::::::::::..-++=.                                        
                                          -+*=:...-*+-                                              
                                              .:.                                                   
`;

export function Community() {
  return (
    <section className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 overflow-hidden">
      <pre
        aria-hidden="true"
        className="hidden md:block absolute right-0 top-50 -translate-y-1/2 font-mono text-[var(--color-accent)] opacity-40 pointer-events-none select-none leading-[0.95] text-[9px]"
      >
        {COMMUNITY_ASCII}
      </pre>

      <div className="relative max-w-2xl">
        <h2 className="font-heading font-semibold text-3xl md:text-5xl tracking-tight leading-[1.1] text-[var(--color-ink)]">
          Find people who get it — or push back on it.
        </h2>
        <p className="mt-5 text-[var(--color-ink)]/60 text-base md:text-lg max-w-xl">
          Every circle is matched by type. Some are built for people who share
          yours, so you can go deeper together. Others pair contrasting types,
          so you can see yourself from the outside.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Link
            href="/community"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium px-6 whitespace-nowrap",
            )}
          >
            Browse circles
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {MEMBERS.map((m, idx) => (
                <Avatar
                  key={m.initials}
                  className="w-10 h-10 border-[2px] border-[var(--color-paper)] shadow-sm ring-1 ring-[var(--color-ink)]/5"
                  style={{ zIndex: MEMBERS.length - idx }}
                >
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="bg-zinc-400 text-[var(--color-paper)] text-xs font-semibold">
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm text-[var(--color-ink)]/50">
              <span className="text-[var(--color-ink)] font-semibold">
                2.4k+
              </span>{" "}
              joined this month
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
