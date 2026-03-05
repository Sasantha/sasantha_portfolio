"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import type { ProjectRecord } from "@/lib/types/project";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/projects/${id}`, { cache: "no-store" });
      if (!response.ok) {
        setError("Failed to load project.");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as { project: ProjectRecord };
      setProject(data.project);
      setLoading(false);
    };

    void load();
  }, [id]);

  if (loading) {
    return <p className="text-slate-600">Loading project...</p>;
  }

  if (error || !project) {
    return <p className="text-red-600">{error ?? "Project not found."}</p>;
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Edit Project</h1>
        <p className="text-sm text-slate-600">Update project fields or delete the project.</p>
      </header>
      <ProjectForm mode="edit" project={project} />
    </section>
  );
}
