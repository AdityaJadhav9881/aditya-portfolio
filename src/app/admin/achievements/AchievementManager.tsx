"use client";

import { useState } from "react";
import { createAchievement, updateAchievement, deleteAchievement } from "../actions/achievement";

interface AchievementData {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  category: string | null;
  displayOrder: number;
  visible: boolean;
}

export default function AchievementManager({ achievements }: { achievements: AchievementData[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (editing) {
      updateAchievement(editing, formData).then(() => {
        setShowForm(false);
        setEditing(null);
      });
    } else {
      createAchievement(formData).then(() => {
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
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Achievements</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "#00c8e0", color: "#0a0a0f" }}
        >
          + Add Achievement
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4 mb-6" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#e8e8ec" }}>
            {editing ? "Edit Achievement" : "New Achievement"}
          </h3>
          <input name="title" placeholder="Title" required className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <textarea name="description" placeholder="Description" rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y" style={inputStyle} />
          <div className="grid grid-cols-3 gap-4">
            <input name="year" type="number" placeholder="Year" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            <input name="category" placeholder="Category" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            <input name="displayOrder" type="number" placeholder="Order (0)" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#00c8e0", color: "#0a0a0f" }}>Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {achievements.map((item) => (
          <div key={item.id} className="rounded-xl p-4 flex items-start justify-between gap-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                {item.year && <span className="text-xs font-mono" style={{ color: "#8888a0" }}>{item.year}</span>}
                {item.category && (
                  <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(0,200,224,0.1)", color: "#00c8e0" }}>
                    {item.category}
                  </span>
                )}
              </div>
              <h3 className="font-medium" style={{ color: "#e8e8ec" }}>{item.title}</h3>
              {item.description && (
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "#8888a0" }}>{item.description}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setEditing(item.id); setShowForm(true); }} className="text-xs" style={{ color: "#8888a0" }}>Edit</button>
              <form action={deleteAchievement.bind(null, item.id)}>
                <button className="text-xs" style={{ color: "#ef4444" }}>Delete</button>
              </form>
            </div>
          </div>
        ))}
        {achievements.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "#55556a" }}>No achievements yet.</div>
        )}
      </div>
    </div>
  );
}
