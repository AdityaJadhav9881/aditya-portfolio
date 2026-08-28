"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { updateProject, deleteProject } from "../../actions/project";
import SectionManager from "../../components/SectionManager";
import RelationshipManager from "../../components/RelationshipManager";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";

type Tab = "basic" | "story" | "technical" | "sections" | "media" | "relationships" | "settings" | "seo";

const tabs: { id: Tab; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "story", label: "Story" },
  { id: "technical", label: "Technical" },
  { id: "sections", label: "Sections" },
  { id: "media", label: "Media" },
  { id: "relationships", label: "Links" },
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
  sections: { id: string; sectionType: string; title: string | null; content: string | null; visible: boolean; displayOrder: number }[];
  media: { id: string; filename: string; originalName: string; mimeType: string; size: number; url: string; alt: string | null; caption: string | null; role: string; displayOrder: number; visible: boolean }[];
  linkedSkillIds: string[];
  linkedResearchIds: string[];
  linkedAchievementIds: string[];
  linkedProjectIds: string[];
}

interface DropdownData {
  skills: { id: string; name: string }[];
  research: { id: string; name: string }[];
  achievements: { id: string; name: string }[];
  projects: { id: string; name: string }[];
}

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

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [dropdownData, setDropdownData] = useState<DropdownData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  useUnsavedChanges(hasChanges);

  function handleFieldChange(name: string, value: string) {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  }

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => { setProject(data); setFetching(false); })
      .catch(() => setFetching(false));
  }, [id]);

  useEffect(() => {
    if (activeTab === "relationships" && !dropdownData) {
      Promise.all([
        fetch("/api/admin/skills").then(r => r.json()),
        fetch("/api/admin/research").then(r => r.json()),
        fetch("/api/admin/achievements").then(r => r.json()),
        fetch("/api/admin/projects-list").then(r => r.json()),
      ]).then(([skills, research, achievements, projects]) => {
        setDropdownData({ skills, research, achievements, projects });
      }).catch(() => {});
    }
  }, [activeTab, dropdownData]);

  async function handleSubmit(status?: string) {
    setLoading(true);
    const formData = new FormData();
    for (const [key, val] of Object.entries(formValues)) {
      formData.set(key, val);
    }
    if (status) formData.set("status", status);
    try {
      await updateProject(id, formData);
      setHasChanges(false);
      router.push("/admin/projects");
    } catch { setLoading(false); }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    setLoading(true);
    try { await deleteProject(id); router.push("/admin/projects"); } catch { setLoading(false); }
  }

  if (fetching) return <div className="flex items-center justify-center py-20"><div className="text-sm" style={{ color: "#8888a0" }}>Loading project...</div></div>;
  if (!project) return <div className="text-center py-20"><div className="text-sm" style={{ color: "#8888a0" }}>Project not found.</div></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Edit Project</h1>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/admin/preview/${id}`} target="_blank" className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "rgba(234,179,8,0.1)", color: "#eab308" }}>
            Preview
          </Link>
          <button onClick={() => handleSubmit("DRAFT")} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>
            Save Draft
          </button>
          <button onClick={() => handleSubmit("PUBLISHED")} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "#00c8e0", color: "#0a0a0f" }}>
            Publish
          </button>
          <button onClick={handleDelete} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
            Delete
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
            <Input label="Project Name" name="name" required value={formValues.name ?? project.name} onChange={(v) => handleFieldChange("name", v)} />
            <Input label="Slug" name="slug" value={formValues.slug ?? project.slug} onChange={(v) => handleFieldChange("slug", v)} />
            <Input label="One-liner" name="oneLine" value={formValues.oneLine ?? (project.oneLine || "")} onChange={(v) => handleFieldChange("oneLine", v)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Year" name="year" type="number" value={formValues.year ?? (project.year?.toString() || "")} onChange={(v) => handleFieldChange("year", v)} />
              <Input label="Category" name="category" value={formValues.category ?? (project.category || "")} onChange={(v) => handleFieldChange("category", v)} />
            </div>
          </div>
        )}

        {activeTab === "story" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Textarea label="Description" name="description" value={formValues.description ?? (project.description || "")} onChange={(v) => handleFieldChange("description", v)} />
            <Textarea label="Problem" name="problem" value={formValues.problem ?? (project.problem || "")} onChange={(v) => handleFieldChange("problem", v)} />
            <Textarea label="Designed" name="designed" value={formValues.designed ?? (project.designed || "")} onChange={(v) => handleFieldChange("designed", v)} />
            <Textarea label="How It Works" name="howItWorks" value={formValues.howItWorks ?? (project.howItWorks || "")} onChange={(v) => handleFieldChange("howItWorks", v)} />
            <Textarea label="Engineering" name="engineering" value={formValues.engineering ?? (project.engineering || "")} onChange={(v) => handleFieldChange("engineering", v)} />
            <Textarea label="Result" name="result" value={formValues.result ?? (project.result || "")} onChange={(v) => handleFieldChange("result", v)} />
            <Textarea label="Learned" name="learned" value={formValues.learned ?? (project.learned || "")} onChange={(v) => handleFieldChange("learned", v)} />
          </div>
        )}

        {activeTab === "technical" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="Technologies" name="technologies" value={formValues.technologies ?? project.technologies.join(", ")} onChange={(v) => handleFieldChange("technologies", v)} />
            <p className="text-xs" style={{ color: "#55556a" }}>Comma-separated list of technologies used</p>
          </div>
        )}

        {activeTab === "sections" && (
          <div className="rounded-xl p-5" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <SectionManager projectId={id} sections={project.sections} />
          </div>
        )}

        {activeTab === "media" && (
          <div className="rounded-xl p-5" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-sm font-medium mb-3" style={{ color: "#e8e8ec" }}>Project Media</h3>
            {project.media.length === 0 ? (
              <p className="text-xs py-4" style={{ color: "#55556a" }}>No media assigned. Upload via <Link href="/admin/media" className="underline" style={{ color: "#00c8e0" }}>Media Library</Link> and assign to this project.</p>
            ) : (
              <div className="space-y-2">
                {project.media.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "#0c0c14" }}>
                    {m.mimeType.startsWith("image/") ? (
                      <img src={m.url} alt={m.alt || ""} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded flex items-center justify-center" style={{ background: "#111119" }}>
                        <span className="text-[10px]" style={{ color: "#55556a" }}>FILE</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate" style={{ color: "#e8e8ec" }}>{m.originalName}</p>
                      <p className="text-[10px]" style={{ color: "#55556a" }}>{m.role} · {m.alt || "no alt"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "relationships" && (
          <div className="rounded-xl p-5" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            {dropdownData ? (
              <RelationshipManager
                projectId={id}
                allSkills={dropdownData.skills}
                linkedSkillIds={project.linkedSkillIds}
                allResearch={dropdownData.research}
                linkedResearchIds={project.linkedResearchIds}
                allAchievements={dropdownData.achievements}
                linkedAchievementIds={project.linkedAchievementIds}
                allProjects={dropdownData.projects}
                linkedProjectIds={project.linkedProjectIds}
              />
            ) : (
              <p className="text-xs py-4" style={{ color: "#8888a0" }}>Loading...</p>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Select label="Status" name="status" value={formValues.status ?? project.status} onChange={(v) => handleFieldChange("status", v)} options={[{ value: "DRAFT", label: "Draft" }, { value: "PUBLISHED", label: "Published" }, { value: "ARCHIVED", label: "Archived" }]} />
            <Input label="Display Order" name="displayOrder" type="number" value={formValues.displayOrder ?? project.displayOrder.toString()} onChange={(v) => handleFieldChange("displayOrder", v)} />
            <Checkbox label="Featured" name="featured" checked={formValues.featured !== undefined ? formValues.featured === "true" : project.featured} onChange={(v) => handleFieldChange("featured", v.toString())} />
            <Checkbox label="Show on Homepage" name="showOnHomepage" checked={formValues.showOnHomepage !== undefined ? formValues.showOnHomepage === "true" : project.showOnHomepage} onChange={(v) => handleFieldChange("showOnHomepage", v.toString())} />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Input label="SEO Title" name="seoTitle" value={formValues.seoTitle ?? (project.seoTitle || "")} onChange={(v) => handleFieldChange("seoTitle", v)} />
            <Textarea label="SEO Description" name="seoDescription" value={formValues.seoDescription ?? (project.seoDescription || "")} onChange={(v) => handleFieldChange("seoDescription", v)} />
          </div>
        )}
      </form>
    </div>
  );
}
