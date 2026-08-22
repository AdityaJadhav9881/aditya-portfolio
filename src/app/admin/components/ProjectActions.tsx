"use client";

import { toggleFeatured, toggleHomepage, deleteProject } from "../actions/project";

export function ProjectActions({
  id,
  featured,
  showOnHomepage,
}: {
  id: string;
  featured: boolean;
  showOnHomepage: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <form action={toggleFeatured.bind(null, id)}>
        <button className="px-2 py-1 rounded text-xs" style={{ color: "#8888a0" }}>
          {featured ? "Unfeature" : "Feature"}
        </button>
      </form>
      <form action={toggleHomepage.bind(null, id)}>
        <button className="px-2 py-1 rounded text-xs" style={{ color: "#8888a0" }}>
          {showOnHomepage ? "Hide Home" : "Show Home"}
        </button>
      </form>
      <form action={deleteProject.bind(null, id)}>
        <button
          className="px-2 py-1 rounded text-xs"
          style={{ color: "#ef4444" }}
          onClick={(e) => { if (!confirm("Delete this project?")) e.preventDefault(); }}
        >
          Delete
        </button>
      </form>
    </div>
  );
}

export function ProjectActionsMobile({
  id,
  featured,
  showOnHomepage,
}: {
  id: string;
  featured: boolean;
  showOnHomepage: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={toggleFeatured.bind(null, id)}>
        <button className="px-3 py-1.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>
          {featured ? "Unfeature" : "Feature"}
        </button>
      </form>
      <form action={toggleHomepage.bind(null, id)}>
        <button className="px-3 py-1.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#8888a0" }}>
          {showOnHomepage ? "Hide Home" : "Show Home"}
        </button>
      </form>
      <form action={deleteProject.bind(null, id)}>
        <button
          className="px-3 py-1.5 rounded text-xs"
          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
          onClick={(e) => { if (!confirm("Delete this project?")) e.preventDefault(); }}
        >
          Delete
        </button>
      </form>
    </div>
  );
}
