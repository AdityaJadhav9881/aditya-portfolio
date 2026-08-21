"use client";

import Link from "next/link";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

interface Skill {
  name: string;
}

interface SkillGroupData {
  id: string;
  name: string;
  description: string | null;
  skills: Skill[];
}

interface SkillsPreviewProps {
  skillGroups?: SkillGroupData[];
}

export default function SkillsPreview({ skillGroups = [] }: SkillsPreviewProps) {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <div>
            <FadeIn>
              <SectionLabel label="Capabilities" href="/skills" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)]">
                What I work with
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link
              href="/skills"
              className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
            >
              All skills
            </Link>
          </FadeIn>
        </div>

        <FadeInStagger stagger={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group) => (
            <FadeInItem key={group.id}>
              <Link href={`/skills#${group.id}`}>
                <div className="group p-6 md:p-8 border border-[var(--color-border)] rounded-sm hover:border-[var(--color-border-hover)] transition-all duration-300 h-full">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {group.name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {group.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill.name}
                        className="text-[10px] tracking-[0.1em] uppercase text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {group.skills.length > 3 && (
                      <span className="text-[10px] tracking-[0.1em] uppercase text-[var(--color-accent)] px-2 py-0.5">
                        +{group.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
