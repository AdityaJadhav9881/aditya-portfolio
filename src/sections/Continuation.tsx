"use client";

import { FadeIn } from "@/components/FadeIn";

export default function Continuation() {
  return (
    <section className="py-24 md:py-32 px-6 border-t border-[var(--color-border)]">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {["Projects", "Skills", "Journey", "Research"].map((item) => (
                <span key={item} className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)]">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[var(--color-accent)]" />
              <span className="text-[var(--color-accent)] text-xs tracking-[0.15em] uppercase font-medium">
                Continuing
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
