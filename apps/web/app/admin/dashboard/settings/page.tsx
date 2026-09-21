import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold text-dark">Settings</h1>
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-heading text-lg font-semibold text-dark">General</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Organization Name</label>
            <input type="text" defaultValue="SHEDAM Mental Health Initiative" className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Tagline</label>
            <input type="text" defaultValue="Creating Awareness. Breaking the Stigma." className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
