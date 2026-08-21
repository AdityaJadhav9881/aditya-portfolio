import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Aditya Ramesh Jadhav — engineer, builder, explorer. Building ideas without boundaries.",
};

export default function AboutPage() {
  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <FadeIn>
            <SectionLabel label="About" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              Aditya Ramesh Jadhav
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-6 text-sm tracking-[0.12em] uppercase text-[var(--color-accent)]">
              Engineer &middot; Builder &middot; Explorer
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-16 space-y-8 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                I build things to understand how they work. From electronics
                experiments to complete hardware-software systems, my work is
                driven by curiosity.
              </p>
              <p>
                I don&apos;t want to simply use technology — I want to understand
                it, experiment with it, build it, and improve it.
              </p>
              <p>
                Every project starts as a question and becomes a system. Every
                system teaches something new that feeds into the next build.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-16 pt-16 border-t border-[var(--color-border)]">
              <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-text-primary)]">
                What I focus on
              </h2>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-accent)] tracking-[0.08em]">
                    Hardware-Software Integration
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Building systems that bridge physical sensors and actuators
                    with digital interfaces and real-time data.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-accent)] tracking-[0.08em]">
                    Embedded Systems & IoT
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Designing firmware and connected devices that sense, process,
                    and communicate with the physical world.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-accent)] tracking-[0.08em]">
                    Power Electronics
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    From battery management to power supply design — understanding
                    energy at the circuit level.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-accent)] tracking-[0.08em]">
                    Full-Stack Development
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Building dashboards, web interfaces, and backend systems that
                    make hardware data accessible and actionable.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
