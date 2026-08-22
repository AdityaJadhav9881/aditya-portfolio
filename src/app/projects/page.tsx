import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering projects by Aditya Jadhav — from IoT energy systems to custom hardware and power electronics.",
};

async function getProjects() {
  return prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
    include: { media: { where: { role: "COVER", visible: true }, take: 1 } },
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-16 md:mb-20">
          <FadeIn>
            <SectionLabel label="Projects" />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              Project Universe
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
              Each project is a distinct system — connected to skills, research,
              and the broader engineering journey.
            </p>
          </FadeIn>
        </div>

        <FadeInStagger stagger={0.06}>
          <div className="space-y-0">
            {projects.map((project: any, i: number) => {
              const coverMedia = project.media[0];
              return (
                <FadeInItem key={project.id}>
                  <Link href={`/projects/${project.slug}`}>
                    <div className="group py-8 md:py-10 border-t border-[var(--color-border)] last:border-b cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-4">
                            <span className="text-[var(--color-text-muted)] text-xs font-mono tracking-wider">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                              {project.name}
                            </h2>
                          </div>
                          <p className="mt-3 ml-10 text-sm md:text-base text-[var(--color-text-secondary)] max-w-lg">
                            {project.oneLine}
                          </p>
                        </div>

                        <div className="ml-10 md:ml-0 flex items-center gap-4">
                          <span className="text-xs text-[var(--color-text-muted)] tracking-wider font-mono">
                            {project.year}
                          </span>
                          <span className="hidden md:block text-[10px] tracking-[0.12em] uppercase text-[var(--color-text-muted)] border border-[var(--color-border)] px-3 py-1 rounded-sm">
                            {project.category?.split("/")[0].trim()}
                          </span>
                          {coverMedia && (
                            <div className="hidden md:block relative w-16 h-16 rounded overflow-hidden border border-[var(--color-border)]">
                              <Image
                                src={coverMedia.url}
                                alt={coverMedia.alt || project.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <svg
                            className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-all duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </div>
                      </div>

                      <div className="ml-10 mt-4 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 4).map((tech: string) => (
                          <span
                            key={tech}
                            className="text-[10px] tracking-[0.08em] text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </FadeInItem>
              );
            })}
          </div>
        </FadeInStagger>
      </div>
    </div>
  );
}
