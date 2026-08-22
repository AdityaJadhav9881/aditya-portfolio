import { prisma } from "@/lib/db";
import MediaManager from "./MediaManager";

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, filename: true, originalName: true, mimeType: true,
      size: true, url: true, alt: true, caption: true, role: true,
      createdAt: true, project: { select: { name: true } },
    },
  });

  return (
    <div className="max-w-5xl">
      <MediaManager media={media} />
    </div>
  );
}
