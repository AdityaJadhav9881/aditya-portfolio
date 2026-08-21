"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../actions/project";

type Tab = "basic" | "story" | "technical" | "settings" | "seo";

const tabs: { id: Tab; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "story", label: "Story" },
  { id: "technical", label: "Technical" },
  { id: "settings", label: "Settings" },
  { id: "seo", label: "SEO" },
];

function Input({ label, name, type = "text", placeholder, required, defaultValue }: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
        style={{ background: "#0c0c14", border: "1px solid rgba(255,255,255,0.06)", color: "#e8e8ec" }}
      />
    </div>
  );
}

function Textarea({ label, name, placeholder, defaultValue }: {
  label: string; name: string; placeholder?: string; defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={5}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y"
        style={{ background: "#0c0c14", border: "1px solid rgba(255,255,255,0.06)", color: "#e8e8ec" }}
      />
    </div>
  );
}

function Select({ label, name, options, defaultValue }: {
  label: string; name: string; options: { value: string; label: string }[]; defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ color: "#8888a0" }}>{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
        style={{ background: "#0c0c14", border: "1px solid rgba(255,255,255,0.06)", color: "#e8e8ec" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ label, name, defaultChecked }: {
  label: string; name: string; defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded accent-[#00c8e0]"
      />
      <span className="text-sm" style={{ color: "#e8e8ec" }}>{label}</span>
    </label>
  );
}

export default function NewProjectPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    setLoading(true);
    const form = document.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);
    formData.set("status", status);

    try {
      await createProject(formData);
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
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: "#00c8e0", color: "#0a0a0f" }}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-sm whitespace-nowrap transition-colors"
            style={{
              color: activeTab === tab.id ? "#00c8e0" : "#8888a0",
              borderBottom: activeTab === tab.id ? "2px solid #00c8e0" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {activeTab === "basic" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="Project Name" name="name" required placeholder="My Awesome Project" />
            <Input label="Slug" name="slug" placeholder="auto-generated-from-name" />
            <Input label="One-liner" name="oneLine" placeholder="A short tagline" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Year" name="year" type="number" placeholder="2024" />
              <Input label="Category" name="category" placeholder="IoT, Hardware, etc." />
            </div>
          </div>
        )}

        {activeTab === "story" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Textarea label="Description" name="description" placeholder="What is this project?" />
            <Textarea label="Problem" name="problem" placeholder="What problem does it solve?" />
            <Textarea label="Designed" name="designed" placeholder="How was it designed?" />
            <Textarea label="How It Works" name="howItWorks" placeholder="How does it work?" />
            <Textarea label="Engineering" name="engineering" placeholder="Technical details" />
            <Textarea label="Result" name="result" placeholder="What was the outcome?" />
            <Textarea label="Learned" name="learned" placeholder="Key takeaways" />
          </div>
        )}

        {activeTab === "technical" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="Technologies" name="technologies" placeholder="React, Node.js, PostgreSQL" />
            <p className="text-xs" style={{ color: "#55556a" }}>Comma-separated list of technologies used</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Select
              label="Status"
              name="status"
              options={[
                { value: "DRAFT", label: "Draft" },
                { value: "PUBLISHED", label: "Published" },
                { value: "ARCHIVED", label: "Archived" },
              ]}
            />
            <Input label="Display Order" name="displayOrder" type="number" placeholder="0" />
            <Checkbox label="Featured" name="featured" />
            <Checkbox label="Show on Homepage" name="showOnHomepage" />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="SEO Title" name="seoTitle" placeholder="Page title for search engines" />
            <Textarea label="SEO Description" name="seoDescription" placeholder="Meta description" />
          </div>
        )}
      </form>
    </div>
  );
}
