"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";
import { skillGroups } from "@/data/skills";

export default function SkillsPage() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const filteredProjects = activeSkill
    ? skillGroups
        .flatMap((g) => g.skills)
        .find((s) => s.name === activeSkill)?.projects ?? []
    : [];

  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-16 md:mb-20">
          <FadeIn>
            <SectionLabel label="Skills" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              Capabilities
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Skills proven through projects. Select a skill to see the work that
              demonstrates it.
            </p>
          </FadeIn>
        </div>

        <FadeInStagger stagger={0.06}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {skillGroups.map((group) => (
              <FadeInItem key={group.id}>
                <button
                  onClick={() => {
                    setActiveGroup(activeGroup === group.id ? null : group.id);
                    setActiveSkill(null);
                  }}
                  className={`w-full text-left p-6 md:p-8 border rounded-sm transition-all duration-300 ${
                    activeGroup === group.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                  }`}
                >
                  <h3
                    className={`text-lg font-medium transition-colors duration-300 ${
                      activeGroup === group.id
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text-primary)]"
                    }`}
                  >
                    {group.name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {group.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="text-[10px] tracking-[0.1em] uppercase text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </button>
              </FadeInItem>
            ))}
          </div>
        </FadeInStagger>

        {activeGroup && (
          <FadeIn>
            <div className="mb-16">
              <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-6">
                Select a skill to see projects
              </h2>
              <div className="flex flex-wrap gap-3">
                {skillGroups
                  .find((g) => g.id === activeGroup)
                  ?.skills.map((skill) => (
                    <button
                      key={skill.name}
                      onClick={() =>
                        setActiveSkill(
                          activeSkill === skill.name ? null : skill.name
                        )
                      }
                      className={`text-sm px-4 py-2 border rounded-sm transition-all duration-300 ${
                        activeSkill === skill.name
                          ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                          : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      {skill.name}
                      <span className="ml-2 text-xs text-[var(--color-text-muted)]">
                        {skill.projects.length}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </FadeIn>
        )}

        {activeSkill && filteredProjects.length > 0 && (
          <FadeIn>
            <div>
              <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-6">
                Projects demonstrating {activeSkill}
              </h2>
              <div className="space-y-0">
                {filteredProjects.map((projectId) => (
                  <Link
                    key={projectId}
                    href={`/projects/${projectId}`}
                    className="block py-6 border-t border-[var(--color-border)] last:border-b hover:pl-4 transition-all duration-300"
                  >
                    <span className="text-lg text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200">
                      {projectId
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
