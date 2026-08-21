"use client";

import { useState } from "react";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string | null;
  role: string;
  project: { name: string } | null;
  createdAt: Date;
}

export default function MediaManager({ media }: { media: MediaItem[] }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("/api/upload", { method: "POST", body: formData });
      window.location.reload();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Media</h1>
        <label
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
          style={{ background: "#00c8e0", color: "#0a0a0f" }}
        >
          {uploading ? "Uploading..." : "+ Upload File"}
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
            accept="image/*,video/*,application/pdf"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="rounded-xl overflow-hidden"
            style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {item.mimeType.startsWith("image/") ? (
              <div className="aspect-square bg-[#0c0c14] flex items-center justify-center overflow-hidden">
                <img src={item.url} alt={item.alt || item.originalName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-square bg-[#0c0c14] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#55556a" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </div>
            )}
            <div className="p-3">
              <p className="text-xs truncate" style={{ color: "#e8e8ec" }}>{item.originalName}</p>
              <p className="text-xs mt-1" style={{ color: "#55556a" }}>
                {formatSize(item.size)} {item.project ? `· ${item.project.name}` : ""}
              </p>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm" style={{ color: "#55556a" }}>
            No media uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
