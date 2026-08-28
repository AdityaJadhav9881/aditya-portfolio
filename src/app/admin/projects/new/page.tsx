"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../actions/project";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";

type Tab = "basic" | "story" | "technical" | "settings" | "seo";

const tabs: { id: Tab; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "story", label: "Story" },
  { id: "technical", label: "Technical" },
  { id: "settings", label: "Settings" },
  { id: "seo", label: "SEO" },
];

const inputStyle = {
  background: "#0c0c14",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#e8e8ec",
};

function Input({ label, name, type = "text", placeholder, required, value, onChange }: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>{label}</label>
      <input type={type} name={name} placeholder={placeholder} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
    </div>
  );
}

function Textarea({ label, name, placeholder, value, onChange }: {
  label: string; name: string; placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>{label}</label>
      <textarea name={name} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} rows={5} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y" style={inputStyle} />
    </div>
  );
}

function Select({ label, name, options, value, onChange }: {
  label: string; name: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>{label}</label>
      <select name={name} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Checkbox({ label, name, checked, onChange }: {
  label: string; name: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded accent-[#00c8e0]" />
      <span className="text-sm" style={{ color: "#e8e8ec" }}>{label}</span>
    </label>
  );
}

export default function NewProjectPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useUnsavedChanges(hasChanges);

  function handleFieldChange(name: string, value: string) {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  }

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    setLoading(true);
    const formData = new FormData();
    for (const [key, val] of Object.entries(formValues)) {
      formData.set(key, val);
    }
    formData.set("status", status);

    try {
      await createProject(formData);
      setHasChanges(false);
      router.push("/admin/projects");
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>New Project</h1>
        <div className="flex gap-2">
          <button onClick={() => handleSubmit("DRAFT")} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>
            Save Draft
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "#00c8e0", color: "#0a0a0f" }}>
            Publish
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2.5 text-sm whitespace-nowrap transition-colors" style={{ color: activeTab === tab.id ? "#00c8e0" : "#8888a0", borderBottom: activeTab === tab.id ? "2px solid #00c8e0" : "2px solid transparent" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <form ref={formRef} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {activeTab === "basic" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="Project Name" name="name" required placeholder="My Awesome Project" value={formValues.name ?? ""} onChange={(v) => handleFieldChange("name", v)} />
            <Input label="Slug" name="slug" placeholder="auto-generated-from-name" value={formValues.slug ?? ""} onChange={(v) => handleFieldChange("slug", v)} />
            <Input label="One-liner" name="oneLine" placeholder="A short tagline" value={formValues.oneLine ?? ""} onChange={(v) => handleFieldChange("oneLine", v)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Year" name="year" type="number" placeholder="2024" value={formValues.year ?? ""} onChange={(v) => handleFieldChange("year", v)} />
              <Input label="Category" name="category" placeholder="IoT, Hardware, etc." value={formValues.category ?? ""} onChange={(v) => handleFieldChange("category", v)} />
            </div>
          </div>
        )}

        {activeTab === "story" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Textarea label="Description" name="description" placeholder="What is this project?" value={formValues.description ?? ""} onChange={(v) => handleFieldChange("description", v)} />
            <Textarea label="Problem" name="problem" placeholder="What problem does it solve?" value={formValues.problem ?? ""} onChange={(v) => handleFieldChange("problem", v)} />
            <Textarea label="Designed" name="designed" placeholder="How was it designed?" value={formValues.designed ?? ""} onChange={(v) => handleFieldChange("designed", v)} />
            <Textarea label="How It Works" name="howItWorks" placeholder="How does it work?" value={formValues.howItWorks ?? ""} onChange={(v) => handleFieldChange("howItWorks", v)} />
            <Textarea label="Engineering" name="engineering" placeholder="Technical details" value={formValues.engineering ?? ""} onChange={(v) => handleFieldChange("engineering", v)} />
            <Textarea label="Result" name="result" placeholder="What was the outcome?" value={formValues.result ?? ""} onChange={(v) => handleFieldChange("result", v)} />
            <Textarea label="Learned" name="learned" placeholder="Key takeaways" value={formValues.learned ?? ""} onChange={(v) => handleFieldChange("learned", v)} />
          </div>
        )}

        {activeTab === "technical" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="Technologies" name="technologies" placeholder="React, Node.js, PostgreSQL" value={formValues.technologies ?? ""} onChange={(v) => handleFieldChange("technologies", v)} />
            <p className="text-xs" style={{ color: "#55556a" }}>Comma-separated list of technologies used</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Select label="Status" name="status" value={formValues.status ?? "DRAFT"} onChange={(v) => handleFieldChange("status", v)} options={[{ value: "DRAFT", label: "Draft" }, { value: "PUBLISHED", label: "Published" }, { value: "ARCHIVED", label: "Archived" }]} />
            <Input label="Display Order" name="displayOrder" type="number" placeholder="0" value={formValues.displayOrder ?? ""} onChange={(v) => handleFieldChange("displayOrder", v)} />
            <Checkbox label="Featured" name="featured" checked={formValues.featured === "true"} onChange={(v) => handleFieldChange("featured", v.toString())} />
            <Checkbox label="Show on Homepage" name="showOnHomepage" checked={formValues.showOnHomepage === "true"} onChange={(v) => handleFieldChange("showOnHomepage", v.toString())} />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="SEO Title" name="seoTitle" placeholder="Page title for search engines" value={formValues.seoTitle ?? ""} onChange={(v) => handleFieldChange("seoTitle", v)} />
            <Textarea label="SEO Description" name="seoDescription" placeholder="Meta description" value={formValues.seoDescription ?? ""} onChange={(v) => handleFieldChange("seoDescription", v)} />
          </div>
        )}
      </form>
    </div>
  );
}
