"use client";

import Link from "next/link";
import { use } from "react";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";
import { skillGroups, getSkillGroupById } from "@/data/skills";

export default function SkillGroupPage({
  params,
}: {
  params: Promise<{ skillId: string }>;
}) {
  const { skillId } = use(params);
  const group = getSkillGroupById(skillId);

  if (!group) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <span className="text-[var(--color-accent)] text-xs tracking-[0.2em] uppercase font-medium">
          Not found
        </span>
        <h1 className="mt-6 text-3xl md:text-4xl font-semibold text-[var(--color-text-primary)]">
          Skill group not found
        </h1>
        <Link
          href="/skills"
          className="mt-8 text-xs tracking-[0.12em] uppercase text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
        >
          All skills
        </Link>
      </div>
    );
  }

  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <FadeIn>
            <Link
              href="/skills"
              className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
            >
              Skills
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              {group.name}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              {group.description}
            </p>
          </FadeIn>
        </div>

        <div className="mt-16 max-w-4xl space-y-0">
          {group.skills.map((skill, i) => (
            <FadeIn key={skill.name} delay={0.1 + i * 0.08}>
              <div className="py-8 border-t border-[var(--color-border)] last:border-b">
                <h3 className="text-xl font-medium text-[var(--color-text-primary)]">
                  {skill.name}
                </h3>
                {skill.projects.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skill.projects.map((pid) => (
                      <Link
                        key={pid}
                        href={`/projects/${pid}`}
                        className="text-xs text-[var(--color-accent)] border border-[var(--color-accent)]/20 px-3 py-1 rounded-sm hover:bg-[var(--color-accent-glow)] transition-colors duration-200"
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
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
