import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [projectCounts, skillCount, researchCount, achievementCount, journeyCount] = await Promise.all([
    prisma.project.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.skill.count(),
    prisma.researchEntry.count(),
    prisma.achievement.count(),
    prisma.journeyEntry.count(),
  ]);

  const totalProjects = projectCounts.reduce<number>((acc: number, g: any) => acc + g._count, 0);
  const published = projectCounts.find((g: any) => g.status === "PUBLISHED")?._count || 0;
  const drafts = projectCounts.find((g: any) => g.status === "DRAFT")?._count || 0;
  const featured = await prisma.project.count({ where: { featured: true } });

  const stats = [
    { label: "Total Projects", value: totalProjects, color: "#e8e8ec" },
    { label: "Published", value: published, color: "#22c55e" },
    { label: "Drafts", value: drafts, color: "#eab308" },
    { label: "Featured", value: featured, color: "#00c8e0" },
    { label: "Skills", value: skillCount, color: "#e8e8ec" },
    { label: "Research", value: researchCount, color: "#e8e8ec" },
    { label: "Achievements", value: achievementCount, color: "#e8e8ec" },
    { label: "Journey Entries", value: journeyCount, color: "#e8e8ec" },
  ];

  const quickActions = [
    { href: "/admin/projects/new", label: "Add Project" },
    { href: "/admin/research", label: "Add Research" },
    { href: "/admin/achievements", label: "Add Achievement" },
    { href: "/admin/media", label: "Upload Media" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold mb-8" style={{ color: "#e8e8ec" }}>Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{ background: "#111119", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs mt-1" style={{ color: "#8888a0" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: "#8888a0" }}>
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
            style={{
              background: "rgba(0,200,224,0.1)",
              color: "#00c8e0",
              border: "1px solid rgba(0,200,224,0.2)",
            }}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
