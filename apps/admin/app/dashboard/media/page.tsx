import { Button } from '@smhi/ui';
import { Upload, Image } from 'lucide-react';

export default function MediaPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Media Library</h1>
          <p className="text-sm text-text-secondary">
            Manage images, documents, and other media files.
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Media Grid */}
      <div className="rounded-xl border border-border bg-white">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt">
              <Image className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-dark">
              No media files yet
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Upload your first file to get started.
            </p>
            <Button className="mt-4">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
