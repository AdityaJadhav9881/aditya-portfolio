"use client";

import { useState } from "react";

interface SettingsManagerProps {
  settings: Record<string, unknown>;
  onUpdate: (key: string, value: string) => Promise<void>;
}

const settingFields = [
  { key: "siteTitle", label: "Site Title", type: "text" },
  { key: "siteDescription", label: "Site Description", type: "textarea" },
  { key: "siteUrl", label: "Site URL", type: "text" },
  { key: "ogImage", label: "Default OG Image URL", type: "text" },
  { key: "contactEmail", label: "Contact Email", type: "text" },
  { key: "githubUrl", label: "GitHub URL", type: "text" },
  { key: "linkedinUrl", label: "LinkedIn URL", type: "text" },
];

export default function SettingsManager({ settings, onUpdate }: SettingsManagerProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    for (const field of settingFields) {
      const value = formData.get(field.key);
      await onUpdate(field.key, typeof value === "string" ? value : "");
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputStyle = {
    background: "#0c0c14",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#e8e8ec",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
        {settingFields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.key}
                defaultValue={String(settings[field.key] || "")}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y"
                style={inputStyle}
              />
            ) : (
              <input
                type={field.type}
                name={field.key}
                defaultValue={String(settings[field.key] || "")}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: "#00c8e0", color: "#0a0a0f" }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-xs" style={{ color: "#22c55e" }}>Saved!</span>
          )}
        </div>
      </form>
    </div>
  );
}
