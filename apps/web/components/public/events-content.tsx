'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  CheckCircle2,
  Target,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { events as upcomingEvents } from '@/lib/events-data';
import { useRegistrationModal } from '@/components/public/registration-modal';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { useEvents, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const pastEventsStatic = [
  {
    id: 101,
    title: 'Community Mental Health Forum',
    date: 'March 22, 2025',
    location: 'Gwagwalada, Abuja',
    description: 'Over 150 community members attended to learn about mental health and available support resources.',
    attendees: '150+',
    image: '/images/projects/community-outreach.jpg',
  },
  {
    id: 102,
    title: 'School Outreach Programme',
    date: 'February 14, 2025',
    location: 'FCT Secondary Schools',
    description: 'Mental health awareness sessions delivered to 500+ students across 8 schools in the FCT.',
    attendees: '500+',
    image: '/images/projects/educational-workshop.jpg',
  },
  {
    id: 103,
    title: 'World Mental Health Day Celebration',
    date: 'October 10, 2024',
    location: 'Unity Fountain, Abuja',
    description: 'Public event featuring talks, music and community engagement to mark World Mental Health Day.',
    attendees: '400+',
    image: '/images/projects/awareness.jpg',
  },
  {
    id: 104,
    title: 'Professional Referral Launch',
    date: 'September 5, 2024',
    location: 'Abuja, Nigeria',
    description: 'Launch of the structured referral pathway connecting individuals to licensed mental health professionals.',
    attendees: '80+',
    image: '/images/projects/support-referal-system.jpg',
  },
];

const categoryColors: Record<string, string> = {
  Community: '#88E788',
  Education: '#3B82F6',
  Corporate: '#F59E0B',
  Healthcare: '#EF4444',
};

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return time;
}

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return { ref: setRef, visible };
}

function Animate({
  children,
  className = '',
  animation = 'animate-fade-up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`${animation} ${visible ? 'animate-in' : 'animate-hidden'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CountdownPill({ date }: { date: string }) {
  const { days, hours, minutes } = useCountdown(date);
  if (days > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#1A2332]/80 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
        <span className="h-1 w-1 animate-pulse rounded-full bg-primary" />
        {days}d {hours}h
      </span>
    );
  }
  if (hours > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-medium text-[#1A2332] backdrop-blur-sm">
        <span className="h-1 w-1 animate-pulse rounded-full bg-[#1A2332]" />
        {hours}h {minutes}m
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
      <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
      Happening Now
    </span>
  );
}

function EventCountdownBlocks({ date }: { date: string }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  return (
    <div className="flex gap-2">
      {[
        { value: days, label: 'D' },
        { value: hours, label: 'H' },
        { value: minutes, label: 'M' },
        { value: seconds, label: 'S' },
      ].map((item) => (
        <div key={item.label} className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A2332] font-heading text-sm text-white">
          {String(item.value).padStart(2, '0')}
          <span className="ml-0.5 text-[8px] text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function EventsContent() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Try API first, fall back to static data
  const { data: apiEvents } = useEvents({ limit: 50 });
  const eventsMeta = (apiEvents as any).meta;
  const { get } = useSettingsMap();

  const heroEyebrow = get('events_hero_eyebrow', 'Events & Programmes');
  const heroTitle = get('events_hero_title', 'Join Our');
  const heroTitleHighlight = get('events_hero_title_highlight', 'Events');
  const heroDescription = get('events_hero_description', 'Attend our workshops, community forums and awareness events. Together, we can build a more mentally healthy society.');
  const upcomingTitle = get('events_upcoming_title', 'Upcoming Events');
  const pastTitle = get('events_past_title', 'Past Events');
  const pastDescription = get('events_past_description', 'A look back at the events that have shaped our journey and impacted communities.');
  const flyersTitle = get('events_flyers_title', 'See What\u2019s Coming');
  const ctaTitle = get('events_cta_title', 'Don\u2019t Miss Out');
  const ctaDescription = get('events_cta_description', 'Stay updated on our upcoming events, workshops and community programmes. All events are free and open to the public.');

  const useApiEvents = apiEvents.data.length > 0;
  const allEvents = useApiEvents
    ? apiEvents.data.map((e: any) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        description: e.description || '',
        date: e.startAt,
        time: new Date(e.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        dateDisplay: e.startAt
          ? new Date(e.startAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
          : '',
        location: e.venue || e.venueAddress || '',
        address: e.venueAddress || e.venue || '',
        category: 'Event',
        flyer: resolveMediaUrl(e.coverMedia?.url) || '/images/events/SHEDAMFLIER2.jpeg',
        image: resolveMediaUrl(e.coverMedia?.url) || '/images/events/SHEDAMFLIER2.jpeg',
        featured: !!e.isFeatured,
        attendees: 'Open to all',
        highlights: [] as string[],
        past: e.endAt ? new Date(e.endAt) < new Date() : new Date(e.startAt) < new Date(),
      }))
    : upcomingEvents.map((e) => ({ ...e, past: new Date(e.date) < new Date() }));

  const upcomingList = allEvents.filter((e: any) => !e.past);
  const pastListSource = useApiEvents
    ? allEvents
        .filter((e: any) => e.past)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((e: any) => ({
          ...e,
          date: e.dateDisplay || e.date,
          image: e.image || e.flyer,
        }))
    : pastEventsStatic;
  const pastEvents = pastListSource;

  const featured = upcomingList.find((e: any) => e.featured) || upcomingList[0] || allEvents[0];
  const countdown = useCountdown(featured.date);
  const { openModal: openRegistration } = useRegistrationModal();
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(pastEvents, 4);

  const eventStats = [
    { icon: Calendar, value: String(eventsMeta?.total ?? allEvents.length) + (useApiEvents ? '' : '+'), label: get('events_stat1_label', 'Events Held') },
    { icon: Users, value: useApiEvents ? String(allEvents.length) : '2,500+', label: get('events_stat2_label', 'Attendees') },
    { icon: MapPin, value: useApiEvents ? String(new Set(allEvents.map((e: any) => e.location).filter(Boolean)).size) : '8', label: get('events_stat3_label', 'Locations') },
    { icon: Target, value: '100%', label: get('events_stat4_label', 'Free Entry') },
  ];

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] overflow-hidden bg-[#1A2332] lg:min-h-[60vh]">
        <div
          className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${
            heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
        >
          <Image
            src="/images/events/SHEDAMFLIER2.jpeg"
            alt="SHEDAM Events"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2332]/95 via-[#1A2332]/80 to-[#1A2332]/60" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-20">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm transition-all duration-700 delay-300 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {heroEyebrow}
            </div>
            <h1
              className={`mt-6 font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl xl:text-6xl transition-all duration-700 delay-500 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {heroTitle} <span className="text-primary">{heroTitleHighlight}</span>
            </h1>
            <p
              className={`mt-6 max-w-lg text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg transition-all duration-700 delay-700 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {heroDescription}
            </p>
          </div>
        </div>
        <div
          className="absolute top-20 right-10 h-2 w-2 rounded-full bg-primary/40 float-particle"
          style={{ '--duration': '3s', '--delay': '0s' } as React.CSSProperties}
        />
        <div
          className="absolute bottom-32 right-32 h-1.5 w-1.5 rounded-full bg-primary/30 float-particle"
          style={{ '--duration': '4s', '--delay': '1s' } as React.CSSProperties}
        />
      </section>

      {/* ── Torn Edge ── */}
      <div className="relative -mt-1 bg-[#1A2332]">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V20C80 35 160 10 240 25C320 40 400 15 480 30C560 45 640 20 720 35C800 50 880 25 960 40C1040 55 1120 30 1200 45C1280 60 1360 35 1440 50V60H0Z"
            fill="#FAFAF8"
          />
        </svg>
      </div>

      {/* ── Countdown ── */}
      <section className="bg-warm-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="overflow-hidden rounded-2xl bg-[#1A2332] p-6 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-[10px] font-semibold text-primary">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    Next Event
                  </div>
                  <h2 className="mt-4 font-heading text-xl text-white sm:text-2xl lg:text-3xl">
                    {featured.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {featured.dateDisplay}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {featured.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {featured.location}
                    </span>
                  </div>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
                    {featured.description}
                  </p>
                  <Link
                    href={`/events/${featured.slug}`}
                    className="btn-ripple mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20"
                  >
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Countdown blocks */}
                <div className="flex gap-3 sm:gap-4">
                  {[
                    { value: countdown.days, label: 'Days' },
                    { value: countdown.hours, label: 'Hours' },
                    { value: countdown.minutes, label: 'Mins' },
                    { value: countdown.seconds, label: 'Secs' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 font-heading text-2xl text-white sm:h-20 sm:w-20 sm:text-3xl">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <p className="mt-1.5 text-[10px] font-medium text-gray-500 sm:text-xs">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Animate>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-warm-white pb-8 lg:pb-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {eventStats.map((s, i) => {
              const Icon = s.icon;
              return (
                <Animate key={s.label} delay={i * 100}>
                  <div className="group flex items-center gap-3 rounded-xl border border-[#1A2332]/5 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/10 sm:p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110 sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-white sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <p className="font-heading text-lg text-[#1A2332] sm:text-xl lg:text-2xl">
                        {s.value}
                      </p>
                      <p className="text-[10px] text-[#1A2332]/50 sm:text-xs">{s.label}</p>
                    </div>
                  </div>
                </Animate>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="bg-warm-white pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Mark Your Calendar
                </p>
                <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                  {upcomingTitle}
                </h2>
              </div>
              <Link
                href="/events"
                className="hidden items-center gap-1.5 text-xs font-medium text-[#1A2332]/40 transition-colors hover:text-primary sm:inline-flex"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Animate>

          {/* Featured Event */}
          {upcomingList.filter((e) => e.featured).map((event) => {
            const catColor = categoryColors[event.category] || '#88E788';
            return (
              <Animate key={event.id} delay={100}>
                <Link href={`/events/${event.slug}`} className="mt-8 block">
                  <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-xl shadow-primary/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                    <div className="grid lg:grid-cols-[1fr_400px]">
                      {/* Content */}
                      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                            Featured Event
                          </span>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                            style={{ backgroundColor: `${catColor}CC` }}
                          >
                            {event.category}
                          </span>
                        </div>
                        <h3 className="mt-4 font-heading text-xl text-[#1A2332] transition-colors duration-300 group-hover:text-primary sm:text-2xl lg:text-3xl">
                          {event.title}
                        </h3>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#1A2332]/60">
                          {event.description}
                        </p>

                        {/* Details */}
                        <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#1A2332]/50">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {event.dateDisplay}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            {event.attendees} expected
                          </span>
                        </div>

                        {/* Highlights */}
                        {event.highlights?.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {event.highlights.map((h) => (
                              <span
                                key={h}
                                className="rounded-full border border-[#1A2332]/5 bg-[#F8F9FA] px-3 py-1 text-[10px] text-[#1A2332]/50 transition-all duration-300 group-hover:border-primary/20 group-hover:text-primary"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Countdown */}
                        <div className="mt-6 flex items-center gap-4">
                          <EventCountdownBlocks date={event.date} />
                          <span className="text-xs text-[#1A2332]/30">until event starts</span>
                        </div>

                        <div className="mt-6">
                          <span className="inline-flex items-center gap-2 rounded-full bg-[#1A2332] px-6 py-3 text-sm font-medium text-white transition-all duration-300 group-hover:bg-primary group-hover:text-[#1A2332] group-hover:shadow-lg group-hover:shadow-primary/20">
                            View Details & Register <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>

                      {/* Flyer */}
                      <div className="relative h-64 overflow-hidden lg:h-auto">
                        <Image
                          src={event.flyer}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2332]/20 via-transparent to-transparent lg:bg-gradient-to-l" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Animate>
            );
          })}

          {/* Other Events Grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingList.filter((e) => !e.featured).map((event, i) => {
              const catColor = categoryColors[event.category] || '#88E788';
              return (
                <Animate key={event.id} delay={200 + i * 80}>
                  <Link href={`/events/${event.slug}`} className="block h-full">
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                      {/* Image */}
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={event.flyer}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/70 via-[#1A2332]/10 to-transparent" />

                        {/* Category */}
                        <div className="absolute top-3 left-3">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm"
                            style={{ backgroundColor: `${catColor}CC` }}
                          >
                            {event.category}
                          </span>
                        </div>

                        {/* Date block */}
                        <div className="absolute bottom-3 left-3 flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-white/95 text-[#1A2332] shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                          <span className="text-[7px] font-bold uppercase leading-none text-primary">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="font-heading text-base leading-tight">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>

                        {/* Countdown pill */}
                        <div className="absolute top-3 right-3">
                          <CountdownPill date={event.date} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h3 className="font-heading text-base text-[#1A2332] transition-colors duration-300 group-hover:text-primary">
                          {event.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[#1A2332]/40">
                          <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {event.location.split(',')[0]}
                          </span>
                        </div>
                        <p className="mt-2 flex-1 text-xs leading-relaxed text-[#1A2332]/50 line-clamp-2">
                          {event.description}
                        </p>

                        {/* Bottom */}
                        <div className="mt-4 flex items-center justify-between border-t border-[#1A2332]/5 pt-3">
                          <div className="flex items-center gap-1 text-[10px] text-[#1A2332]/30">
                            <Users className="h-2.5 w-2.5" />
                            {event.attendees}
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2">
                            View Details <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Animate>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Flyer Gallery ── */}
      <section className="overflow-hidden bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Event Flyers
              </p>
              <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                {flyersTitle}
              </h2>
            </div>
          </Animate>
        </div>

        {upcomingList.length > 0 && (
          <div className="scrollbar-hide mt-10 overflow-x-auto pb-2">
            <div className="flex w-max gap-4 px-5 sm:px-8 lg:px-20">
              {upcomingList.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group relative block w-[220px] shrink-0 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:w-[260px] lg:w-[300px]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={event.flyer}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/95 via-[#1A2332]/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary">
                        <Calendar className="h-3 w-3" />
                        {event.dateDisplay}
                      </div>
                      <h3 className="mt-1.5 font-heading text-sm text-white transition-colors duration-300 group-hover:text-primary sm:text-base">
                        {event.title}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2">
                        View Details <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Past Events ── */}
      <section className="bg-[#1A2332] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Our Track Record
              </p>
              <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl lg:text-3xl">
                {pastTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-gray-400">
                {pastDescription}
              </p>
            </div>
          </Animate>

          {pastEvents.length === 0 ? (
            <p className="mt-10 text-center text-sm text-gray-400">
              No past events yet. Check back after our next programme.
            </p>
          ) : (
            <>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {paginatedItems.map((event: any, i: number) => {
                  const card = (
                    <div className="group relative h-full overflow-hidden rounded-2xl transition-transform duration-500 group-hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/90 via-[#1A2332]/30 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-primary">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </div>
                        <h3 className="mt-1.5 font-heading text-sm text-white transition-colors duration-300 group-hover:text-primary sm:text-base">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-[10px] text-gray-400">{event.location}</p>
                        {event.slug ? (
                          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-primary transition-all duration-300 group-hover:gap-2">
                            View Event Details <ArrowRight className="h-3 w-3" />
                          </span>
                        ) : (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400">
                            <Users className="h-3 w-3" />
                            {event.attendees} attended
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  return (
                    <Animate key={event.id} delay={i * 80}>
                      {event.slug ? (
                        <Link href={`/events/${event.slug}`} className="block h-full">
                          {card}
                        </Link>
                      ) : (
                        card
                      )}
                    </Animate>
                  );
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                className="mt-10 [&_button]:bg-white/10 [&_button]:text-white/60 [&_button]:border-white/20 [&_button:hover]:bg-white/20 [&_button:hover]:text-white [&_button]:disabled:opacity-20"
              />
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties}
          />
          <div
            className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <Animate>
            <h2 className="font-heading text-xl text-white sm:text-2xl lg:text-3xl">
              {ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 sm:text-base">
              {ctaDescription}
            </p>
          </Animate>
          <Animate delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-[#1A2332] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#1A2332] hover:shadow-xl hover:-translate-y-0.5"
              >
                <Heart className="h-4 w-4" />
                Get Involved
              </Link>
              <Link
                href="/what-we-do"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5"
              >
                Explore Our Work
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
