"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

interface Project {
  id: string;
  slug: string;
  name: string;
  oneLine: string | null;
  year: number | null;
  category: string | null;
}

interface SelectedProjectsProps {
  projects?: Project[];
}

export default function SelectedProjects({ projects = [] }: SelectedProjectsProps) {
  const featured = projects.slice(0, 5);

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <div>
            <FadeIn>
              <SectionLabel label="Projects" href="/projects" />
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-8 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)]">
                Selected work
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link
              href="/projects"
              className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
            >
              View all projects
            </Link>
          </FadeIn>
        </div>

        <div className="space-y-0">
          {featured.map((project, i) => (
            <FadeIn key={project.id} delay={0.1 + i * 0.1}>
              <Link href={`/projects/${project.slug}`}>
                <motion.div
                  className="group relative py-8 md:py-10 border-t border-[var(--color-border)] last:border-b cursor-pointer"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-4">
                        <span className="text-[var(--color-text-muted)] text-xs font-mono tracking-wider">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                          {project.name}
                        </h3>
                      </div>
                      <p className="mt-3 ml-10 text-sm md:text-base text-[var(--color-text-secondary)] max-w-lg">
                        {project.oneLine}
                      </p>
                    </div>

                    <div className="ml-10 md:ml-0 flex items-center gap-4">
                      <span className="text-xs text-[var(--color-text-muted)] tracking-wider">
                        {project.year}
                      </span>
                      <span className="hidden md:block text-[10px] tracking-[0.12em] uppercase text-[var(--color-text-muted)] border border-[var(--color-border)] px-3 py-1 rounded-sm">
                        {project.category?.split("/")[0].trim()}
                      </span>
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
                </motion.div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
