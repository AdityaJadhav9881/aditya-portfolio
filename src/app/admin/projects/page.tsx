import { prisma } from "@/lib/db";
import Link from "next/link";
import { ProjectActions, ProjectActionsMobile } from "../components/ProjectActions";

const statusColors: Record<string, { backgroundColor: string; color: string }> = {
  DRAFT: { backgroundColor: "rgba(234,179,8,0.1)", color: "#eab308" },
  PUBLISHED: { backgroundColor: "rgba(34,197,94,0.1)", color: "#22c55e" },
  ARCHIVED: { backgroundColor: "rgba(113,113,122,0.1)", color: "#71717a" },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.q) where.name = { contains: params.q, mode: "insensitive" };
  if (params.featured === "1") where.featured = true;

  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      year: true,
      featured: true,
      showOnHomepage: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#e8e8ec" }}>Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "#00c8e0", color: "#0a0a0f" }}
        >
          + New Project
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="q"
          placeholder="Search projects..."
          defaultValue={params.q}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "#0c0c14",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#e8e8ec",
          }}
        />
        <select
          name="status"
          defaultValue={params.status}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "#0c0c14",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#e8e8ec",
          }}
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          name="featured"
          defaultValue={params.featured}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "#0c0c14",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#e8e8ec",
          }}
        >
          <option value="">All Projects</option>
          <option value="1">Featured Only</option>
        </select>
        <button
          type="submit"
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}
        >
          Filter
        </button>
        {(params.q || params.status || params.featured) && (
          <a
            href="/admin/projects"
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}
          >
            Clear
          </a>
        )}
      </form>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl overflow-hidden" style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#8888a0" }}>Name</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#8888a0" }}>Status</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#8888a0" }}>Year</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#8888a0" }}>Featured</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#8888a0" }}>Homepage</th>
              <th className="text-right px-4 py-3 font-medium" style={{ color: "#8888a0" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3">
                  <Link href={`/admin/projects/${project.id}`} className="hover:underline" style={{ color: "#e8e8ec" }}>
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={statusColors[project.status]}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: "#8888a0" }}>{project.year || "\u2014"}</td>
                <td className="px-4 py-3" style={{ color: project.featured ? "#00c8e0" : "#55556a" }}>
                  {project.featured ? "\u2605" : "\u2606"}
                </td>
                <td className="px-4 py-3" style={{ color: project.showOnHomepage ? "#22c55e" : "#55556a" }}>
                  {project.showOnHomepage ? "\u2713" : "\u2014"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/projects/${project.id}`} className="px-2 py-1 rounded text-xs mr-2" style={{ color: "#8888a0" }}>
                    Edit
                  </Link>
                  <ProjectActions id={project.id} featured={project.featured} showOnHomepage={project.showOnHomepage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "#55556a" }}>
            No projects found.
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl p-4"
            style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <Link href={`/admin/projects/${project.id}`} className="font-medium" style={{ color: "#e8e8ec" }}>
                {project.name}
              </Link>
              <span
                className="px-2 py-0.5 rounded text-xs font-medium shrink-0 ml-2"
                style={statusColors[project.status]}
              >
                {project.status}
              </span>
            </div>
            <div className="text-xs mb-3" style={{ color: "#8888a0" }}>
              {project.year || "No year"} {project.featured ? "\u00b7 \u2605 Featured" : ""} {project.showOnHomepage ? "\u00b7 Homepage" : ""}
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/projects/${project.id}`} className="px-3 py-1.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>
                Edit
              </Link>
              <ProjectActionsMobile id={project.id} featured={project.featured} showOnHomepage={project.showOnHomepage} />
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "#55556a" }}>
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}
