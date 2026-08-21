"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateProject, deleteProject } from "../../actions/project";

type Tab = "basic" | "story" | "technical" | "settings" | "seo";

const tabs: { id: Tab; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "story", label: "Story" },
  { id: "technical", label: "Technical" },
  { id: "settings", label: "Settings" },
  { id: "seo", label: "SEO" },
];

interface Project {
  id: string;
  name: string;
  slug: string;
  oneLine: string | null;
  year: number | null;
  category: string | null;
  status: string;
  featured: boolean;
  showOnHomepage: boolean;
  displayOrder: number;
  description: string | null;
  problem: string | null;
  designed: string | null;
  howItWorks: string | null;
  engineering: string | null;
  result: string | null;
  learned: string | null;
  technologies: string[];
  seoTitle: string | null;
  seoDescription: string | null;
}

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

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProject(data);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [id]);

  async function handleSubmit(status?: string) {
    setLoading(true);
    const form = document.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);
    if (status) formData.set("status", status);

    try {
      await updateProject(id, formData);
      router.push("/admin/projects");
    } catch {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    setLoading(true);
    try {
      await deleteProject(id);
      router.push("/admin/projects");
    } catch {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm" style={{ color: "#8888a0" }}>Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <div className="text-sm" style={{ color: "#8888a0" }}>Project not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Edit Project</h1>
        <div className="flex gap-2 flex-wrap">
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
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
          >
            Delete
          </button>
        </div>
      </div>

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
            <Input label="Project Name" name="name" required defaultValue={project.name} />
            <Input label="Slug" name="slug" defaultValue={project.slug} />
            <Input label="One-liner" name="oneLine" defaultValue={project.oneLine || ""} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Year" name="year" type="number" defaultValue={project.year?.toString() || ""} />
              <Input label="Category" name="category" defaultValue={project.category || ""} />
            </div>
          </div>
        )}

        {activeTab === "story" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Textarea label="Description" name="description" defaultValue={project.description || ""} />
            <Textarea label="Problem" name="problem" defaultValue={project.problem || ""} />
            <Textarea label="Designed" name="designed" defaultValue={project.designed || ""} />
            <Textarea label="How It Works" name="howItWorks" defaultValue={project.howItWorks || ""} />
            <Textarea label="Engineering" name="engineering" defaultValue={project.engineering || ""} />
            <Textarea label="Result" name="result" defaultValue={project.result || ""} />
            <Textarea label="Learned" name="learned" defaultValue={project.learned || ""} />
          </div>
        )}

        {activeTab === "technical" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="Technologies" name="technologies" defaultValue={project.technologies.join(", ")} />
            <p className="text-xs" style={{ color: "#55556a" }}>Comma-separated list of technologies used</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Select
              label="Status"
              name="status"
              defaultValue={project.status}
              options={[
                { value: "DRAFT", label: "Draft" },
                { value: "PUBLISHED", label: "Published" },
                { value: "ARCHIVED", label: "Archived" },
              ]}
            />
            <Input label="Display Order" name="displayOrder" type="number" defaultValue={project.displayOrder.toString()} />
            <Checkbox label="Featured" name="featured" defaultChecked={project.featured} />
            <Checkbox label="Show on Homepage" name="showOnHomepage" defaultChecked={project.showOnHomepage} />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="SEO Title" name="seoTitle" defaultValue={project.seoTitle || ""} />
            <Textarea label="SEO Description" name="seoDescription" defaultValue={project.seoDescription || ""} />
          </div>
        )}
      </form>
    </div>
  );
}