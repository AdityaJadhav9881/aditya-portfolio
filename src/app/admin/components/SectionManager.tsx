"use client";

import { useState } from "react";
import { createSection, updateSection, deleteSection, toggleSectionVisible } from "../actions/section";

const SECTION_TYPES = [
  { value: "STORY", label: "Story" },
  { value: "FEATURES", label: "Key Features" },
  { value: "HARDWARE", label: "Hardware" },
  { value: "SOFTWARE", label: "Software" },
  { value: "TECHNICAL", label: "Technical Details" },
  { value: "HOW_IT_WORKS", label: "How It Works" },
  { value: "TESTING", label: "Testing" },
  { value: "CHALLENGES", label: "Challenges" },
  { value: "LESSONS", label: "Lessons" },
  { value: "RESEARCH", label: "Research" },
  { value: "FUTURE", label: "Future" },
  { value: "GALLERY", label: "Gallery" },
];

interface Section {
  id: string;
  sectionType: string;
  title: string | null;
  content: string | null;
  visible: boolean;
  displayOrder: number;
}

const inputStyle = {
  background: "#0c0c14",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#e8e8ec",
};

export default function SectionManager({ projectId, sections }: { projectId: string; sections: Section[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [sorted, setSorted] = useState(sections);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createSection(projectId, formData).then(() => {
      setShowForm(false);
      window.location.reload();
    });
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const formData = new FormData(e.currentTarget);
    updateSection(editing, projectId, formData).then(() => {
      setEditing(null);
      window.location.reload();
    });
  }

  function handleDelete(sectionId: string) {
    if (!confirm("Delete this section?")) return;
    deleteSection(sectionId, projectId).then(() => window.location.reload());
  }

  function handleToggle(sectionId: string) {
    toggleSectionVisible(sectionId, projectId).then(() => window.location.reload());
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "#8888a0" }}>
          Manage content sections for this project. Only visible sections with content will render on the public page.
        </p>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium shrink-0"
          style={{ background: "#00c8e0", color: "#0a0a0f" }}
        >
          + Add Section
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl p-4 space-y-3" style={{ background: "#0c0c14", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h4 className="text-xs font-medium" style={{ color: "#e8e8ec" }}>New Section</h4>
          <select name="sectionType" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle}>
            {SECTION_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input name="title" placeholder="Section Title (optional)" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
          <textarea name="content" placeholder="Section content..." rows={6} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y" style={inputStyle} />
          <input name="displayOrder" type="number" placeholder="Order (0)" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
          <div className="flex gap-2">
            <button type="submit" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#00c8e0", color: "#0a0a0f" }}>Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>Cancel</button>
          </div>
        </form>
      )}

      {sorted.map((section) => (
        <div key={section.id} className="rounded-xl p-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
          {editing === section.id ? (
            <form onSubmit={handleUpdate} className="space-y-3">
              <input name="title" defaultValue={section.title || ""} placeholder="Section Title" className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
              <textarea name="content" defaultValue={section.content || ""} rows={6} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y" style={inputStyle} />
              <input name="displayOrder" type="number" defaultValue={section.displayOrder} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={inputStyle} />
              <label className="flex items-center gap-2 text-xs" style={{ color: "#8888a0" }}>
                <input type="checkbox" name="visible" defaultChecked={section.visible} /> Visible
              </label>
              <div className="flex gap-2">
                <button type="submit" className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "#00c8e0", color: "#0a0a0f" }}>Save</button>
                <button type="button" onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(0,200,224,0.1)", color: "#00c8e0" }}>
                    {section.sectionType}
                  </span>
                  <span className="text-xs" style={{ color: "#55556a" }}>#{section.displayOrder}</span>
                  {!section.visible && <span className="text-xs" style={{ color: "#55556a" }}>(hidden)</span>}
                </div>
                {section.title && <h4 className="text-sm font-medium" style={{ color: "#e8e8ec" }}>{section.title}</h4>}
                {section.content && <p className="text-xs mt-1 line-clamp-2" style={{ color: "#8888a0" }}>{section.content}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleToggle(section.id)} className="text-xs" style={{ color: section.visible ? "#22c55e" : "#55556a" }}>
                  {section.visible ? "Hide" : "Show"}
                </button>
                <button onClick={() => setEditing(section.id)} className="text-xs" style={{ color: "#8888a0" }}>Edit</button>
                <button onClick={() => handleDelete(section.id)} className="text-xs" style={{ color: "#ef4444" }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {sorted.length === 0 && (
        <p className="text-center py-8 text-xs" style={{ color: "#55556a" }}>No sections yet. Add sections to structure your project content.</p>
      )}
    </div>
  );
}
