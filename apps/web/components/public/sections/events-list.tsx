'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useEvents, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const staticEvents = [
  {
    date: { month: 'OCT', day: '15' },
    title: 'Mental Health Awareness Walk',
    description: 'Join us for a community walk to raise awareness about mental health and reduce stigma.',
    location: 'Lagos, Nigeria',
    color: 'bg-primary',
    flyer: '/images/events/SHEDAMFLIER2.jpeg',
    cta: 'Register',
    slug: '',
  },
  {
    date: { month: 'NOV', day: '02' },
    title: 'Youth Mental Health Workshop',
    description: 'Interactive workshop designed to equip young people with mental health coping strategies.',
    location: 'Abuja, Nigeria',
    color: 'bg-[#D4A843]',
    flyer: '/images/events/flyer1.png',
    cta: 'Learn More',
    slug: '',
  },
  {
    date: { month: 'NOV', day: '20' },
    title: 'Community Outreach Program',
    description: 'Providing free mental health screenings and consultations in underserved communities.',
    location: 'Port Harcourt, Nigeria',
    color: 'bg-[#4A90D9]',
    flyer: '/images/events/flyer3.png',
    cta: 'Get Involved',
    slug: '',
  },
];

function formatEventDate(startAt?: string) {
  if (!startAt) return null;
  const d = new Date(startAt);
  return {
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()).padStart(2, '0'),
    full: d.toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }),
  };
}

export function EventsList() {
  const [currentFlyer, setCurrentFlyer] = useState(0);
  const { get } = useSettingsMap();

  const eyebrow = get('events_upcoming_title', 'Upcoming Events');
  const title = get('events_section_title', 'Get Involved');
  const description = get('events_section_description', 'Attend our events, workshops, and outreach programs to support mental health awareness and community wellbeing.');
  const viewAllCta = get('events_view_all_cta', 'View All Events');

  // Try API first, fall back to static
  const { data: apiResult, source } = useEvents({ limit: 3 });

  const apiEvents =
    source === 'api' && apiResult.data.length > 0
      ? apiResult.data.map((e: any, i: number) => {
          const fd = formatEventDate(e.startAt);
          const colors = ['bg-primary', 'bg-[#D4A843]', 'bg-[#4A90D9]'];
          return {
            date: fd || { month: '—', day: '–' },
            title: e.title,
            description: e.summary || e.description || '',
            location: e.location || '',
            color: colors[i % colors.length],
            flyer: resolveMediaUrl(e.coverMedia?.url) || '/images/events/SHEDAMFLIER2.jpeg',
            cta: 'Register',
            slug: e.slug,
          };
        })
      : [];

  const events = apiEvents.length > 0 ? apiEvents.slice(0, 3) : staticEvents;

  const nextFlyer = useCallback(() => {
    setCurrentFlyer((prev) => (prev + 1) % events.length);
  }, [events.length]);

  useEffect(() => {
    const timer = setInterval(nextFlyer, 4000);
    return () => clearInterval(timer);
  }, [nextFlyer]);

  return (
    <section className="bg-[#FAFAF8] py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-start">
          {/* Left: Text + Flyer carousel */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-3 font-heading text-xl font-normal text-dark sm:text-2xl lg:text-3xl xl:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
            <Link
              href="/events"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-dark/20 px-5 py-2.5 text-sm font-medium text-dark transition-all duration-300 hover:bg-dark hover:text-white"
            >
              {viewAllCta} <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Flyer carousel */}
            <div className="relative mt-6 w-40 overflow-hidden rounded-xl shadow-lg sm:w-48 lg:mt-8">
              <div className="relative h-56 sm:h-72">
                {events.map((e, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity: i === currentFlyer ? 1 : 0 }}
                  >
                    <Image src={e.flyer} alt={e.title} fill className="object-cover" sizes="192px" />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCurrentFlyer((prev) => (prev - 1 + events.length) % events.length)}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setCurrentFlyer((prev) => (prev + 1) % events.length)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {events.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentFlyer(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentFlyer ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Event List */}
          <div className="space-y-3 sm:space-y-4">
            {events.map((e, i) => (
              <div
                key={i}
                className="group flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 transition-all duration-300 hover:shadow-md hover:border-primary/30 sm:gap-4 sm:p-4"
              >
                {/* Flyer thumbnail */}
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-20">
                  <Image
                    src={e.flyer}
                    alt={`Flyer for ${e.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="80px"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-normal text-dark sm:text-base">{e.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary line-clamp-2">{e.description}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-text-secondary sm:mt-2 sm:gap-3">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {e.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {e.date.month} {e.date.day}
                    </span>
                  </div>
                  <Link
                    href={e.slug ? `/events/${e.slug}` : '/events'}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-[#1A2332]"
                  >
                    {e.cta} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Date block */}
                <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${e.color} text-white sm:h-14 sm:w-14`}>
                  <span className="text-[8px] font-bold uppercase leading-none sm:text-[9px]">{e.date.month}</span>
                  <span className="font-heading text-base leading-tight sm:text-lg">{e.date.day}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
