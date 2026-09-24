'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  BookOpen,
  Eye,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { articles, categories, type ArticleData } from '@/lib/articles-data';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { useArticles, useSettingsMap } from '@/hooks/use-api';
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

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function InsightsContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredArticles, setFilteredArticles] = useState<ArticleData[]>(articles);

  // Try API first, fall back to static data
  const { data: apiArticles } = useArticles({ limit: 20 });
  const { get, getJSON } = useSettingsMap();

  const trendingTags = getJSON<string[]>('insights_trending_tags', ['Mental Health', 'Self-Care', 'Youth', 'Workplace', 'Awareness']);
  const ctaTitle = get('insights_cta_title', 'Want to Share Your Story?');
  const ctaDescription = get('insights_cta_description', 'We welcome contributions from mental health professionals, advocates and anyone with a story to share. Your voice matters.');

  // Map API articles to local format, fallback to static
  const allArticles = apiArticles.data.length > 0
    ? apiArticles.data.map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt || '',
        content: typeof a.body === 'string' ? a.body : JSON.stringify(a.body || ''),
        category: a.category || 'Mental Health',
        image: resolveMediaUrl(a.coverMedia?.url) || '/images/projects/awareness.jpg',
        author: {
          name: a.author?.name || 'SHEDAM',
          role: 'Contributor',
          image: a.author?.avatarUrl || '/images/projects/community-outreach.jpg',
        },
        readTime: '5 min read',
        publishDate: a.publishedAt || a.createdAt,
        tags: a.tags?.map((t: any) => t.tag) || [],
        featured: false,
      }))
    : articles;

  const heroArticle = allArticles[0];
  const topStories = allArticles.slice(1, 4);
  const bottomRow = allArticles.slice(4, 7);
  const latestStories = allArticles.slice(5, 8);

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(filteredArticles.slice(3), 4);

  useEffect(() => {
    let result = allArticles;
    if (activeCategory !== 'All') {
      result = result.filter((a) => a.category === activeCategory);
    }
    setFilteredArticles(result);
  }, [activeCategory]);

  return (
    <>
      {/* ── Top Stories Header ── */}
      <section className="bg-white pt-24 pb-2 lg:pt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#1A2332]/40">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1A2332]">Insights</span>
          </div>

          {/* Section label */}
          <div className="flex items-center gap-3 mt-5 pb-5 border-b border-[#1A2332]/10">
            <div className="h-8 w-1 rounded-full bg-primary" />
            <h1 className="font-heading text-2xl font-normal text-[#1A2332] sm:text-3xl">Top Stories</h1>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </div>
      </section>

      {/* ── Top Stories Grid ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-0 lg:grid-cols-[1fr_1px_380px]">
            {/* Hero Article (Left) */}
            <Animate>
              <Link href={`/insights/${heroArticle.slug}`} className="group block border-b lg:border-b-0 lg:border-r border-[#1A2332]/10 pb-6 lg:pb-0 lg:pr-8">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={heroArticle.image}
                    alt={heroArticle.title}
                    width={800}
                    height={500}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#1A2332]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase text-[#1A2332]">
                      {heroArticle.category}
                    </span>
                  </div>
                </div>
                <h3 className="mt-4 font-heading text-xl leading-snug text-[#1A2332] transition-colors group-hover:text-primary sm:text-2xl lg:text-[26px]">
                  {heroArticle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1A2332]/50 line-clamp-2">
                  {heroArticle.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-[#1A2332]/40">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {heroArticle.readTime}
                  </span>
                  <span>·</span>
                  <span>{timeAgo(heroArticle.publishDate)}</span>
                </div>
              </Link>
            </Animate>

            {/* Divider */}
            <div className="hidden lg:block bg-[#1A2332]/10" />

            {/* Side Stories (Right) */}
            <div className="flex flex-col divide-y divide-[#1A2332]/10 lg:pl-8">
              {topStories.map((article, i) => (
                <Animate key={article.id} delay={i * 100}>
                  <Link href={`/insights/${article.slug}`} className="group flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                        {article.category}
                      </span>
                      <h4 className="mt-1.5 font-heading text-sm leading-snug text-[#1A2332] transition-colors group-hover:text-primary line-clamp-3">
                        {article.title}
                      </h4>
                      <p className="mt-1 text-xs text-[#1A2332]/40 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <span className="mt-1.5 flex items-center gap-1 text-[10px] text-[#1A2332]/30">
                        <Clock className="h-2.5 w-2.5" /> {article.readTime} · {timeAgo(article.publishDate)}
                      </span>
                    </div>
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                      <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="96px" />
                    </div>
                  </Link>
                </Animate>
              ))}
            </div>
          </div>

          {/* Bottom Row - 3 articles */}
          <div className="grid gap-6 border-t border-[#1A2332]/10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {bottomRow.map((article, i) => (
              <Animate key={article.id} delay={i * 100}>
                <Link href={`/insights/${article.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image src={article.image} alt={article.title} width={400} height={250} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <span className="mt-2.5 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                    {article.category}
                  </span>
                  <h4 className="mt-1.5 font-heading text-sm leading-snug text-[#1A2332] transition-colors group-hover:text-primary line-clamp-2">
                    {article.title}
                  </h4>
                  <span className="mt-1.5 flex items-center gap-1 text-[10px] text-[#1A2332]/30">
                    <Clock className="h-2.5 w-2.5" /> {article.readTime} · {timeAgo(article.publishDate)}
                  </span>
                </Link>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── More Stories Section ── */}
      <section className="bg-[#FAFAF8] py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          {/* Section header */}
          <div className="flex items-center gap-3 border-b border-[#1A2332]/10 pb-4 mb-6">
            <div className="h-8 w-1 rounded-full bg-primary" />
            <h2 className="font-heading text-xl font-normal text-[#1A2332] sm:text-2xl">More Stories</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1px_340px]">
            {/* Left: Larger story cards */}
            <div className="space-y-6">
              {paginatedItems.map((article, i) => (
                <Animate key={article.id} delay={i * 100}>
                  <Link href={`/insights/${article.slug}`} className="group flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-44 sm:w-64">
                      <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="256px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                        {article.category}
                      </span>
                      <h3 className="mt-2 font-heading text-base leading-snug text-[#1A2332] transition-colors group-hover:text-primary sm:text-lg">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#1A2332]/50 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-[10px] text-[#1A2332]/30">
                        <span className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> {article.readTime}
                        </span>
                        <span>·</span>
                        <span>{timeAgo(article.publishDate)}</span>
                        {article.views && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> {article.views.toLocaleString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </Animate>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden lg:block bg-[#1A2332]/10" />

            {/* Right: Latest Stories sidebar */}
            <div className="lg:pl-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-1 rounded-full bg-[#1A2332]" />
                <h3 className="font-heading text-base font-normal text-[#1A2332]">Latest Stories</h3>
              </div>
              <div className="space-y-0 divide-y divide-[#1A2332]/10">
                {latestStories.map((article, i) => (
                  <Animate key={article.id} delay={i * 100}>
                    <Link href={`/insights/${article.slug}`} className="group flex gap-3 py-3.5 first:pt-0">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium leading-snug text-[#1A2332] transition-colors group-hover:text-primary line-clamp-2">
                          {article.title}
                        </h4>
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-[#1A2332]/30">
                          <Clock className="h-2.5 w-2.5" /> {timeAgo(article.publishDate)}
                        </span>
                      </div>
                    </Link>
                  </Animate>
                ))}
              </div>

              {/* Trending tag */}
              <div className="mt-6 rounded-lg border border-[#1A2332]/10 bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-[#1A2332]">Trending Topics</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trendingTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#1A2332]/5 px-2.5 py-1 text-[10px] text-[#1A2332]/50 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            className="mt-10"
          />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-[#1A2332] py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 float-particle" style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties} />
          <div className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-primary/20 float-particle" style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties} />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <Animate>
            <h2 className="font-heading text-xl text-white sm:text-2xl lg:text-3xl">
              {ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-gray-300 sm:text-base">
              {ctaDescription}
            </p>
          </Animate>
          <Animate delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                Submit an Article <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5"
              >
                View All Insights
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
