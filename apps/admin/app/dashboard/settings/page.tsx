import { Button, Input } from '@smhi/ui';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-dark">Settings</h1>
        <p className="text-sm text-text-secondary">
          Manage organization details, contact information, and social accounts.
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-dark">General</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Organization Name" defaultValue="SHEDAM Mental Health Initiative" />
            <Input label="Tagline" defaultValue="Creating Awareness. Breaking the Stigma." />
          </div>
        </div>

        {/* Contact Settings */}
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-dark">Contact Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" defaultValue="info@shedam.org" />
            <Input label="Phone" defaultValue="+234 XXX XXX XXXX" />
            <Input label="Support Email" type="email" defaultValue="support@shedam.org" />
            <Input label="WhatsApp" defaultValue="" />
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-dark">Social Media</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Facebook URL" placeholder="https://facebook.com/..." />
            <Input label="Twitter URL" placeholder="https://twitter.com/..." />
            <Input label="Instagram URL" placeholder="https://instagram.com/..." />
            <Input label="LinkedIn URL" placeholder="https://linkedin.com/..." />
            <Input label="YouTube URL" placeholder="https://youtube.com/..." />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
