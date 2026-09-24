'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Eye } from 'lucide-react';
import { articles as staticArticles } from '@/lib/articles-data';
import { useArticles } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const categoryColors: Record<string, string> = {
  'Mental Health': '#88E788',
  Education: '#3B82F6',
  Awareness: '#F59E0B',
  Community: '#8B5CF6',
  Wellbeing: '#EC4899',
  Workplace: '#06B6D4',
  Youth: '#EF4444',
};

export function BlogPreview() {
  // Try API first, fall back to static data
  const { data: apiResult, source } = useArticles({ limit: 6 });

  const apiPosts =
    source === 'api' && apiResult.data.length > 0
      ? apiResult.data.map((a: any, i: number) => ({
          slug: a.slug,
          title: a.title,
          category: a.category || 'Mental Health',
          excerpt: a.summary || a.excerpt || '',
          image: resolveMediaUrl(a.coverMedia?.url) || `/images/blog/post-${(i % 6) + 1}.jpg`,
          readTime: '',
          views: undefined as number | undefined,
          publishedAt: a.publishedAt,
        }))
      : [];

  const posts =
    (apiPosts.length > 0 ? apiPosts.slice(0, 3) : []) as Array<{
      slug: any;
      title: any;
      category: any;
      excerpt: any;
      image: any;
      readTime: string;
      views: number | undefined;
      publishedAt: any;
    }>;
  const fallbackPosts = staticArticles.slice(0, 3).map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    image: a.image,
    readTime: a.readTime || '',
    views: undefined as number | undefined,
    publishedAt: undefined as string | undefined,
  }));
  const resolvedPosts = posts.length > 0 ? posts : fallbackPosts;
  const posts0 = resolvedPosts[0];
  const posts1 = resolvedPosts[1];
  const posts2 = resolvedPosts[2];

  return (
    <section className="relative bg-white py-12 lg:py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: "url('/images/banner/banner3.jpeg')" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-start">
          {/* Left: Featured post */}
          <Link href={`/insights/${posts0.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={posts0.image}
                alt={posts0.title}
                width={600}
                height={400}
                className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span
              className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: `${categoryColors[posts0.category] || '#88E788'}CC` }}
            >
              {posts0.category}
            </span>
            <h3 className="mt-2 font-heading text-lg font-normal text-dark group-hover:text-primary transition-colors sm:text-xl">
              {posts0.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-3">
              {posts0.excerpt}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                {posts0.publishedAt ? (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3" /> {new Date(posts0.publishedAt).toLocaleDateString()}
                  </span>
                ) : (
                  posts0.readTime && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3" /> {posts0.readTime}
                    </span>
                  )
                )}
                {posts0.views && (
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3 w-3" /> {posts0.views.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2.5">
                Read More <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          {/* Right: Post list */}
          <div className="space-y-0">
            {posts.slice(1).map((post, i) => (
              <Link
                key={i}
                href={`/insights/${post.slug}`}
                className={`group flex gap-4 py-5 sm:gap-5 sm:py-6 ${i !== posts.length - 2 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="112px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundColor: `${categoryColors[post.category] || '#88E788'}CC` }}
                  >
                    {post.category}
                  </span>
                  <h4 className="mt-1 font-heading text-sm font-normal text-dark group-hover:text-primary transition-colors sm:text-base">
                    {post.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      {post.publishedAt ? (
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3 w-3" /> {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      ) : (
                        post.readTime && (
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3 w-3" /> {post.readTime}
                          </span>
                        )
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
                      Read More <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center lg:mt-10">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-dark/90 hover:shadow-lg"
          >
            Visit Our Blog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
