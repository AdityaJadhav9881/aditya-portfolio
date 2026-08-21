"use client";

import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";
import { research } from "@/data/research";

export default function ResearchPage() {
  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-16 md:mb-20">
          <FadeIn>
            <SectionLabel label="Research" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              Published research
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Research grounded in real engineering projects — documenting design
              decisions, implementation, and outcomes.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-4xl space-y-0">
          {research.map((entry, i) => (
            <FadeIn key={entry.id} delay={0.1 + i * 0.1}>
              <div
                id={entry.id}
                className="py-10 md:py-14 border-t border-[var(--color-border)] last:border-b scroll-mt-24"
              >
                <h2 className="text-2xl md:text-3xl font-medium text-[var(--color-text-primary)]">
                  {entry.title}
                </h2>
                <p className="mt-4 text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
                  {entry.description}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href={`/projects/${entry.project}`}
                    className="text-xs tracking-[0.08em] uppercase text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                  >
                    Related project:{" "}
                    {entry.project
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </Link>
                </div>
                {entry.links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {entry.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
