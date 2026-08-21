import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";
import { projects, getProjectById, getRelatedProjects } from "@/data/projects";
import { getAllSkills } from "@/data/skills";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ projectId: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.name,
    description: project.oneLine,
    openGraph: {
      title: `${project.name} | Aditya Jadhav`,
      description: project.oneLine,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) notFound();

  const relatedProjects = getRelatedProjects(projectId);
  const allSkills = getAllSkills();
  const relatedSkillNames = project.relatedSkills
    .map((id) => allSkills.find((s) => s.name.toLowerCase().replace(/\s+/g, "-") === id))
    .filter(Boolean)
    .map((s) => s!.name);

  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          <FadeIn>
            <Link
              href="/projects"
              className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
            >
              Projects
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">
              {project.name}
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-4 text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl">
              {project.oneLine}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-[var(--color-text-muted)]">
              <span className="font-mono tracking-wider">{project.year}</span>
              <span className="text-[var(--color-border)]">|</span>
              <span>{project.category}</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] tracking-[0.08em] uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/20 bg-[var(--color-accent-glow)] px-3 py-1 rounded-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="mt-20 md:mt-28 max-w-4xl">
          {[
            { label: "Why I Built It", content: project.description },
            { label: "The Problem", content: project.problem },
            { label: "What I Designed", content: project.designed },
            { label: "How It Works", content: project.howItWorks },
          ].map((section) => (
            <FadeIn key={section.label}>
              <div className="mb-16">
                <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">
                  {section.label}
                </h2>
                <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                  {section.content}
                </p>
              </div>
            </FadeIn>
          ))}

          <FadeIn>
            <div className="mb-16">
              <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">
                Key Features
              </h2>
              <ul className="space-y-3">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-base text-[var(--color-text-secondary)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {[
            { label: "Engineering", content: project.engineering },
            { label: "Result", content: project.result },
            { label: "What I Learned", content: project.learned },
          ].map((section) => (
            <FadeIn key={section.label}>
              <div className="mb-16">
                <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">
                  {section.label}
                </h2>
                <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                  {section.content}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {(relatedSkillNames.length > 0 || relatedProjects.length > 0) && (
          <FadeIn>
            <div className="mt-20 pt-16 border-t border-[var(--color-border)] max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {relatedSkillNames.length > 0 && (
                  <div>
                    <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">
                      Related Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedSkillNames.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs text-[var(--color-text-secondary)] border border-[var(--color-border)] px-3 py-1 rounded-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {relatedProjects.length > 0 && (
                  <div>
                    <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">
                      Related Projects
                    </h3>
                    <div className="space-y-3">
                      {relatedProjects.map((rp) => (
                        <Link
                          key={rp.id}
                          href={`/projects/${rp.id}`}
                          className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                        >
                          {rp.name} →
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
