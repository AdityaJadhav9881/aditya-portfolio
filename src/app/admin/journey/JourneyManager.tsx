"use client";

import { useState } from "react";
import { createJourneyEntry, updateJourneyEntry, deleteJourneyEntry } from "../actions/journey";

interface JourneyEntryData {
  id: string;
  year: number;
  title: string;
  description: string | null;
  type: string;
  displayOrder: number;
  visible: boolean;
}

const typeColors: Record<string, string> = {
  MILESTONE: "#00c8e0",
  PROJECT: "#22c55e",
  ONGOING: "#eab308",
};

export default function JourneyManager({ entries }: { entries: JourneyEntryData[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (editing) {
      updateJourneyEntry(editing, formData).then(() => {
        setShowForm(false);
        setEditing(null);
      });
    } else {
      createJourneyEntry(formData).then(() => {
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
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Journey</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "#00c8e0", color: "#0a0a0f" }}
        >
          + Add Entry
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4 mb-6" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#e8e8ec" }}>
            {editing ? "Edit Entry" : "New Entry"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="year" type="number" placeholder="Year" required className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            <select name="type" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
              <option value="MILESTONE">Milestone</option>
              <option value="PROJECT">Project</option>
              <option value="ONGOING">Ongoing</option>
            </select>
          </div>
          <input name="title" placeholder="Title" required className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <textarea name="description" placeholder="Description" rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y" style={inputStyle} />
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
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono" style={{ color: "#8888a0" }}>{entry.year}</span>
                <span className="px-2 py-0.5 rounded text-xs" style={{ background: `${typeColors[entry.type]}15`, color: typeColors[entry.type] }}>
                  {entry.type}
                </span>
                {!entry.visible && <span className="text-xs" style={{ color: "#55556a" }}>(hidden)</span>}
              </div>
              <h3 className="font-medium" style={{ color: "#e8e8ec" }}>{entry.title}</h3>
              {entry.description && (
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "#8888a0" }}>{entry.description}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing(entry.id); setShowForm(true); }} className="text-xs" style={{ color: "#8888a0" }}>Edit</button>
              <form action={deleteJourneyEntry.bind(null, entry.id)}>
                <button className="text-xs" style={{ color: "#ef4444" }} onClick={(e) => { if (!confirm("Delete this entry?")) e.preventDefault(); }}>Delete</button>
              </form>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "#55556a" }}>No journey entries yet.</div>
        )}
      </div>
    </div>
  );
}
