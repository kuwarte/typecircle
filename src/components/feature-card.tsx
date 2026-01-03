"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <Link href={href} className="group block" onClick={handleClick}>
      <div className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 h-full transition-all duration-200 group-hover:bg-white/5 flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center w-20 h-20 mb-5 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)] text-[var(--typecircle-green)] overflow-hidden">
          {!clicked ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0 text-4xl">
                {icon}
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <FaArrowRight className="text-[2rem] text-[var(--typecircle-green)]" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl transition-transform duration-500 translate-x-16">
              <FaArrowRight className="text-[2rem] text-[var(--typecircle-green)]" />
            </div>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
          {title}
        </h3>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[18rem]">
          {description}
        </p>
      </div>
    </Link>
  );
}

export default FeatureCard;
