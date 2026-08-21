import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import SkillsPageClient from "./SkillsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skills",
  description: "Engineering capabilities of Aditya Jadhav — electronics, software, systems, and design.",
};

async function getSkillData() {
  const skillGroups = await prisma.skillGroup.findMany({
    orderBy: { displayOrder: "asc" },
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

  return skillGroups.map((g: any) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    skills: g.skills.map((s: any) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      projects: s.projectSkills
        .filter((ps: any) => ps.project.status === "PUBLISHED")
        .map((ps: any) => ({ slug: ps.project.slug, name: ps.project.name })),
    })),
  }));
}

export default async function SkillsPage() {
  const skillGroups = await getSkillData();
  return <SkillsPageClient skillGroups={skillGroups as any} />;
}
