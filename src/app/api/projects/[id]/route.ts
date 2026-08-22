import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        sections: { orderBy: { displayOrder: "asc" } },
        projectSkills: { select: { skillId: true } },
        researchProjects: { select: { researchId: true } },
        achievementProjects: { select: { achievementId: true } },
        relatedProjects: { select: { relatedProjectId: true } },
        media: { orderBy: { displayOrder: "asc" } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...project,
      linkedSkillIds: project.projectSkills.map((ps) => ps.skillId),
      linkedResearchIds: project.researchProjects.map((rp) => rp.researchId),
      linkedAchievementIds: project.achievementProjects.map((ap) => ap.achievementId),
      linkedProjectIds: project.relatedProjects.map((rp) => rp.relatedProjectId),
    });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
