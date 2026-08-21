"use client";

import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

interface ContactSectionProps {
  email?: string;
  linkedin?: string;
  github?: string;
}

export default function ContactSection({ email, linkedin, github }: ContactSectionProps) {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <FadeIn>
            <SectionLabel label="Contact" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)]">
              Let&apos;s build something.
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-8 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
              Always interested in discussing engineering, hardware-software
              systems, IoT, and anything that involves building things from scratch.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-3 text-sm tracking-[0.08em] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  Email
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm tracking-[0.08em] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  LinkedIn
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm tracking-[0.08em] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  GitHub
                </a>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
