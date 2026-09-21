import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-dark">Settings</h1>
        <p className="text-sm text-text-secondary">Manage organization details and configuration.</p>
      </div>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-dark">General</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">Organization Name</label>
              <input
                type="text"
                defaultValue="SHEDAM Mental Health Initiative"
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">Tagline</label>
              <input
                type="text"
                defaultValue="Creating Awareness. Breaking the Stigma."
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
