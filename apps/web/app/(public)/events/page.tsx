import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past events from SHEDAM.',
};

export default function EventsPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">Events</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Join us at upcoming events, workshops, and community forums.
        </p>
      </div>
    </div>
  );
}
