import { prisma } from "@/lib/db";
import { deleteResearchEntry } from "../actions/research";
import ResearchManager from "./ResearchManager";

export default async function ResearchPage() {
  const entries = await prisma.researchEntry.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="max-w-5xl">
      <ResearchManager entries={entries} />
    </div>
  );
}
