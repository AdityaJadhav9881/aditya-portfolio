import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import AchievementsPageClient from "./AchievementsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Milestones in the engineering journey of Aditya Jadhav.",
};

async function getAchievements() {
  const entries = await prisma.achievement.findMany({
    where: { visible: true },
    orderBy: { displayOrder: "asc" },
  });

  return entries.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));
}

export default async function AchievementsPage() {
  const achievements = await getAchievements();
  return <AchievementsPageClient achievements={achievements as any} />;
}
