"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectRecord } from "@/lib/types/project";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/projects", { cache: "no-store" });

      if (!response.ok) {
        setError("Failed to load projects.");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as { projects: ProjectRecord[] };
      setProjects(data.projects);
      setLoading(false);
    };

    void load();
  }, []);

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Manage your portfolio projects.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/projects/new"
            className="border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            New Project
          </Link>
          <button
            onClick={onLogout}
            className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Logout
          </button>
        </div>
      </header>

      {loading ? <p className="text-slate-600">Loading projects...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Title</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Slug</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Featured</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-slate-200">
                  <td className="px-4 py-3 text-slate-800">{project.title}</td>
                  <td className="px-4 py-3 text-slate-600">{project.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{project.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="font-semibold text-slate-900 underline underline-offset-4"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No projects yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
