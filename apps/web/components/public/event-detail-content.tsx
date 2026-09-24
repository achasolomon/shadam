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
  Heart,
  Share2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import type { EventData } from '@/lib/events-data';
import { useRegistrationModal } from '@/components/public/registration-modal';

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

const categoryColors: Record<string, string> = {
  Community: '#88E788',
  Education: '#3B82F6',
  Corporate: '#F59E0B',
  Healthcare: '#EF4444',
};

export function EventDetailContent({
  event,
  relatedEvents,
}: {
  event: EventData;
  relatedEvents: EventData[];
}) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const countdown = useCountdown(event.date);
  const eventEnd = event.endAt || event.date;
  const isUpcoming = new Date(eventEnd) > new Date();
  const { openModal: openRegistration } = useRegistrationModal();

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  const catColor = categoryColors[event.category] || '#88E788';

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] overflow-hidden bg-[#1A2332] lg:min-h-[65vh]">
        <div
          className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${
            heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
        >
          <Image src={event.flyer} alt={event.title} fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332] via-[#1A2332]/60 to-[#1A2332]/30" />

        {/* Breadcrumb */}
        <div className="relative mx-auto max-w-7xl px-5 pt-24 sm:px-8 lg:px-20">
          <nav
            className={`flex items-center gap-2 text-xs text-gray-400 transition-all duration-700 delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/events" className="hover:text-primary transition-colors">
              Events
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{event.title}</span>
          </nav>
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-12 pt-8 sm:px-8 lg:px-20 lg:pb-16">
          <div className="max-w-3xl">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm transition-all duration-700 delay-400 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ backgroundColor: `${catColor}CC` }}
            >
              {event.category}
              {event.featured && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white" />
                  Featured
                </>
              )}
            </div>
            <h1
              className={`mt-4 font-heading text-2xl font-normal text-white sm:text-3xl lg:text-4xl xl:text-5xl transition-all duration-700 delay-500 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {event.title}
            </h1>
            <div
              className={`mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-300 transition-all duration-700 delay-700 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                {event.dateDisplay}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {event.location}
              </span>
            </div>
          </div>
        </div>
        <div
          className="absolute top-20 right-10 h-2 w-2 rounded-full bg-primary/40 float-particle"
          style={{ '--duration': '3s', '--delay': '0s' } as React.CSSProperties}
        />
      </section>

      {/* ── Content ── */}
      <section className="bg-warm-white py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
            {/* Main content */}
            <div>
              {/* About */}
              <Animate>
                <div>
                  <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">About This Event</h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#1A2332]/60 sm:text-base">
                    {event.fullDescription}
                  </p>
                </div>
              </Animate>

              {/* Highlights */}
              <Animate delay={100}>
                <div className="mt-10">
                  <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">What to Expect</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {event.highlights.map((h, i) => (
                      <div
                        key={h}
                        className="flex items-start gap-3 rounded-xl border border-[#1A2332]/5 bg-white p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-[#1A2332]/70">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Agenda */}
              <Animate delay={200}>
                <div className="mt-10">
                  <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">Event Agenda</h2>
                  <div className="mt-5 space-y-0">
                    {event.agenda.map((item, i) => (
                      <div
                        key={i}
                        className="group flex gap-4 border-l-2 border-[#1A2332]/10 py-4 pl-5 transition-all duration-300 hover:border-primary hover:bg-primary/5 -ml-px"
                      >
                        <div className="shrink-0 pt-0.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-[#1A2332]/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-125" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-primary">{item.time}</p>
                          <p className="mt-1 text-sm text-[#1A2332]/70">{item.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <Animate delay={300}>
                  <div className="mt-10">
                    <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">Speakers</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {event.speakers.map((speaker) => (
                        <div
                          key={speaker.name}
                          className="group flex items-center gap-4 rounded-2xl border border-[#1A2332]/5 bg-white p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                            <Image
                              src={speaker.image}
                              alt={speaker.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <p className="font-heading text-sm text-[#1A2332]">{speaker.name}</p>
                            <p className="mt-0.5 text-xs text-[#1A2332]/50">{speaker.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Animate>
              )}

              {/* Gallery */}
              {event.gallery.length > 0 && (
                <Animate delay={400}>
                  <div className="mt-10">
                    <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">Gallery</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {event.gallery.map((img, i) => (
                        <div
                          key={i}
                          className="group relative aspect-[4/3] overflow-hidden rounded-xl"
                        >
                          <Image
                            src={img}
                            alt={`${event.title} gallery ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-[#1A2332]/0 transition-all duration-300 group-hover:bg-[#1A2332]/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Animate>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {/* Registration Card */}
              <Animate delay={100}>
                <div className="rounded-2xl border border-[#1A2332]/5 bg-white p-6 shadow-sm">
                  <h3 className="font-heading text-lg text-[#1A2332]">Event Details</h3>

                  <div className="mt-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2332]/40">
                          Date
                        </p>
                        <p className="mt-0.5 text-sm text-[#1A2332]">{event.dateDisplay}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2332]/40">
                          Time
                        </p>
                        <p className="mt-0.5 text-sm text-[#1A2332]">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2332]/40">
                          Location
                        </p>
                        <p className="mt-0.5 text-sm text-[#1A2332]">{event.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2332]/40">
                          Expected Attendees
                        </p>
                        <p className="mt-0.5 text-sm text-[#1A2332]">{event.attendees}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#1A2332]/5 pt-5">
                    {isUpcoming ? (
                      <button
                        onClick={() => openRegistration({
                          type: 'event',
                          eventTitle: event.title,
                          eventSlug: event.slug,
                          eventId: event.apiId,
                          eventImage: event.flyer,
                          eventDate: event.dateDisplay,
                          eventTime: event.time,
                          eventLocation: event.location,
                          category: event.category,
                        })}
                        className="btn-ripple flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A2332] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-primary hover:text-[#1A2332] hover:shadow-lg hover:shadow-primary/20"
                      >
                        <Heart className="h-4 w-4" />
                        Register Now
                      </button>
                    ) : (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A2332]/10 bg-[#F8F9FA] px-6 py-3.5 text-sm font-medium text-[#1A2332]/50">
                        Registration Closed — Event Has Ended
                      </div>
                    )}
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A2332]/10 px-6 py-3 text-sm font-medium text-[#1A2332]/60 transition-all duration-300 hover:border-primary/30 hover:text-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View on Map
                    </a>
                  </div>

                  {/* Share */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.share) {
                          navigator.share({ title: event.title, url: window.location.href });
                        }
                      }}
                      className="flex items-center gap-1.5 text-xs text-[#1A2332]/40 transition-colors hover:text-primary"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share Event
                    </button>
                  </div>
                </div>
              </Animate>

              {/* Countdown */}
              {isUpcoming && (
                <Animate delay={200}>
                  <div className="mt-5 rounded-2xl bg-[#1A2332] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Countdown
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {[
                        { value: countdown.days, label: 'Days' },
                        { value: countdown.hours, label: 'Hours' },
                        { value: countdown.minutes, label: 'Mins' },
                        { value: countdown.seconds, label: 'Secs' },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div className="flex h-12 items-center justify-center rounded-lg bg-white/10 font-heading text-lg text-white">
                            {String(item.value).padStart(2, '0')}
                          </div>
                          <p className="mt-1 text-[9px] text-gray-500">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Animate>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Events ── */}
      {relatedEvents.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
            <Animate>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Don&apos;t Miss Out
                </p>
                <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                  Other Events
                </h2>
              </div>
            </Animate>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map((re, i) => {
                const reColor = categoryColors[re.category] || '#88E788';
                return (
                  <Animate key={re.id} delay={i * 80}>
                    <Link
                      href={`/events/${re.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-[#F8F9FA] transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={re.flyer}
                          alt={re.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/60 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                            style={{ backgroundColor: `${reColor}CC` }}
                          >
                            {re.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-white/90 text-[#1A2332] shadow-sm">
                          <span className="text-[7px] font-bold uppercase leading-none">
                            {new Date(re.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="font-heading text-sm leading-tight">
                            {new Date(re.date).getDate()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-heading text-sm text-[#1A2332] transition-colors duration-300 group-hover:text-primary">
                          {re.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-[#1A2332]/40">
                          <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {re.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {re.location.split(',')[0]}
                          </span>
                        </div>
                        <span className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2">
                          View Details <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  </Animate>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
              {isUpcoming ? 'Ready to Join?' : 'Explore More Events'}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 sm:text-base">
              {isUpcoming
                ? 'Register now and be part of the movement to improve mental health in our communities.'
                : 'Browse our upcoming workshops, community forums and awareness events.'}
            </p>
          </Animate>
          <Animate delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {isUpcoming && (
                <button
                  onClick={() => openRegistration({
                    type: 'event',
                    eventTitle: event.title,
                    eventSlug: event.slug,
                    eventId: event.apiId,
                    eventImage: event.flyer,
                    eventDate: event.dateDisplay,
                    eventTime: event.time,
                    eventLocation: event.location,
                    category: event.category,
                  })}
                  className="btn-ripple inline-flex items-center gap-2 rounded-full bg-[#1A2332] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#1A2332] hover:shadow-xl hover:-translate-y-0.5"
                >
                  Register Now <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5"
              >
                View All Events
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
