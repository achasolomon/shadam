'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { resolveMediaUrl } from '@/lib/api';

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

const KIND_LABELS: Record<string, string> = {
  SEMINAR: 'Seminar',
  TALK: 'Talk',
  CONTRIBUTION: 'Contribution',
  PUBLICATION: 'Publication',
  AWARD: 'Award',
};

function formatItemDate(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
}

function ItemRow({ item }: { item: any }) {
  const kind = item.kind || 'CONTRIBUTION';
  const isAward = kind === 'AWARD';
  return (
    <article className="group rounded-2xl border border-[#1A2332]/5 bg-white p-5 transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-500 group-hover:bg-primary">
          {isAward ? (
            <Trophy className="h-4 w-4 text-primary transition-colors duration-500 group-hover:text-white" />
          ) : (
            <Calendar className="h-4 w-4 text-primary transition-colors duration-500 group-hover:text-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {KIND_LABELS[kind] || kind}
          </span>
          <h4 className="mt-2 font-heading text-base text-[#1A2332]">{item.title}</h4>
          <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-[#1A2332]/45">
            {item.date && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {formatItemDate(item.date)}
              </span>
            )}
            {item.venue && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {item.venue}
              </span>
            )}
          </div>
          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-[#1A2332]/65">{item.description}</p>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Learn more <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function TeamDetailContent({
  member,
  related = [],
}: {
  member: any;
  related?: any[];
}) {
  const [heroLoaded, setHeroLoaded] = useState(true);
  const photo = resolveMediaUrl(member.photoUrl) || '/images/banner/banner3.jpeg';
  const items: any[] = member.items || [];
  const seminars = items.filter((i) => ['SEMINAR', 'TALK'].includes(i.kind));
  const contributions = items.filter((i) =>
    ['CONTRIBUTION', 'PUBLICATION', 'AWARD'].includes(i.kind),
  );
  const gallery = items.filter((i) => i.kind === 'MEDIA' && i.url);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const qualifications: string[] = Array.isArray(member.qualifications)
    ? member.qualifications
    : typeof member.qualifications === 'string' && member.qualifications
      ? [member.qualifications]
      : [];
  const social: Record<string, string> =
    member.socialLinks && typeof member.socialLinks === 'object' ? member.socialLinks : {};
  const bioParagraphs = (member.bio || '')
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#1A2332] pt-24 pb-20 lg:pt-28 lg:pb-24">
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 float-particle"
            style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties}
          />
          <div
            className="absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-primary/20 float-particle"
            style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/team" className="hover:text-primary transition-colors">
              Team
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80">{member.name}</span>
          </div>

          <div
            className={`mt-8 flex flex-col gap-8 sm:flex-row sm:items-end transition-all duration-700 delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-48 sm:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={member.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {member.role}
              </span>
              <h1 className="mt-4 font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
                {member.name}
              </h1>
              {member.headline && (
                <p className="mt-3 max-w-2xl text-sm text-gray-300 sm:text-base">{member.headline}</p>
              )}
            </div>
          </div>
        </div>
      </section>

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

      {/* ── Body ── */}
      <section className="bg-[#FAFAF8] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Link href="/team" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> All Team Members
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              <Animate>
                <div className="rounded-2xl border border-[#1A2332]/5 bg-white p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">About</p>
                  <h2 className="mt-2 font-heading text-xl text-[#1A2332] sm:text-2xl">
                    About {member.name}
                  </h2>
                  <div className="mt-5 space-y-4">
                    {bioParagraphs.length > 0 ? (
                      bioParagraphs.map((p: string, i: number) => (
                        <p key={i} className="text-[15px] leading-relaxed text-[#1A2332]/75">
                          {p}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        Full biography coming soon. Check back for more about {member.name}.
                      </p>
                    )}
                  </div>
                </div>
              </Animate>

              <Animate>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Seminars & Talks
                  </p>
                  <h2 className="mt-2 font-heading text-xl text-[#1A2332] sm:text-2xl">
                    Speaking & Facilitation
                  </h2>
                  {seminars.length > 0 ? (
                    <div className="mt-5 space-y-4">
                      {seminars.map((item) => (
                        <ItemRow key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      Seminars and talks will appear here when published.
                    </p>
                  )}
                </div>
              </Animate>

              <Animate>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Contributions
                  </p>
                  <h2 className="mt-2 font-heading text-xl text-[#1A2332] sm:text-2xl">
                    Contributions to Mental Health
                  </h2>
                  {contributions.length > 0 ? (
                    <div className="mt-5 space-y-4">
                      {contributions.map((item) => (
                        <ItemRow key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      Contributions and publications will appear here when published.
                    </p>
                  )}
                </div>
              </Animate>

              {qualifications.length > 0 && (
                <Animate>
                  <div className="rounded-2xl border border-[#1A2332]/5 bg-white p-6 sm:p-8">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                          Qualifications
                        </p>
                        <h2 className="font-heading text-lg text-[#1A2332]">Expertise & Credentials</h2>
                      </div>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {qualifications.map((q) => (
                        <li
                          key={q}
                          className="rounded-full border border-[#1A2332]/10 bg-[#FAFAF8] px-3 py-1.5 text-xs font-medium text-[#1A2332]/70"
                        >
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Animate>
              )}

              <Animate>
                <div>
                  <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <ImageIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                          Event Media
                        </p>
                      <h2 className="mt-1 font-heading text-xl text-[#1A2332] sm:text-2xl">
                        Photos from Events
                      </h2>
                    </div>
                  </div>
                  {gallery.length > 0 ? (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {gallery.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLightbox(idx)}
                          className="group relative overflow-hidden rounded-xl border border-[#1A2332]/5 bg-[#FAFAF8] text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <div className="relative aspect-[3/2]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={resolveMediaUrl(item.url)}
                              alt={item.title || `${member.name} at event`}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                          {(item.title || item.description || item.date) && (
                            <div className="p-3">
                              {item.title && (
                                <p className="truncate text-xs font-medium text-[#1A2332]">
                                  {item.title}
                                </p>
                              )}
                              <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-[#1A2332]/50">
                                {item.description && <span>{item.description}</span>}
                                {item.date && (
                                  <span className="inline-flex items-center gap-0.5">
                                    <Calendar className="h-2.5 w-2.5" />
                                    {formatItemDate(item.date)}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      Event photos and media will appear here when published.
                    </p>
                  )}
                </div>
              </Animate>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="sticky-card rounded-2xl border border-[#1A2332]/5 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Profile</p>
                <h3 className="mt-2 font-heading text-lg text-[#1A2332]">{member.name}</h3>
                <p className="mt-1 text-sm text-[#1A2332]/55">{member.role}</p>
                {member.headline && (
                  <p className="mt-2 text-sm text-[#1A2332]/50">{member.headline}</p>
                )}

                <div className="mt-5 space-y-3 text-sm text-[#1A2332]/65">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-primary">
                      <Mail className="h-4 w-4 text-primary" /> {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="flex items-center gap-2 hover:text-primary">
                      <Phone className="h-4 w-4 text-primary" /> {member.phone}
                    </a>
                  )}
                  {Object.entries(social).map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4 text-primary" /> {label}
                    </a>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href="/team"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:bg-[#6BCF6B]"
                  >
                    Back to Team <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1A2332]/10 px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Contact SHEDAM
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <Animate>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">More of our team</p>
                <h2 className="mt-2 font-heading text-xl text-[#1A2332] sm:text-2xl">Meet More Members</h2>
              </Animate>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((m, i) => (
                  <Animate key={m.id} delay={i * 80}>
                    <Link
                      href={m.slug ? `/team/${m.slug}` : '/team'}
                      className="group block overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveMediaUrl(m.photoUrl) || '/images/banner/banner3.jpeg'}
                          alt={m.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332] via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading text-sm text-[#1A2332]">{m.name}</h3>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                          {m.role}
                        </p>
                      </div>
                    </Link>
                  </Animate>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <Animate>
            <h2 className="font-heading text-xl text-white sm:text-2xl">Work With Our Team</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
              Partner with SHEDAM or get connected to professional mental health support.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/get-involved"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-[#1A2332] hover:text-white"
              >
                Get Involved <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/get-help"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Get Help
              </Link>
            </div>
          </Animate>
        </div>
      </section>

      {lightbox !== null && gallery[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2332]/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length));
            }}
            className="absolute left-3 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white sm:left-6"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i + 1) % gallery.length));
            }}
            className="absolute right-3 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white sm:right-6"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <div className="max-h-full w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveMediaUrl(gallery[lightbox].url)}
              alt={gallery[lightbox].title || `${member.name} at event`}
              className="mx-auto max-h-[75vh] w-auto rounded-xl object-contain"
            />
            <div className="mt-4 text-center text-sm text-white/90">
              <p className="font-medium">{gallery[lightbox].title}</p>
              <div className="mt-1 flex flex-wrap justify-center gap-3 text-xs text-white/60">
                {gallery[lightbox].description && <span>{gallery[lightbox].description}</span>}
                {gallery[lightbox].date && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatItemDate(gallery[lightbox].date)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
