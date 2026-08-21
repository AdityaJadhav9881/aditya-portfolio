"use client";

import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

interface ResearchProject {
  project: { slug: string; name: string };
}

interface ResearchEntry {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  researchProjects: ResearchProject[];
}

interface ResearchPreviewProps {
  research?: ResearchEntry[];
}

export default function ResearchPreview({ research = [] }: ResearchPreviewProps) {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <div>
            <FadeIn>
              <SectionLabel label="Research" href="/research" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)]">
                Published work
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link
              href="/research"
              className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
            >
              All research
            </Link>
          </FadeIn>
        </div>

        <div className="space-y-0">
          {research.map((entry, i) => (
            <FadeIn key={entry.id} delay={0.1 + i * 0.1}>
              <Link href={`/research#${entry.slug}`}>
                <div className="group py-8 md:py-10 border-t border-[var(--color-border)] last:border-b cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                        {entry.title}
                      </h3>
                      <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
