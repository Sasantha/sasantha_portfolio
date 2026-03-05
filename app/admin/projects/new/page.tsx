import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">New Project</h1>
        <p className="text-sm text-slate-600">Create a new portfolio project entry.</p>
      </header>
      <ProjectForm mode="create" />
    </section>
  );
}
