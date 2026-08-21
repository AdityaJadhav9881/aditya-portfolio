"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/projects", label: "Projects", icon: "layers" },
  { href: "/admin/skills", label: "Skills", icon: "cpu" },
  { href: "/admin/journey", label: "Journey", icon: "compass" },
  { href: "/admin/research", label: "Research", icon: "search" },
  { href: "/admin/achievements", label: "Achievements", icon: "award" },
  { href: "/admin/media", label: "Media", icon: "image" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

const iconPaths: Record<string, React.ReactNode> = {
  grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
  layers: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  cpu: <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 7h10v10H7z" />,
  compass: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />,
  search: <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />,
  award: <path d="M12 15l-3.5 2 .67-3.89L6 10.11l3.92-.57L12 6l2.08 3.54 3.92.57-2.83 2.76.67 3.89z" />,
  image: <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />,
  settings: <circle cx="12" cy="12" r="3" />,
};

function SidebarIcon({ name }: { name: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {iconPaths[name]}
    </svg>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginOrSetup = pathname === "/admin/login" || pathname === "/admin/setup";

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginOrSetup) {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a0f" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-200 md:translate-x-0 md:static md:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0c0c14", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="h-14 flex items-center px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/admin" className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#00c8e0" }}>
            Admin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 mb-1 ${
                  isActive
                    ? "text-[#00c8e0]"
                    : "text-[#8888a0] hover:text-[#e8e8ec] hover:bg-white/5"
                }`}
                style={isActive ? { background: "rgba(0,200,224,0.08)" } : undefined}
              >
                <SidebarIcon name={link.icon} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-[#8888a0] hover:text-[#e8e8ec] hover:bg-white/5 transition-colors duration-150"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 text-[#8888a0] hover:text-[#e8e8ec]"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <span className="text-sm font-medium text-[#e8e8ec] md:hidden">Admin</span>

          <div className="hidden md:block" />

          <button
            onClick={handleLogout}
            className="text-xs text-[#8888a0] hover:text-[#e8e8ec] transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
