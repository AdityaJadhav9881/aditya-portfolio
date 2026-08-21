"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

const steps = [
  { label: "Build", icon: "01" },
  { label: "Learn", icon: "02" },
  { label: "Experiment", icon: "03" },
  { label: "Improve", icon: "04" },
  { label: "Build Again", icon: "05" },
];

export default function Philosophy() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-16">
          <div className="lg:w-1/3">
            <FadeIn>
              <SectionLabel label="Engineering Philosophy" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-8 text-3xl md:text-4xl font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)]">
                The continuous cycle.
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-6 text-[var(--color-text-secondary)] leading-relaxed">
                Every build teaches something new. Every experiment opens a new
                direction. The cycle never ends — it only deepens.
              </p>
            </FadeIn>
          </div>

          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <FadeIn key={step.label} delay={0.1 + i * 0.08}>
                  <div className="group p-6 md:p-8 border border-[var(--color-border)] rounded-sm hover:border-[var(--color-border-hover)] transition-all duration-300">
                    <span className="text-[var(--color-accent)] text-xs font-medium tracking-[0.15em]">
                      {step.icon}
                    </span>
                    <h3 className="mt-4 text-lg md:text-xl font-medium text-[var(--color-text-primary)]">
                      {step.label}
                    </h3>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.6}>
              <div className="mt-6 p-6 md:p-8 border border-[var(--color-border)] rounded-sm">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-[var(--color-accent)]" />
                  <span className="text-[var(--color-accent)] text-xs tracking-[0.15em] uppercase font-medium">
                    The cycle continues
                  </span>
                  <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
