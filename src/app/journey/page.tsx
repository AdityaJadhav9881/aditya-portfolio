import type { Metadata } from "next";
import JourneyPageClient from "./JourneyPageClient";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journey",
  description: "The engineering path of Aditya Jadhav — experiments, builds, and discoveries.",
};

async function getJourney() {
  const entries = await prisma.journeyEntry.findMany({
    where: { visible: true },
    orderBy: { displayOrder: "asc" },
    include: {
      journeyProjects: {
        include: { project: { select: { slug: true, name: true } } },
      },
    },
  });

  return entries.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    projects: e.journeyProjects.map((jp) => ({
      slug: jp.project.slug,
      name: jp.project.name,
    })),
  }));
}

export default async function JourneyPage() {
  const journey = await getJourney();
  return <JourneyPageClient journey={journey as any} />;
}
