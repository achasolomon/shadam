import Link from 'next/link';
import { Button } from '@smhi/ui';
import { Plus, Calendar } from 'lucide-react';

export default function EventsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-dark">Events</h1>
          <p className="text-sm text-text-secondary">
            Manage events, registrations, and countdown.
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Events List */}
      <div className="rounded-xl border border-border bg-white">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-alt">
              <Calendar className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-dark">No events yet</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Create your first event to get started.
            </p>
            <Link href="/dashboard/events/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
