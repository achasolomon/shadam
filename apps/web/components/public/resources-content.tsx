'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  ChevronRight,
  Download,
  FileText,
  Sparkles,
  Video,
} from 'lucide-react';
import { useResources, useSettingsMap } from '@/hooks/use-api';
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

function categoryIcon(category?: string) {
  const c = (category || '').toLowerCase();
  if (c.includes('checklist')) return CheckSquare;
  if (c.includes('video')) return Video;
  if (c.includes('guide') || c.includes('article')) return BookOpen;
  return FileText;
}

export function ResourcesContent() {
  const { data: apiResources, source } = useResources({ limit: 100 });
  const { get } = useSettingsMap();
  const [activeCategory, setActiveCategory] = useState('All');
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  const eyebrow = get('resources_page_eyebrow', 'Free Downloads');
  const title = get('resources_page_title', 'Mental Health');
  const titleHighlight = get('resources_page_title_highlight', 'Resources');
  const description = get(
    'resources_page_description',
    'Guides, checklists and practical tools to support your mental wellbeing — free to read and download.'
  );

  const resources =
    source === 'api' && Array.isArray(apiResources) && apiResources.length > 0 ? apiResources : [];

  const categories = ['All', ...Array.from(new Set(resources.map((r: any) => r.category).filter(Boolean)))];

  const filtered =
    activeCategory === 'All'
      ? resources
      : resources.filter((r: any) => r.category === activeCategory);

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
            <span className="text-white/80">Resources</span>
          </div>
          <div
            className={`mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-all duration-700 delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h1
            className={`mt-5 max-w-2xl font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl transition-all duration-700 delay-500 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {title} <span className="text-primary">{titleHighlight}</span>
          </h1>
          <p
            className={`mt-4 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base transition-all duration-700 delay-700 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {description}
          </p>
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

      {/* ── Filters + Grid ── */}
      <section className="bg-[#FAFAF8] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
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

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-[#1A2332]/5 bg-white p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                {source === 'api'
                  ? 'No resources published yet — check back soon.'
                  : 'Loading resources…'}
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((res: any, i: number) => {
                const isArticle = res.resourceType === 'ARTICLE';
                const href = isArticle ? `/resources/${res.id}` : res.fileUrl || res.url || '#';
                const Icon = categoryIcon(res.category);
                const cardClass =
                  'group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-white transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5';
                const cover = res.coverImage ? (
                  <div className="relative h-40 w-full overflow-hidden bg-[#1A2332]/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveMediaUrl(res.coverImage)}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#1A2332]">
                      {isArticle ? 'Article' : res.fileType?.includes('pdf') ? 'PDF' : 'File'}
                    </span>
                  </div>
                ) : null;
                const body = (
                  <div className="flex flex-1 flex-col p-6">
                    {!cover && (
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="rounded-full bg-[#1A2332]/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#1A2332]/50">
                          {isArticle ? 'Article' : res.category || 'File'}
                        </span>
                      </div>
                    )}
                    {cover && res.category && (
                      <span className="mb-2 self-start rounded-full bg-[#1A2332]/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#1A2332]/50">
                        {res.category}
                      </span>
                    )}
                    <h3 className="font-heading text-base text-[#1A2332] group-hover:text-primary transition-colors">
                      {res.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#1A2332]/50 line-clamp-3">
                      {res.description || ''}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                      {isArticle ? (
                        <>
                          Read Article
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          Download
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </div>
                );
                return (
                  <Animate key={res.id || res.title} delay={i * 60}>
                    {isArticle ? (
                      <Link href={href} className={`${cardClass} relative`}>
                        {cover}
                        {body}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={cardClass}
                      >
                        {cover}
                        {body}
                      </a>
                    )}
                  </Animate>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-20">
          <div>
            <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">
              Need more support?
            </h2>
            <p className="mt-2 max-w-lg text-sm text-[#1A2332]/50">
              Explore insights, reach out to our team, or get in touch if you need someone to talk to.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 rounded-full border border-[#1A2332]/10 px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:border-primary/40 hover:text-primary"
            >
              Read Insights
            </Link>
            <Link
              href="/get-help"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:bg-[#6BCF6B]"
            >
              Get Help <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
