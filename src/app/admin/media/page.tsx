import { prisma } from "@/lib/db";
import MediaManager from "./MediaManager";

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: { select: { name: true } } },
  });

  return (
    <div className="max-w-5xl">
      <MediaManager media={media} />
    </div>
  );
}
