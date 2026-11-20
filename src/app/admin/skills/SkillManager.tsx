"use client";

import { useState } from "react";
import { createSkillGroup, updateSkillGroup, deleteSkillGroup, createSkill, updateSkill, deleteSkill } from "../actions/skill";

interface SkillGroupData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  skills: { id: string; name: string; slug: string; displayOrder: number }[];
}

interface SkillData {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  skillGroupId: string | null;
}

export default function SkillManager({ skillGroups, ungroupedSkills }: {
  skillGroups: SkillGroupData[];
  ungroupedSkills: SkillData[];
}) {
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const groupById = new Map(skillGroups.map((g) => [g.id, g]));
  const allSkills = [...skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, skillGroupId: g.id }))), ...ungroupedSkills];
  const skillById = new Map(allSkills.map((s) => [s.id, s]));
  const groupToEdit = editingGroup ? groupById.get(editingGroup) : undefined;
  const skillToEdit = editingSkill ? skillById.get(editingSkill) : undefined;

  async function handleGroupSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    setError("");
    try {
      if (editingGroup) {
        await updateSkillGroup(editingGroup, formData);
      } else {
        await createSkillGroup(formData);
      }
      setShowGroupForm(false);
      setEditingGroup(null);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save skill group.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSkillSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setLoading(true);
    setError("");
    try {
      if (editingSkill) {
        await updateSkill(editingSkill, formData);
      } else {
        await createSkill(formData);
      }
      setShowSkillForm(false);
      setEditingSkill(null);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save skill.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteGroup(id: string) {
    if (!confirm("Delete this skill group? Skills in it will be ungrouped.")) return;
    setError("");
    try {
      await deleteSkillGroup(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill group.");
    }
  }

  async function handleDeleteSkill(id: string) {
    if (!confirm("Delete this skill?")) return;
    setError("");
    try {
      await deleteSkill(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill.");
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
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Skills</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowGroupForm(true); setEditingGroup(null); setShowSkillForm(false); setError(""); }}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}
          >
            + Skill Group
          </button>
          <button
            onClick={() => { setShowSkillForm(true); setEditingSkill(null); setShowGroupForm(false); setError(""); }}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#00c8e0", color: "#0a0a0f" }}
          >
            + Skill
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}

      {showGroupForm && (
        <form onSubmit={handleGroupSubmit} className="rounded-xl p-5 space-y-4 mb-6" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#e8e8ec" }}>
            {editingGroup ? "Edit Skill Group" : "New Skill Group"}
          </h3>
          <input name="name" placeholder="Group Name" required defaultValue={groupToEdit?.name ?? ""} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <input name="slug" placeholder="slug (auto-generated)" defaultValue={groupToEdit?.slug ?? ""} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <input name="description" placeholder="Description (optional)" defaultValue={groupToEdit?.description ?? ""} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <input name="displayOrder" type="number" placeholder="0" defaultValue={groupToEdit?.displayOrder ?? 0} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "#00c8e0", color: "#0a0a0f" }}>
              Save
            </button>
            <button type="button" onClick={() => { setShowGroupForm(false); setEditingGroup(null); }} className="px-4 py-2 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {showSkillForm && (
        <form onSubmit={handleSkillSubmit} className="rounded-xl p-5 space-y-4 mb-6" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#e8e8ec" }}>
            {editingSkill ? "Edit Skill" : "New Skill"}
          </h3>
          <input name="name" placeholder="Skill Name" required defaultValue={skillToEdit?.name ?? ""} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <input name="slug" placeholder="slug (auto-generated)" defaultValue={skillToEdit?.slug ?? ""} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <select name="skillGroupId" defaultValue={skillToEdit?.skillGroupId ?? ""} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
            <option value="">No group</option>
            {skillGroups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <input name="displayOrder" type="number" placeholder="0" defaultValue={skillToEdit?.displayOrder ?? 0} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "#00c8e0", color: "#0a0a0f" }}>
              Save
            </button>
            <button type="button" onClick={() => { setShowSkillForm(false); setEditingSkill(null); }} className="px-4 py-2 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {skillGroups.map((group) => (
          <div key={group.id} className="rounded-xl p-5" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium" style={{ color: "#e8e8ec" }}>{group.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => { setEditingGroup(group.id); setShowGroupForm(true); }} className="text-xs" style={{ color: "#8888a0" }}>Edit</button>
                <button onClick={() => handleDeleteGroup(group.id)} className="text-xs" style={{ color: "#ef4444" }}>Delete</button>
              </div>
            </div>
            {group.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#0c0c14" }}>
                    <span className="text-sm" style={{ color: "#e8e8ec" }}>{skill.name}</span>
                    <button onClick={() => { setEditingSkill(skill.id); setShowSkillForm(true); }} className="text-xs" style={{ color: "#8888a0" }}>Edit</button>
                    <button onClick={() => handleDeleteSkill(skill.id)} className="text-xs" style={{ color: "#ef4444" }}>x</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "#55556a" }}>No skills</p>
            )}
          </div>
        ))}

        {ungroupedSkills.length > 0 && (
          <div className="rounded-xl p-5" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-medium mb-3" style={{ color: "#8888a0" }}>Ungrouped Skills</h3>
            <div className="flex flex-wrap gap-2">
              {ungroupedSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#0c0c14" }}>
                  <span className="text-sm" style={{ color: "#e8e8ec" }}>{skill.name}</span>
                  <button onClick={() => { setEditingSkill(skill.id); setShowSkillForm(true); }} className="text-xs" style={{ color: "#8888a0" }}>Edit</button>
                  <button onClick={() => handleDeleteSkill(skill.id)} className="text-xs" style={{ color: "#ef4444" }}>x</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {skillGroups.length === 0 && ungroupedSkills.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "#55556a" }}>
            No skills yet. Add a skill group or individual skill.
          </div>
        )}
      </div>
    </div>
  );
}
