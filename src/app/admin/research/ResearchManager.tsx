"use client";

import { useState } from "react";
import { createResearchEntry, updateResearchEntry, deleteResearchEntry } from "../actions/research";

interface ResearchEntryData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  links: unknown;
  displayOrder: number;
  visible: boolean;
}

export default function ResearchManager({ entries }: { entries: ResearchEntryData[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (editing) {
      updateResearchEntry(editing, formData).then(() => {
        setShowForm(false);
        setEditing(null);
      });
    } else {
      createResearchEntry(formData).then(() => {
        setShowForm(false);
        form.reset();
      });
    }
  }

  const inputStyle = {
    background: "#0c0c14",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#e8e8ec",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Research</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "#00c8e0", color: "#0a0a0f" }}
        >
          + Add Research
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4 mb-6" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#e8e8ec" }}>
            {editing ? "Edit Research" : "New Research"}
          </h3>
          <input name="title" placeholder="Title" required className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <input name="slug" placeholder="slug (auto-generated)" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <textarea name="description" placeholder="Description" rows={4} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y" style={inputStyle} />
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>Links (JSON)</label>
            <textarea name="links" placeholder='{"url": "...", "label": "..."}' rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y" style={inputStyle} />
          </div>
          <input name="displayOrder" type="number" placeholder="Display Order (0)" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <label className="flex items-center gap-2 text-sm" style={{ color: "#8888a0" }}>
            <input type="checkbox" name="visible" defaultChecked className="rounded" />
            Visible on public site
          </label>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#00c8e0", color: "#0a0a0f" }}>Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-xl p-4 flex items-start justify-between gap-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="min-w-0">
              <h3 className="font-medium" style={{ color: "#e8e8ec" }}>{entry.title}</h3>
              {entry.description && (
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "#8888a0" }}>{entry.description}</p>
              )}
              {!entry.visible && <span className="text-xs mt-1 block" style={{ color: "#55556a" }}>(hidden)</span>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing(entry.id); setShowForm(true); }} className="text-xs" style={{ color: "#8888a0" }}>Edit</button>
              <form action={deleteResearchEntry.bind(null, entry.id)}>
                <button className="text-xs" style={{ color: "#ef4444" }} onClick={(e) => { if (!confirm("Delete this entry?")) e.preventDefault(); }}>Delete</button>
              </form>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "#55556a" }}>No research entries yet.</div>
        )}
      </div>
    </div>
  );
}
