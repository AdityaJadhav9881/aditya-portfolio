"use client";

import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

interface ContactPageClientProps {
  email: string;
  linkedin: string;
  github: string;
}

export default function ContactPageClient({ email, linkedin, github }: ContactPageClientProps) {
  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <FadeIn>
            <SectionLabel label="Contact" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              Let&apos;s build something.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-8 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
              Always interested in discussing engineering, hardware-software systems, IoT, and anything that involves building things from scratch.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-16 space-y-8">
              {email && (
                <div>
                  <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">Email</h2>
                  <a href={`mailto:${email}`} className="text-lg text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200">{email}</a>
                </div>
              )}
              {linkedin && (
                <div>
                  <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">LinkedIn</h2>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-lg text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200">{linkedin.replace('https://', '')}</a>
                </div>
              )}
              {github && (
                <div>
                  <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">GitHub</h2>
                  <a href={github} target="_blank" rel="noopener noreferrer" className="text-lg text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200">{github.replace('https://', '')}</a>
                </div>
              )}
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mt-24 pt-16 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[var(--color-accent)]" />
                <span className="text-[var(--color-accent)] text-xs tracking-[0.15em] uppercase font-medium">Open to collaboration</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
