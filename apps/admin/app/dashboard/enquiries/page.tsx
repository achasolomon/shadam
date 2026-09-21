import { MessageSquare } from 'lucide-react';

export default function EnquiriesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-dark">Enquiries</h1>
        <p className="text-sm text-text-secondary">
          View and manage support enquiries and messages.
        </p>
      </div>

      {/* Enquiries List */}
      <div className="rounded-xl border border-border bg-white">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt">
              <MessageSquare className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-dark">
              No enquiries yet
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Enquiries will appear here when submitted through the website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
