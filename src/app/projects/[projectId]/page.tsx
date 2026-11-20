import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FadeIn } from "@/components/FadeIn";

export const dynamic = "force-dynamic";

const SECTION_LABELS: Record<string, string> = {
  STORY: "Story",
  FEATURES: "Key Features",
  HARDWARE: "Hardware",
  SOFTWARE: "Software",
  TECHNICAL: "Technical",
  HOW_IT_WORKS: "How It Works",
  TESTING: "Testing",
  CHALLENGES: "Challenges",
  LESSONS: "Lessons",
  RESEARCH: "Research",
  FUTURE: "Future",
  GALLERY: "Gallery",
};

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

          {project.sections.map((section) => (
            <FadeIn key={section.id}>
              <div className="mb-16">
                <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-4">
                  {section.title || SECTION_LABELS[section.sectionType] || section.sectionType}
                </h2>
                {section.content && (
                  <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        {project.media.length > 0 && (
          <FadeIn>
            <div className="mt-20 max-w-4xl overflow-hidden">
              <h2 className="text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] font-medium mb-8">
                Gallery
              </h2>
              <div className="space-y-6">
                {project.media.map((item: any) => {
                  const proxied = `/api/images?url=${encodeURIComponent(item.url)}`;
                  const fileParam = item.originalName ? `&filename=${encodeURIComponent(item.originalName)}` : "";
                  const downloadUrl = `${proxied}&download=1${fileParam}`;
                  const isPdf = item.mimeType === "application/pdf";
                  const isVideo = item.mimeType.startsWith("video/");
                  const isApk =
                    item.mimeType === "application/vnd.android.package-archive" ||
                    item.mimeType === "application/x-android-package-archive" ||
                    (typeof item.mimeType === "string" && item.mimeType.endsWith("+android-package-archive"));
                  return (
                    <div key={item.id} className="rounded-lg border border-[var(--color-border)] overflow-hidden">
                      {item.mimeType.startsWith("image/") ? (
                        <img
                          src={proxied}
                          alt={item.alt || item.originalName}
                          width="800"
                          height="600"
                          style={{ width: "100%", height: "auto" }}
                        />
                      ) : isVideo ? (
                        <video controls preload="metadata" style={{ width: "100%", maxHeight: "600px" }}>
                          <source src={proxied} type={item.mimeType} />
                          Your browser does not support the video tag.
                        </video>
                      ) : isPdf ? (
                        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "#111119" }}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" className="shrink-0">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--color-text-primary)] truncate">{item.originalName}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">PDF document</p>
                          </div>
                          <a
                            href={downloadUrl}
                            className="px-4 py-2 rounded-lg text-xs font-medium tracking-wide uppercase shrink-0"
                            style={{ background: "#00c8e0", color: "#0a0a0f" }}
                          >
                            Download PDF
                          </a>
                        </div>
                      ) : isApk ? (
                        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "#111119" }}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3ddc84" strokeWidth="1.5" className="shrink-0">
                            <rect x="5" y="2" width="14" height="20" rx="2" />
                            <path d="M9 18h6" />
                            <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" strokeLinecap="round" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--color-text-primary)] truncate">{item.originalName}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Android package (APK)</p>
                          </div>
                          <a
                            href={downloadUrl}
                            download={item.originalName || undefined}
                            className="px-4 py-2 rounded-lg text-xs font-medium tracking-wide uppercase shrink-0"
                            style={{ background: "#3ddc84", color: "#0a0a0f" }}
                          >
                            Download APK
                          </a>
                        </div>
                      ) : (
                        <div className="p-6 flex items-center gap-4" style={{ background: "#111119" }}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--color-text-primary)] truncate">{item.originalName}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.mimeType}</p>
                          </div>
                          <a
                            href={downloadUrl}
                            download={item.originalName || undefined}
                            className="px-4 py-2 rounded-lg text-xs font-medium tracking-wide uppercase shrink-0 border border-[var(--color-border)]"
                            style={{ color: "#8888a0" }}
                          >
                            Download
                          </a>
                        </div>
                      )}
                      {(item.alt || item.caption) && (
                        <div className="p-3" style={{ background: "#111119" }}>
                          {item.alt && <p className="text-xs" style={{ color: "#8888a0" }}>{item.alt}</p>}
                          {item.caption && <p className="text-xs mt-1" style={{ color: "#55556a" }}>{item.caption}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
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
