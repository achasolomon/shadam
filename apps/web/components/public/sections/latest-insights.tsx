'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { articles as staticArticles } from '@/lib/articles-data';
import { useArticles, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

export function LatestInsights() {
  const { data: apiResult, source } = useArticles({ limit: 3 });
  const { get } = useSettingsMap();

  const eyebrow = get('home_insights_eyebrow', 'Insights');
  const title = get('home_insights_title', 'Latest Articles');
  const viewAll = get('home_insights_cta', 'View All');
  const readMore = get('home_insights_read_more', 'Read More');

  const apiPosts =
    source === 'api' && apiResult.data.length > 0
      ? apiResult.data.slice(0, 3).map((a: any, i: number) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.summary || a.excerpt || '',
          category: a.category || 'Mental Health',
          readTime: a.readTime || '5 min',
          date: a.publishedAt
            ? new Date(a.publishedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
            : '',
          image: resolveMediaUrl(a.coverMedia?.url) || `/images/blog/post-${(i % 6) + 1}.jpg`,
        }))
      : [];

  const posts =
    apiPosts.length > 0
      ? apiPosts
      : staticArticles.slice(0, 3).map((a) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          category: a.category,
          readTime: a.readTime || '5 min',
          date: a.publishDate,
          image: a.image,
        }));

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">{title}</h2>
          </div>
          <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            {viewAll} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((a) => (
            <article key={a.slug || a.title} className="group rounded-xl border border-border bg-white transition-all hover:border-primary hover:shadow-md">
              <div className="aspect-[16/10] overflow-hidden rounded-t-xl bg-surface-alt">
                <Image
                  src={a.image}
                  alt={a.title}
                  width={640}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{a.category}</span>
                  <span className="flex items-center gap-1 text-xs text-text-muted"><Clock className="h-3 w-3" />{a.readTime}</span>
                </div>
                <h3 className="mt-3 font-heading text-lg font-semibold text-dark group-hover:text-primary">{a.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{a.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-text-muted">{a.date}</span>
                  <Link href={`/insights/${a.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    {readMore} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
