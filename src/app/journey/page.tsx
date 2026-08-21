"use client";

import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";
import { journey } from "@/data/journey";

export default function JourneyPage() {
  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-16 md:mb-20">
          <FadeIn>
            <SectionLabel label="Journey" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              The engineering path
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Not a resume timeline — a continuous path of experiments, builds,
              and discoveries.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-3xl">
          <div className="relative">
            <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-[1px] bg-[var(--color-border)]" />

            <div className="space-y-16 md:space-y-20">
              {journey.map((entry, i) => (
                <FadeIn key={entry.year + entry.title} delay={0.1 + i * 0.08}>
                  <div className="flex gap-6 md:gap-8">
                    <div className="relative z-10 w-10 md:w-12 flex-shrink-0">
                      <div
                        className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 mt-1 ${
                          entry.type === "ongoing"
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                            : entry.type === "milestone"
                            ? "border-[var(--color-text-primary)] bg-[var(--color-bg-primary)]"
                            : "border-[var(--color-text-muted)] bg-[var(--color-bg-primary)]"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-mono text-[var(--color-text-muted)] tracking-wider">
                          {entry.year}
                        </span>
                        <h3 className="text-xl md:text-2xl font-medium text-[var(--color-text-primary)]">
                          {entry.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-lg">
                        {entry.description}
                      </p>
                      {entry.projects.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {entry.projects.map((pid) => (
                            <Link
                              key={pid}
                              href={`/projects/${pid}`}
                              className="text-[10px] tracking-[0.08em] uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/20 px-2 py-0.5 rounded-sm hover:bg-[var(--color-accent-glow)] transition-colors duration-200"
                            >
                              {pid
                                .split("-")
                                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                .join(" ")}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
