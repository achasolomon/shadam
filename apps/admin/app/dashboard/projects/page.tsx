import Link from 'next/link';
import { Button } from '@smhi/ui';
import { Plus, FileText } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Projects</h1>
          <p className="text-sm text-text-secondary">
            Manage your projects and programmes.
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Projects List */}
      <div className="rounded-xl border border-border bg-white">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt">
              <FileText className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-dark">No projects yet</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Create your first project to get started.
            </p>
            <Link href="/dashboard/projects/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
