'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useFeaturedEvent, useSettingsMap } from '@/hooks/use-api';

const fallbackEvent = {
  title: 'Mental Health Awareness Community Forum',
  startAt: '2026-12-15T10:00:00',
  location: 'Christ the King Catholic Church, Kubwa, Abuja',
  slug: '',
};

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

export function EventBanner() {
  const { data: featured } = useFeaturedEvent();
  const { get } = useSettingsMap();

  const eyebrow = get('event_banner_eyebrow', 'Upcoming Event');
  const cta = get('event_banner_cta', 'Register Now');

  const event = useMemo(
    () =>
      featured
        ? {
            title: featured.title,
            startAt: featured.startAt,
            location: featured.venue || featured.venueAddress || '',
            slug: featured.slug || '',
          }
        : fallbackEvent,
    [featured]
  );

  const eventDate = useMemo(() => new Date(event.startAt), [event.startAt]);
  const countdown = useCountdown(eventDate);

  const dateLabel = useMemo(
    () =>
      eventDate.toLocaleDateString('en', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) +
      ' · ' +
      eventDate.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }),
    [eventDate]
  );

  return (
    <section className="relative z-20 -mt-1 bg-surface-alt border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          {/* Left: Event Info */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
              <h3 className="font-heading text-sm font-bold text-dark">{event.title}</h3>
              <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{dateLabel}</span>
                {event.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Countdown */}
          <div className="flex items-center gap-3">
            {[
              { value: countdown.days, label: 'Days' },
              { value: countdown.hours, label: 'Hrs' },
              { value: countdown.minutes, label: 'Min' },
              { value: countdown.seconds, label: 'Sec' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark text-sm font-bold text-white tabular-nums">
                  {String(item.value).padStart(2, '0')}
                </div>
                <p className="mt-0.5 text-[9px] text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Right: CTA */}
          <Link
            href={event.slug ? `/events/${event.slug}` : '/events'}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:bg-primary-hover hover:shadow-md hover:-translate-y-0.5"
          >
            {cta} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
