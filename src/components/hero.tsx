// src/components/hero.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_ASCII = `
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                      .~)@@@]                                       
                                                   (@@@@@@@@@@%*                                    
                                                  -@@+   .. @@@^                                    
                                                    )    -+.}@@                                     
                                    -*<]            [:.   * ==~>                                    
                    ~))~         #@@@@@@@@@+       :+  -  .  .=~               %@@@]                
                 -%@@@@@@@#-   :)@@@@@@@@@@@)       .^ +^+[ .-              -){#[[@@@%@@-           
                -@@@@@@@@}@@#  *@@@@@#>@@@@@[         ^.*= + *            :@@@@><@@@@@@@[.          
                %@@@@@@%{@@#(~ -@>#@.    *]<          +]-:   + +]         *@% -[@@@@@@@@@@[:        
              .@@@@@@@~>< + )   * +  -::-=.:       =>  :^==< -.    >+       >) #@%@@@@@@@@@)        
           ~[@@@@@@@@@<   . >   .)=   #(==^      >.    :             .<   .+ : -{^=.@@@@@@(         
          {@@@@@@@@@@@%: +{=@@@@<   ~: ^~<      <                    ~ (   .[]   .+@@@@@@@^         
          #%%@{@@@@@@@@).-*@}@@@@^   +@@@{      =.           #>~   .-   (  :~     {@%@@)(*          
           :~@#@@@@@@@%@}@@)@#@@@@@@@@@@@%[    =: :           .+   : >=  *   .:^:^-=   *=           
            .----=**~}#^>>{@<@<{#@@@@@@@@%@*   +   -=             -  ^-(}^-+>^(: )       *          
           +-------::--(@@%]{=*~+<@@@@@@}%{% -.   .=--=^:..~(    .-:.* ~~~(=<^]->:         *        
          *-------:-----+[@{:<   ]]@@@%{}(}@>*  :    *+~:>^^]   =     :^. *  ::=   :-       *       
         ^-------:-------:  .: ~)]@<**   =  [~       *.=^)  (]<<>[-.  :=             =       ^      
       .>------------------~-=:+ ~<<<)=  + ^=         ~=*++*= *  +.*--~     -                ~-     
      .<----------~----------+->  [   >  =             )>^^^^^*  ] >  ~>   :                  *     
      >------------=--------~-==*~-:  ^              .~=-::   +::( ->^><   :                  :*    
     ^--------------~=------+-=:                        .               ^           ~          *    
     ^----------::::---+-----)%})^+-.                           :~+>)}#}=<      .+.            .=   
    :>-----::-------=)[)))(((][[[]^)))))<>>>>}}{}:-}>><))))(]()))))))]> *  -^*.  ^              }   
   ^@=^--------->]}<[[)<>>)))))))))]^)))))))<@@@@-~@[()())))]]))))))<>][[[]](<>+~.^.         +]>~   
   ~@.*]((]]()([<+>)))))))))))))))))<>]}{{{})@@@@-=@%^*+=~-:~])))))=%@@@@@@@@@@@@@@@%-  *{@@@@}#<   
   .@:=^))))))*))))))))))))))))(()))(+~*(<@ +@@@@-=@@^-     .())))+%@@@@@@@@@@@@@@@@@@@@@@@@@@]@=   
    @*+*})))>>)))))))))))))][]()())))(    %=+@@@@-=[@-       ))))+%@@#[}]@@@@@@@@@@@@@@@@@@@@@*@.   
    %+   {)))))))))))({[=   .]])))))))<   [(=@@@@-=@@>       )))^@@@{#@@@@%<#@@@@@@@@@@@@@@@@]-@    
    ]].    .+>>^+:      .={})))())))))]   *%~@@@@-=@@@^      ))^@@@@[@@@@@@+  :~]%@@@@@@@@@%=:<%    
     <#<+.        ~^)#~  =}#)))]())))))[   @>@@@@-=@@@+      )^@@@@@[@@@@@@@:*>.      ::.       [   
     })     }^ {]   +@   *<@)))(:>)))))(^  ](>@@@~=@@@-      *%@@@@@[@@@@@@@* %) .=)[}[]][{[>-*%    
     @=    -@  @)   ~@   +^@())^-@^())))(- +#   =-=~^->      {@@@@@@]@@@@@@@] @+     ^%       -@    
    ^@     ((  @^   -@   +>@()>+-@ =]))))[.:=>+:--=   =-      =[@@@)>@@@@@@@# @-     +@        @*   
    }]     {~  @=   :@.  > @})) :@  .}))))}     --=   (.     **   + >@@@@@@@@.@.     -@.       (#   
    %*         @-   :@.<.  ]@)^       <(((<~<:-+):~.         -+  (+ <@%#}}(>]^@      .@:       =@   
   :@:        .@:   .@.<   ~@{~         ]     ->=  +<>@@%##%@{  .-       *. ~}}       @-       .@.  
   (#         .@.   .@: >:  @-      :~*<((:    .). :*][<+:   :^*   =+~+}@@@@@@>       @=        @*  
   @>         :@.    {:  :< @*                                    .<}%@@@@@@@@:       %+        (}  
   @-         ~@           *}[                                             .=@        #*        :@. 
  .%          *@            -]                                              .<        }^            
              ~(                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
`;

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-[var(--color-ink)] text-[var(--color-paper)] px-8 py-14 md:px-14 md:py-20">
        <pre
          aria-hidden="true"
          className="hidden md:block absolute right-5 bottom-5 font-mono text-[var(--color-accent)] opacity-40 pointer-events-none select-none leading-[0.95] text-[9px]"
        >
          {HERO_ASCII}
        </pre>

        <div className="relative max-w-xl">
          <h1 className="font-heading font-semibold text-4xl md:text-5xl leading-[1.1] tracking-tight">
            Know your type.
            <br />
            Find your circle.
          </h1>

          <p className="mt-5 text-[var(--color-paper)]/70 text-base md:text-lg max-w-md">
            Take the Enneagram assessment, understand what drives you, and
            connect with people who share your patterns — or challenge them.
          </p>

          <div className="mt-8 flex items-center gap-6">
            <Link
              href="/quiz"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-[var(--color-accent)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]/90 font-medium px-6",
              )}
            >
              Start the test
            </Link>

            <div className="flex items-center gap-5 text-sm text-[var(--color-paper)]/60">
              <div>
                <span className="text-[var(--color-paper)] font-heading font-semibold">
                  12,400+
                </span>{" "}
                types found
              </div>
              <div className="w-px h-8 bg-[var(--color-paper)]/20" />
              <div>
                <span className="text-[var(--color-paper)] font-heading font-semibold">
                  4.8
                </span>{" "}
                avg. insight rating
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Self-discovery", "Type dynamics", "Growth paths"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border-2 border-[var(--color-ink)]/30 text-[var(--color-ink)]/70 px-4 py-1.5 text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
