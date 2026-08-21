"use client";

import { FadeIn, FadeInStagger, FadeInItem } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

interface AchievementData {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  category: string | null;
}

interface AchievementsPageClientProps {
  achievements: AchievementData[];
}

export default function AchievementsPageClient({ achievements }: AchievementsPageClientProps) {
  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-16 md:mb-20">
          <FadeIn>
            <SectionLabel label="Achievements" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              Milestones
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Not a trophy wall — milestones within the engineering journey.
            </p>
          </FadeIn>
        </div>

        <FadeInStagger stagger={0.08}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {achievements.map((a) => (
              <FadeInItem key={a.id}>
                <div className="p-6 md:p-8 border border-[var(--color-border)] rounded-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium">{a.category}</span>
                    <span className="text-[var(--color-border)]">|</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono">{a.year}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-medium text-[var(--color-text-primary)]">{a.title}</h3>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">{a.description}</p>
                </div>
              </FadeInItem>
            ))}
          </div>
        </FadeInStagger>
      </div>
    </div>
  );
}
