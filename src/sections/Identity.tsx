"use client";

import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

interface IdentityProps {
  bio?: string;
}

export default function Identity({ bio }: IdentityProps) {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <FadeIn>
            <SectionLabel label="Identity" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)]">
              I build things to understand how they work.
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              {bio || "From electronics experiments to complete hardware-software systems, my work is driven by curiosity. I don't want to simply use technology — I want to understand it, experiment with it, build it, and improve it."}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mt-6 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Every project starts as a question and becomes a system.
              The portfolio itself is a system — connected, evolving, and always expanding.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
