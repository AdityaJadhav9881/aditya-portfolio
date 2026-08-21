"use client";

import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

export default function Future() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <FadeIn>
            <SectionLabel label="Beyond" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)]">
              The next build is already forming.
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              More systems. More experiments. More connections between hardware
              and software. The portfolio is not finished — it evolves with every
              project.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12 flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[var(--color-accent)]" />
              <span className="text-[var(--color-accent)] text-xs tracking-[0.15em] uppercase font-medium">
                Continuously evolving
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
