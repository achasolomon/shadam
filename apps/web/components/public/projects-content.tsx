'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Calendar,
  Heart,
  Users,
  Target,
  TrendingUp,
  Sparkles,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useDonationModal } from '@/components/public/donation-modal';
import { useProjects, useSettingsMap } from '@/hooks/use-api';
import { projects as staticProjects } from '@/lib/projects-data';
import { resolveMediaUrl } from '@/lib/api';

const categoriesFallback = ['All', 'Community', 'Education', 'Healthcare', 'Corporate'];

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Ongoing: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  Active: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  Pilot: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
};

const statsFallback = [
  { key: 'projects_stat_lives', icon: Users, value: '3,200+', label: 'Lives Impacted' },
  { key: 'projects_stat_active', icon: Target, value: '6', label: 'Active Projects' },
  { key: 'projects_stat_communities', icon: MapPin, value: '12', label: 'Communities Served' },
  { key: 'projects_stat_funds', icon: TrendingUp, value: '₦10M+', label: 'Funds Raised' },
];

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold });
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

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function ProjectsContent() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { openModal } = useDonationModal();
  const { get, getJSON } = useSettingsMap();

  const heroEyebrow = get('projects_hero_eyebrow', 'Our Projects');
  const heroTitle = get('projects_hero_title', 'Creating');
  const heroTitleHighlight = get('projects_hero_title_highlight', 'Real Change');
  const heroDescription = get('projects_hero_description', 'Through targeted programmes and community engagement, we provide support, education and hope for a healthier tomorrow.');
  const ctaTitle = get('projects_cta_title', 'Want to Support Our Projects?');
  const ctaDescription = get('projects_cta_description', 'Your contribution helps us reach more communities and create lasting impact. Every donation makes a difference.');
  const categories = getJSON<string[]>('projects_categories', categoriesFallback);
  const stats = statsFallback.map((s) => {
    const raw = get(s.key, '');
    return raw ? { ...s, value: raw } : s;
  });

  // Try API first, fall back to static data
  const { data: apiProjects, loading } = useProjects({ limit: 20 });

  // Map API projects to local format, fallback to static
  const allProjects = apiProjects.data.length > 0
    ? apiProjects.data.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category || 'Community',
        description: p.summary || '',
        status: p.endDate ? 'Completed' : 'Ongoing',
        location: '',
        raised: 0,
        goal: 0,
        image: resolveMediaUrl(p.coverMedia?.url) || '/images/projects/awareness.jpg',
        beneficiaries: '',
        startDate: p.startDate ? new Date(p.startDate).getFullYear().toString() : '',
        highlights: [],
      }))
    : staticProjects;

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  const filtered =
    activeCategory === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory);

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
            src="/images/projects/community-outreach.jpg"
            alt="SHEDAM Projects"
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

      {/* ── Stats Bar ── */}
      <section className="bg-warm-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => {
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

      {/* ── Filter + Projects Grid ── */}
      <section className="bg-warm-white pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          {/* Filter */}
          <Animate>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-[#1A2332]/40" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-[#1A2332] text-white shadow-lg shadow-[#1A2332]/20'
                      : 'bg-[#1A2332]/5 text-[#1A2332]/60 hover:bg-[#1A2332]/10 hover:text-[#1A2332]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Animate>

          {/* Grid */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => {
              const pct = Math.round((p.raised / p.goal) * 100);
              const status = statusColors[p.status] || statusColors.Ongoing;
              return (
                <Animate key={p.id} delay={i * 80}>
                  <div
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/80 via-[#1A2332]/20 to-transparent" />

                      {/* Status badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold backdrop-blur-sm ${status.bg} ${status.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {p.status}
                        </span>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-4 right-4">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                          {p.category}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[10px] text-white/80">
                        <Calendar className="h-3 w-3" />
                        Since {p.startDate}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-heading text-lg text-[#1A2332] transition-colors duration-300 group-hover:text-primary">
                        {p.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#1A2332]/60">
                        {p.description}
                      </p>

                      {/* Location */}
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#1A2332]/40">
                        <MapPin className="h-3 w-3" />
                        {p.location}
                      </div>

                      {/* Highlights */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.highlights.slice(0, 3).map((h) => (
                          <span
                            key={h}
                            className="rounded-full bg-[#1A2332]/5 px-2.5 py-0.5 text-[10px] text-[#1A2332]/50"
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between text-[10px] text-[#1A2332]/50">
                          <span>Raised: ₦{(p.raised / 1000000).toFixed(1)}M</span>
                          <span>Goal: ₦{(p.goal / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1A2332]/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-1000 ease-out"
                            style={{ width: hoveredId === p.id ? `${pct}%` : '0%' }}
                          />
                        </div>
                        <p className="mt-1 text-right text-[10px] font-medium text-primary">
                          {pct}% funded
                        </p>
                      </div>

                      {/* Beneficiaries */}
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#1A2332]/50">
                        <Users className="h-3 w-3" />
                        {p.beneficiaries} beneficiaries
                      </div>

                      {/* CTA */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => openModal({
                            type: 'project',
                            projectName: p.title,
                            projectSlug: p.slug,
                            projectImage: p.image,
                            raised: p.raised,
                            goal: p.goal,
                          })}
                          className="btn-ripple inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20"
                        >
                          <Heart className="h-3 w-3" />
                          Donate
                        </button>
                        <Link
                          href={`/projects/${p.slug}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#1A2332]/10 px-4 py-2.5 text-xs font-medium text-[#1A2332]/60 transition-all duration-300 hover:border-primary/30 hover:text-primary"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </Animate>
              );
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-[#1A2332]/40">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-[#1A2332] py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 float-particle"
            style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties}
          />
          <div
            className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-primary/20 float-particle"
            style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <Animate>
            <h2 className="font-heading text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl">
              {ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-gray-300 sm:text-base">
              {ctaDescription}
            </p>
          </Animate>
          <Animate delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/get-involved"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                Get Involved <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5"
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
