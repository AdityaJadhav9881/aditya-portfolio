import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "About Aditya Ramesh Jadhav — engineer, builder, explorer.",
};

async function getSettings() {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(settings.map((s: any) => [s.key, String(s.value)]));
}

export default async function AboutPage() {
  const s = await getSettings();

  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <FadeIn><SectionLabel label="About" /></FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              {s.name || "Aditya Ramesh Jadhav"}
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-6 text-sm tracking-[0.12em] uppercase text-[var(--color-accent)]">{s.headline || "Engineer \u00b7 Builder \u00b7 Explorer"}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-16 space-y-8 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              <p>{s.bio || "I build things to understand how they work."}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-16 pt-16 border-t border-[var(--color-border)]">
              <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-text-primary)]">What I focus on</h2>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-accent)] tracking-[0.08em]">Hardware-Software Integration</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">Building systems that bridge physical sensors and actuators with digital interfaces.</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-accent)] tracking-[0.08em]">Embedded Systems & IoT</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">Designing firmware and connected devices that sense, process, and communicate.</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-accent)] tracking-[0.08em]">Power Electronics</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">From battery management to power supply design.</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-accent)] tracking-[0.08em]">Full-Stack Development</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">Building dashboards and web interfaces that make hardware data accessible.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
