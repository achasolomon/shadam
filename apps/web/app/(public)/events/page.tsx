import type { Metadata } from 'next';
import { EventsContent } from '@/components/public/events-content';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming workshops, community forums and events from SHEDAM Mental Health Initiative.',
};

export default function EventsPage() {
  return <EventsContent />;
}
