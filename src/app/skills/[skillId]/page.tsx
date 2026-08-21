import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FadeIn } from "@/components/FadeIn";
import SectionLabel from "@/components/SectionLabel";

export const dynamic = "force-dynamic";

interface SkillGroupPageProps {
  params: Promise<{ skillId: string }>;
}

export default async function SkillGroupPage({ params }: SkillGroupPageProps) {
  const { skillId } = await params;
  const group = await prisma.skillGroup.findUnique({
    where: { slug: skillId },
    include: {
      skills: {
        orderBy: { displayOrder: "asc" },
        include: {
          projectSkills: {
            include: { project: { select: { slug: true, name: true, status: true } } },
          },
        },
      },
    },
  });

  if (!group) notFound();

  return (
    <div className="py-24 md:py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <FadeIn>
            <Link href="/skills" className="text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-200">
              Skills
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] text-[var(--color-text-primary)]">{group.name}</h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">{group.description}</p>
          </FadeIn>
        </div>

        <div className="mt-16 max-w-4xl space-y-0">
          {group.skills.map((skill: any, i: number) => (
            <FadeIn key={skill.id} delay={0.1 + i * 0.08}>
              <div className="py-8 border-t border-[var(--color-border)] last:border-b">
                <h3 className="text-xl font-medium text-[var(--color-text-primary)]">{skill.name}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skill.projectSkills
                    .filter((ps: any) => ps.project.status === "PUBLISHED")
                    .map((ps: any) => (
                      <Link
                        key={ps.project.slug}
                        href={`/projects/${ps.project.slug}`}
                        className="text-xs text-[var(--color-accent)] border border-[var(--color-accent)]/20 px-3 py-1 rounded-sm hover:bg-[var(--color-accent-glow)] transition-colors duration-200"
                      >
                        {ps.project.name}
                      </Link>
                    ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
