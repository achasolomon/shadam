import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetailContent } from '@/components/public/event-detail-content';
import { getEventBySlug, getRelatedEvents, events } from '@/lib/events-data';
import type { EventData } from '@/lib/events-data';
import { resolveMediaUrl } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

async function fetchEvent(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_URL}/events/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

function mapApiEvent(e: any): EventData {
  const d = e.startAt ? new Date(e.startAt) : null;
  const venue = e.venue || e.venueAddress || e.location || '';
  return {
    id: Number(e.id) || 0,
    apiId: e.id,
    slug: e.slug,
    title: e.title,
    date: d ? d.toISOString() : '',
    endAt: e.endAt ? new Date(e.endAt).toISOString() : undefined,
    dateDisplay: d
      ? d.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
      : '',
    time: d ? d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }) : '',
    location: venue,
    address: venue,
    description: e.summary || e.description || '',
    fullDescription: e.description || e.summary || '',
    category: e.category || 'Mental Health',
    attendees: '',
    featured: !!e.featured || !!e.isFeatured,
    flyer: resolveMediaUrl(e.coverMedia?.url) || '/images/events/SHEDAMFLIER2.jpeg',
    gallery: [e.coverMedia?.url].filter(Boolean).map((u) => resolveMediaUrl(u as string)) || [],
    highlights: (e.highlights as string[] | undefined) || [],
    agenda: (e.agenda as { time: string; activity: string }[] | undefined) || [],
  };
}

async function fetchRelatedEvents(slug: string, limit = 3): Promise<EventData[]> {
  try {
    const res = await fetch(`${API_URL}/events?limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const items: any[] = json.data ?? [];
    const now = Date.now();
    return items
      .filter((e) => e.slug !== slug)
      .map(mapApiEvent)
      .sort((a, b) => {
        const aEnd = new Date(a.endAt || a.date).getTime();
        const bEnd = new Date(b.endAt || b.date).getTime();
        const aPast = aEnd < now;
        const bPast = bEnd < now;
        if (aPast !== bPast) return aPast ? 1 : -1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const apiEvent = await fetchEvent(slug);
  const event = apiEvent ? mapApiEvent(apiEvent) : getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: `${event.title} — SHEDAM Events`,
    description: event.description ?? event.fullDescription,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiEvent = await fetchEvent(slug);
  const event = apiEvent ? mapApiEvent(apiEvent) : getEventBySlug(slug);
  if (!event) notFound();
  let relatedEvents = await fetchRelatedEvents(slug, 3);
  if (relatedEvents.length === 0) {
    relatedEvents = getRelatedEvents(slug, 3);
  }
  return <EventDetailContent event={event} relatedEvents={relatedEvents} />;
}