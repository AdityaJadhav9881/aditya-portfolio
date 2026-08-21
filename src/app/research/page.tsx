import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ResearchPageClient from "./ResearchPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research",
  description: "Published research by Aditya Jadhav.",
};

async function getResearch() {
  const entries = await prisma.researchEntry.findMany({
    where: { visible: true },
    orderBy: { displayOrder: "asc" },
    include: {
      researchProjects: {
        include: { project: { select: { slug: true, name: true } } },
      },
    },
  });

  return entries.map((e: any) => ({
    ...e,
    links: e.links as { label: string; url: string }[] | null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    projects: e.researchProjects.map((rp: any) => ({
      slug: rp.project.slug,
      name: rp.project.name,
    })),
  }));
}

export default async function ResearchPage() {
  const research = await getResearch();
  return <ResearchPageClient research={research as any} />;
}
