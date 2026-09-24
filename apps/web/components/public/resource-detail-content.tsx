'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, Download, Loader2, Sparkles } from 'lucide-react';
import { api, resolveMediaUrl } from '@/lib/api';

export function ResourceDetailContent({ id }: { id: string }) {
  const [resource, setResource] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.getResource(id);
        if (!cancelled) {
          if (res.success && res.data) setResource(res.data);
          else setError('Resource not found');
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load resource');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-500">{error || 'Resource not found'}</p>
        <Link href="/resources" className="mt-4 text-sm font-medium text-primary hover:underline">
          Back to Resources
        </Link>
      </div>
    );
  }

  const paragraphs = (resource.body || '')
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <>
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
            <Link href="/resources" className="hover:text-primary transition-colors">
              Resources
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80">Article</span>
          </div>
          <div
            className={`mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-all duration-700 delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {resource.category || 'Article'}
          </div>
          <h1
            className={`mt-5 max-w-3xl font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl transition-all duration-700 delay-500 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {resource.title}
          </h1>
          {resource.description && (
            <p
              className={`mt-4 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base transition-all duration-700 delay-700 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {resource.description}
            </p>
          )}
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

      <section className="bg-[#FAFAF8] py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> All Resources
          </Link>

          {resource.coverImage && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolveMediaUrl(resource.coverImage)} alt="" className="max-h-[420px] w-full object-cover" />
            </div>
          )}

          <article className="mt-8 rounded-2xl border border-[#1A2332]/5 bg-white p-6 sm:p-8">
            {paragraphs.length > 0 ? (
              <div className="space-y-5">
                {paragraphs.map((p: string, i: number) => (
                  <p key={i} className="text-[15px] leading-relaxed text-[#1A2332]/75">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">This article content is coming soon.</p>
            )}

            {resource.fileUrl && (
              <a
                href={resource.fileUrl}
                target={resource.fileUrl.startsWith('http') ? '_blank' : undefined}
                rel={resource.fileUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:bg-[#6BCF6B]"
              >
                <Download className="h-4 w-4" /> Download attachment
              </a>
            )}
          </article>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-full border border-[#1A2332]/10 px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:border-primary/40 hover:text-primary"
            >
              More Resources
            </Link>
            <Link
              href="/get-help"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:bg-[#6BCF6B]"
            >
              Get Help
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
