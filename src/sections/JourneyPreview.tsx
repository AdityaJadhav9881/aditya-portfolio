"use client";

import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";
import { journey } from "@/data/journey";

export default function JourneyPreview() {
  const display = journey.slice(-4);

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <div>
            <FadeIn>
              <SectionLabel label="Journey" href="/journey" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)]">
                The path so far
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link
              href="/journey"
              className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
            >
              Full journey
            </Link>
          </FadeIn>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-[1px] bg-[var(--color-border)]" />

          <div className="space-y-12 md:space-y-16">
            {display.map((entry, i) => (
              <FadeIn key={entry.year + entry.title} delay={0.1 + i * 0.1}>
                <div className="flex gap-6 md:gap-8">
                  <div className="relative z-10 w-10 md:w-12 flex-shrink-0">
                    <div
                      className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 mt-1.5 ${
                        entry.type === "ongoing"
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                          : "border-[var(--color-text-muted)] bg-[var(--color-bg-primary)]"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-mono text-[var(--color-text-muted)] tracking-wider">
                        {entry.year}
                      </span>
                      <h3 className="text-lg md:text-xl font-medium text-[var(--color-text-primary)]">
                        {entry.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
