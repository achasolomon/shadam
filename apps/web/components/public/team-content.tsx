'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, Heart, Sparkles, Users } from 'lucide-react';
import { useTeam, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
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

type MemberCard = {
  id: string;
  slug?: string | null;
  name: string;
  role: string;
  headline?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
};

function memberHref(m: MemberCard) {
  return m.slug ? `/team/${m.slug}` : '#';
}

function MemberCardView({ member, dark = false }: { member: MemberCard; dark?: boolean }) {
  const photo = resolveMediaUrl(member.photoUrl) || '/images/banner/banner3.jpeg';
  const href = memberHref(member);
  const inner = (
    <>
      <div className="relative aspect-[3/2] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A2332]/60 opacity-0 transition-all duration-500 group-hover:opacity-100 backdrop-blur-sm">
          <span className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-[#1A2332]">
            View profile
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className={`font-heading text-base ${dark ? 'text-white' : 'text-[#1A2332]'}`}>
          {member.name}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">{member.role}</p>
        {member.headline && (
          <p className={`mt-1 text-xs ${dark ? 'text-gray-400' : 'text-[#1A2332]/50'}`}>{member.headline}</p>
        )}
        {member.bio && (
          <p className={`mt-3 line-clamp-3 text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-[#1A2332]/60'}`}>
            {member.bio}
          </p>
        )}
      </div>
    </>
  );

  const cardClass =
    'group relative block overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ' +
    (dark
      ? 'border-white/5 bg-white/[0.03] hover:border-primary/20 hover:bg-white/[0.06] hover:shadow-primary/5'
      : 'border-[#1A2332]/5 bg-white hover:border-primary/20 hover:shadow-primary/5');

  if (member.slug) {
    return (
      <Link href={href} className={cardClass}>
        {inner}
      </Link>
    );
  }
  return <div className={cardClass}>{inner}</div>;
}

export function TeamContent() {
  const { data: apiTeam, source } = useTeam();
  const { get } = useSettingsMap();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  const eyebrow = get('team_page_eyebrow', 'Our People');
  const title = get('team_page_title', 'The');
  const titleHighlight = get('team_page_title_highlight', 'Team');
  const description = get(
    'team_page_description',
    'Meet the founders, professionals, and volunteers who drive SHEDAM’s work in mental health awareness, education, referral, and community support.'
  );
  const cta = get('team_page_cta', 'Partner With Us');

  const members: MemberCard[] = source === 'api' && Array.isArray(apiTeam) ? apiTeam : [];
  const founders = members.filter((m) => /founder/i.test(m.role || ''));
  const others = members.filter((m) => !/founder/i.test(m.role || ''));

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#1A2332] pt-24 pb-16 lg:pt-28 lg:pb-20">
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
            <span className="text-white/80">Team</span>
          </div>
          <div
            className={`mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-all duration-700 delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <div className="mt-5 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1
                className={`font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl transition-all duration-700 delay-500 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {title} <span className="text-primary">{titleHighlight}</span>
              </h1>
              <p
                className={`mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base transition-all duration-700 delay-700 ${
                  heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {description}
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20"
            >
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
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

      {/* ── Founders ── */}
      {founders.length > 0 && (
        <section className="bg-[#FAFAF8] pt-12 lg:pt-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
            <Animate>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our Founders</p>
                <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                  The Vision Behind SHEDAM
                </h2>
              </div>
            </Animate>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:max-w-3xl lg:mx-auto">
              {founders.map((m, i) => (
                <Animate key={m.id} delay={i * 100}>
                  <MemberCardView member={m} />
                </Animate>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Full team ── */}
      <section className="bg-[#FAFAF8] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our Team</p>
                <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                  {others.length > 0 ? 'The People Behind the Work' : 'Meet the Team'}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[#1A2332]/55">
                  Open any profile for full biography, seminars, talks, and contributions to mental health.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-[#1A2332]">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-heading text-lg text-primary">{members.length}</span> members
              </div>
            </div>
          </Animate>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(others.length > 0 ? others : members).map((m, i) => (
              <Animate key={m.id} delay={i * 80}>
                <MemberCardView member={m} />
              </Animate>
            ))}
          </div>

          {members.length === 0 && source === 'static' && (
            <p className="mt-10 text-center text-sm text-gray-500">Team profiles are loading…</p>
          )}

          <Animate>
            <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#1A2332]/5 bg-white px-6 py-5 sm:flex-row sm:px-8">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A2332]">Want to work with our team?</p>
                  <p className="text-xs text-[#1A2332]/40">Volunteer, partner, or refer someone who needs support.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/get-involved"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:bg-[#6BCF6B]"
                >
                  Get Involved
                </Link>
                <Link
                  href="/about#team"
                  className="rounded-full border border-[#1A2332]/10 px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:border-primary/40 hover:text-primary"
                >
                  About SHEDAM
                </Link>
              </div>
            </div>
          </Animate>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties}
          />
          <div
            className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <Animate>
            <h2 className="font-heading text-xl text-white sm:text-2xl lg:text-3xl">Join Our Mission</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 sm:text-base">
              Whether you volunteer, partner, or spread the word — you can help make mental health support accessible for all.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/get-involved"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-primary transition-all duration-300 hover:bg-[#1A2332] hover:text-white hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Involved <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50"
              >
                Contact Us
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
