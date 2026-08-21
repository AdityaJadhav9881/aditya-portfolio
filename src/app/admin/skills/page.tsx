import { prisma } from "@/lib/db";
import { deleteSkillGroup, deleteSkill } from "../actions/skill";
import SkillManager from "./SkillManager";

export default async function SkillsPage() {
  const skillGroups = await prisma.skillGroup.findMany({
    include: { skills: { orderBy: { displayOrder: "asc" } } },
    orderBy: { displayOrder: "asc" },
  });

  const skills = await prisma.skill.findMany({
    where: { skillGroupId: null },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="max-w-5xl">
      <SkillManager skillGroups={skillGroups} ungroupedSkills={skills} />
    </div>
  );
}
