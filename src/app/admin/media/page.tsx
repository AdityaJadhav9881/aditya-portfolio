import { prisma } from "@/lib/db";
import { getStorageType } from "@/lib/r2";
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

  const storageType = getStorageType();

  return (
    <div className="max-w-5xl">
      {storageType === 'local' && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" }}>
          Using local file storage. Configure Supabase or R2 in .env for cloud uploads.
        </div>
      )}
      {storageType === 'supabase' && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
          Connected to Supabase Storage
        </div>
      )}
      <MediaManager media={media} />
    </div>
  );
}
