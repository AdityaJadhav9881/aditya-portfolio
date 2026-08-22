import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FadeIn } from "@/components/FadeIn";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = await prisma.project.findUnique({ where: { slug: projectId } });
  if (!project) return { title: "Project Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.vercel.app";
  const ogImage = project.ogImage || `${siteUrl}/api/og?title=${encodeURIComponent(project.name)}`;

  return {
    title: project.seoTitle || `${project.name} | Aditya Jadhav`,
    description: project.seoDescription || project.oneLine || "",
    alternates: { canonical: `${siteUrl}/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | Aditya Jadhav`,
      description: project.seoDescription || project.oneLine || "",
      url: `${siteUrl}/projects/${project.slug}`,
      siteName: "Aditya Jadhav Portfolio",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Aditya Jadhav`,
      description: project.seoDescription || project.oneLine || "",
      images: [ogImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { slug: projectId },
    include: {
      sections: { where: { visible: true }, orderBy: { displayOrder: "asc" } },
      projectSkills: { include: { skill: true } },
      media: { where: { visible: true }, orderBy: { displayOrder: "asc" } },
      relatedProjects: {
        include: { relatedProject: { select: { slug: true, name: true } } },
      },
    },
  });

  if (!project || project.status !== "PUBLISHED") notFound();

  const relatedSkillNames = project.projectSkills.map((ps: any) => ps.skill.name);
  const relatedProjects = project.relatedProjects.map((rp: any) => rp.relatedProject);

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
              {project.technologies.map((tech: string) => (
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
          ].map((section) =>
            section.content ? (
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
            ) : null
          )}

          <FadeIn>
            <div className="mb-16">
              <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">
                Key Features
              </h2>
              <ul className="space-y-3">
                {project.sections
                  .filter((s: any) => s.sectionType === "FEATURES")
                  .map((feature: any) => (
                    <li
                      key={feature.id}
                      className="flex items-start gap-3 text-base text-[var(--color-text-secondary)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 flex-shrink-0" />
                      {feature.title || feature.content}
                    </li>
                  ))}
              </ul>
            </div>
          </FadeIn>

          {[
            { label: "Engineering", content: project.engineering },
            { label: "Result", content: project.result },
            { label: "What I Learned", content: project.learned },
          ].map((section) =>
            section.content ? (
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
            ) : null
          )}
        </div>

        {project.media.length > 0 && (
          <FadeIn>
            <div className="mt-20 max-w-4xl">
              <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-8">
                Gallery
              </h2>
              <div className="space-y-6">
                {project.media.map((item: any) => (
                  <div key={item.id} className="rounded-lg overflow-hidden border border-[var(--color-border)]">
                    <div className="relative w-full" style={{ minHeight: "200px" }}>
                      <Image
                        src={item.url}
                        alt={item.alt || item.originalName}
                        width={1200}
                        height={800}
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="w-full h-auto"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    {(item.alt || item.caption) && (
                      <div className="p-3" style={{ background: "#111119" }}>
                        {item.alt && <p className="text-xs" style={{ color: "#8888a0" }}>{item.alt}</p>}
                        {item.caption && <p className="text-xs mt-1" style={{ color: "#55556a" }}>{item.caption}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

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
                      {relatedSkillNames.map((skill: string) => (
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
                      {relatedProjects.map((rp: any) => (
                        <Link
                          key={rp.slug}
                          href={`/projects/${rp.slug}`}
                          className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200"
                        >
                          {rp.name}
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
