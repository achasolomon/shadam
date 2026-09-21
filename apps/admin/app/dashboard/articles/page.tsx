import Link from 'next/link';
import { Button } from '@smhi/ui';
import { Plus, Newspaper } from 'lucide-react';

export default function ArticlesPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Articles</h1>
          <p className="text-sm text-text-secondary">
            Manage articles, stories, and insights.
          </p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Articles List */}
      <div className="rounded-xl border border-border bg-white">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt">
              <Newspaper className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-dark">
              No articles yet
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Create your first article to get started.
            </p>
            <Link href="/dashboard/articles/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
