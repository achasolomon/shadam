export default function AdminMediaPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-dark">Media Library</h1>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          + Upload Files
        </button>
      </div>
      <div className="rounded-xl border border-border bg-white p-12 text-center">
        <p className="text-text-muted">No media files yet. Upload your first file.</p>
      </div>
    </div>
  );
}
