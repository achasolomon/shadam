import { MessageSquare } from 'lucide-react';

export default function AdminEnquiriesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-dark">Enquiries</h1>
        <p className="text-sm text-text-secondary">View and manage support enquiries.</p>
      </div>
      <div className="rounded-xl border border-border bg-white p-12 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-text-muted" />
        <h3 className="mt-4 font-heading text-lg font-semibold text-dark">No enquiries yet</h3>
        <p className="mt-1 text-sm text-text-secondary">Enquiries will appear here when submitted.</p>
      </div>
    </div>
  );
}
