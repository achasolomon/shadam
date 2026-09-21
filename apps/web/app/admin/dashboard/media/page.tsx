import { Upload, Image } from 'lucide-react';

export default function AdminMediaPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Media Library</h1>
          <p className="text-sm text-text-secondary">Manage images, documents, and media files.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          <Upload className="h-4 w-4" /> Upload Files
        </button>
      </div>
      <div className="rounded-xl border border-border bg-white p-12 text-center">
        <Image className="mx-auto h-12 w-12 text-text-muted" />
        <h3 className="mt-4 font-heading text-lg font-semibold text-dark">No media files yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Upload your first file to get started.</p>
      </div>
    </div>
  );
}
