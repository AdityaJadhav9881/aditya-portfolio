"use client";

import { useState, useMemo } from "react";
import { updateMedia, deleteMedia } from "../actions/media";
import { mediaSrc } from "@/lib/media";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string | null;
  caption: string | null;
  role: string;
  projectId: string | null;
  project: { name: string } | null;
  createdAt: Date;
}

interface Project {
  id: string;
  name: string;
}

const ROLES = ["COVER", "HERO", "GALLERY", "DIAGRAM", "HARDWARE", "TESTING", "OTHER"];
const MIME_FILTERS = [
  { label: "All", value: "" },
  { label: "Images", value: "image/" },
  { label: "Videos", value: "video/" },
  { label: "PDFs", value: "application/pdf" },
  { label: "APKs", value: "application/vnd.android.package-archive" },
];

function isApk(mimeType: string): boolean {
  return (
    mimeType === "application/vnd.android.package-archive" ||
    mimeType === "application/x-android-package-archive" ||
    mimeType.endsWith("+android-package-archive")
  );
}

export default function MediaManager({ media, projects }: { media: MediaItem[]; projects: Project[] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [mimeFilter, setMimeFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editProjectId, setEditProjectId] = useState<string>("");

  const filtered = useMemo(() => {
    return media.filter((item) => {
      if (search && !item.originalName.toLowerCase().includes(search.toLowerCase()) && !(item.alt || "").toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter && item.role !== roleFilter) return false;
      if (mimeFilter && !item.mimeType.startsWith(mimeFilter)) return false;
      return true;
    });
  }, [media, search, roleFilter, mimeFilter]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    let failed = 0;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) failed++;
      } catch {
        failed++;
      }
    }
    setUploading(false);
    if (failed > 0) {
      setError(`${failed} file(s) failed to upload.`);
    } else {
      window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media file?")) return;
    await deleteMedia(id);
    window.location.reload();
  }

  function startEditing(item: MediaItem) {
    setEditingId(item.id);
    setEditAlt(item.alt || "");
    setEditCaption(item.caption || "");
    setEditRole(item.role);
    setEditProjectId(item.projectId || "");
  }

  async function saveEdit() {
    if (!editingId) return;
    await updateMedia(editingId, {
      alt: editAlt,
      caption: editCaption,
      role: editRole,
      projectId: editProjectId || null,
    });
    setEditingId(null);
    window.location.reload();
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const inputStyle = { background: "#0c0c14", border: "1px solid rgba(255,255,255,0.06)", color: "#e8e8ec" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Media</h1>
        <label className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer" style={{ background: "#00c8e0", color: "#0a0a0f" }}>
          {uploading ? "Uploading..." : "+ Upload Files"}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} multiple accept="image/*,video/*,application/pdf,.apk,application/vnd.android.package-archive,application/octet-stream" />
        </label>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or alt text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none flex-1 min-w-[200px]"
          style={inputStyle}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="flex gap-1">
          {MIME_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setMimeFilter(f.value)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ background: mimeFilter === f.value ? "#00c8e0" : "#1a1a28", color: mimeFilter === f.value ? "#0a0a0f" : "#8888a0" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            {item.mimeType.startsWith("image/") ? (
              <div className="aspect-square bg-[#0c0c14] flex items-center justify-center overflow-hidden">
                <img src={mediaSrc(item.url)} alt={item.alt || item.originalName} className="w-full h-full object-cover" />
              </div>
            ) : item.mimeType === "application/pdf" ? (
              <div className="aspect-square bg-[#0c0c14] flex flex-col items-center justify-center gap-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
                <span className="text-[10px]" style={{ color: "#55556a" }}>PDF</span>
              </div>
            ) : isApk(item.mimeType) ? (
              <div className="aspect-square bg-[#0c0c14] flex flex-col items-center justify-center gap-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3ddc84" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M9 18h6" />
                  <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" strokeLinecap="round" />
                </svg>
                <span className="text-[10px]" style={{ color: "#3ddc84" }}>APK</span>
              </div>
            ) : (
              <div className="aspect-square bg-[#0c0c14] flex flex-col items-center justify-center gap-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#55556a" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
                <span className="text-[10px]" style={{ color: "#55556a" }}>FILE</span>
              </div>
            )}
            <div className="p-3">
              <p className="text-xs truncate" style={{ color: "#e8e8ec" }}>{item.originalName}</p>
              <p className="text-xs mt-1" style={{ color: "#55556a" }}>
                {formatSize(item.size)} {item.project ? `\u00b7 ${item.project.name}` : ""}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#1a1a28", color: "#8888a0" }}>{item.role}</span>
                <button onClick={() => startEditing(item)} className="text-xs" style={{ color: "#00c8e0" }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs" style={{ color: "#ef4444" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm" style={{ color: "#55556a" }}>
            {media.length === 0 ? "No media uploaded yet." : "No media matches your filters."}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => setEditingId(null)}>
          <div className="rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "#e8e8ec" }}>Edit Media</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>Assign to Project</label>
                <select value={editProjectId} onChange={(e) => setEditProjectId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
                  <option value="">No project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>Role</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>Alt Text</label>
                <input type="text" value={editAlt} onChange={(e) => setEditAlt(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>Caption</label>
                <input type="text" value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveEdit} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#00c8e0", color: "#0a0a0f" }}>Save</button>
              <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#1a1a28", color: "#8888a0" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
