"use client";

import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

interface ResearchProject {
  slug: string;
  name: string;
}

interface ResearchEntryData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  projects: ResearchProject[];
}

interface ResearchPageClientProps {
  research: ResearchEntryData[];
}

export default function ResearchPageClient({ research }: ResearchPageClientProps) {
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
              Research grounded in real engineering projects.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-4xl space-y-0">
          {research.map((entry, i) => (
            <FadeIn key={entry.id} delay={0.1 + i * 0.1}>
              <div id={entry.slug} className="py-10 md:py-14 border-t border-[var(--color-border)] last:border-b scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-medium text-[var(--color-text-primary)]">{entry.title}</h2>
                <p className="mt-4 text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">{entry.description}</p>
                <div className="mt-6 flex items-center gap-4">
                  {entry.projects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="text-xs tracking-[0.08em] uppercase text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
