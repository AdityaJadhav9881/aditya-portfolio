import { prisma } from "@/lib/db";
import { deleteAchievement } from "../actions/achievement";
import AchievementManager from "./AchievementManager";

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: [{ displayOrder: "asc" }, { year: "desc" }],
  });

  return (
    <div className="max-w-5xl">
      <AchievementManager achievements={achievements} />
    </div>
  );
}
