import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function PreviewProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      sections: { orderBy: { displayOrder: "asc" } },
      projectSkills: { include: { skill: true } },
      media: { where: { visible: true }, orderBy: { displayOrder: "asc" } },
      relatedProjects: { include: { relatedProject: true } },
    },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 p-4 rounded-xl" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
          <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: "#eab308", color: "#0a0a0f" }}>
            PREVIEW
          </span>
          <span className="text-sm" style={{ color: "#eab308" }}>
            Status: {project.status}
          </span>
          <Link href={`/admin/projects/${id}`} className="ml-auto text-xs underline" style={{ color: "#8888a0" }}>
            Back to Editor
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#e8e8ec" }}>{project.name}</h1>
          {project.oneLine && <p className="text-lg" style={{ color: "#8888a0" }}>{project.oneLine}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            {project.year && <span className="text-xs" style={{ color: "#55556a" }}>{project.year}</span>}
            {project.category && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(0,200,224,0.1)", color: "#00c8e0" }}>{project.category}</span>}
          </div>
        </div>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.description && (
          <div className="mb-8">
            <p className="text-base leading-relaxed" style={{ color: "#e8e8ec" }}>{project.description}</p>
          </div>
        )}

        {project.media.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: "#8888a0" }}>Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {project.media.map((m) => (
                <div key={m.id} className="rounded-lg overflow-hidden" style={{ background: "#111119" }}>
                  {m.mimeType.startsWith("image/") ? (
                    <img src={m.url} alt={m.alt || ""} className="w-full aspect-video object-cover" />
                  ) : (
                    <div className="aspect-video flex items-center justify-center" style={{ background: "#0c0c14" }}>
                      <span className="text-xs" style={{ color: "#55556a" }}>{m.originalName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {project.sections.length > 0 && (
          <div className="space-y-6 mb-8">
            {project.sections.map((section) => (
              <div key={section.id} className="rounded-xl p-5" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
                {section.title && <h3 className="text-lg font-semibold mb-2" style={{ color: "#e8e8ec" }}>{section.title}</h3>}
                <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#8888a0" }}>{section.content}</div>
              </div>
            ))}
          </div>
        )}

        {project.projectSkills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: "#8888a0" }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {project.projectSkills.map((ps) => (
                <span key={ps.skillId} className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(0,200,224,0.1)", color: "#00c8e0" }}>
                  {ps.skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.relatedProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: "#8888a0" }}>Related Projects</h2>
            <div className="space-y-2">
              {project.relatedProjects.map((rp) => (
                <Link key={rp.relatedProjectId} href={`/admin/preview/${rp.relatedProject.id}`} className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5" style={{ color: "#00c8e0" }}>
                  {rp.relatedProject.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
