import { prisma } from "@/lib/db";
import { deleteJourneyEntry } from "../actions/journey";
import JourneyManager from "./JourneyManager";

export default async function JourneyPage() {
  const entries = await prisma.journeyEntry.findMany({
    orderBy: [{ year: "desc" }, { displayOrder: "asc" }],
  });

  return (
    <div className="max-w-5xl">
      <JourneyManager entries={entries} />
    </div>
  );
}
