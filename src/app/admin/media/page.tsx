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

  const useR2 = (process.env.R2_ACCOUNT_ID || "").length > 0 && !(process.env.R2_ACCOUNT_ID || "").includes("your-");

  return (
    <div className="max-w-5xl">
      {!useR2 && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" }}>
          Using local file storage. Configure R2 credentials in .env for production uploads.
        </div>
      )}
      <MediaManager media={media} />
    </div>
  );
}
