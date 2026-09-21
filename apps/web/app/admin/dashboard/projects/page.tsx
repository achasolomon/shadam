import { Plus, FileText } from 'lucide-react';

export default function AdminProjectsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Projects</h1>
          <p className="text-sm text-text-secondary">Manage your projects and programmes.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>
      <div className="rounded-xl border border-border bg-white p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-text-muted" />
        <h3 className="mt-4 font-heading text-lg font-semibold text-dark">No projects yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Create your first project to get started.</p>
      </div>
    </div>
  );
}
