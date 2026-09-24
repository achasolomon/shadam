'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { type ArticleData } from '@/lib/articles-data';

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

export function ArticleDetailContent({
  article,
  related,
}: {
  article: ArticleData;
  related: ArticleData[];
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-4 space-y-1.5 pl-5">
            {listItems.map((item, i) => (
              <li key={i} className="relative text-[15px] leading-[1.8] text-[#1A2332]/70 before:absolute before:left-[-1.2em] before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary">
                {item}
              </li>
            ))}
          </ul>,
        );
        listItems = [];
        inList = false;
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${elements.length}`} className="mt-8 mb-3 font-heading text-lg font-normal text-[#1A2332]">
            {trimmed.slice(4)}
          </h3>,
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${elements.length}`} className="mt-10 mb-4 font-heading text-xl font-normal text-[#1A2332]">
            {trimmed.slice(3)}
          </h2>,
        );
      } else if (trimmed.startsWith('- ')) {
        inList = true;
        listItems.push(trimmed.slice(2));
      } else if (/^\d+\.\s/.test(trimmed)) {
        inList = true;
        listItems.push(trimmed.replace(/^\d+\.\s/, ''));
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={`p-${elements.length}`} className="my-3 text-[15px] leading-[1.8] text-[#1A2332]/70">
            {trimmed}
          </p>,
        );
      }
    }
    flushList();
    return elements;
  };

  return (
    <>
      {/* ── Hero Image ── */}
      <section className="bg-white pt-24 pb-0 lg:pt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 pb-4 text-xs text-[#1A2332]/40">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/insights" className="hover:text-primary transition-colors">Insights</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1A2332]/60 line-clamp-1">{article.title}</span>
          </div>

          {/* Article Image */}
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={article.image}
              alt={article.title}
              width={1200}
              height={600}
              className="aspect-[2/1] w-full object-cover"
              priority
            />
          </div>
          <p className="mt-2 text-[10px] text-[#1A2332]/30 italic">
            {article.title} — {article.author.name}
          </p>
        </div>
      </section>

      {/* ── Article Body + Sidebar ── */}
      <section className="bg-white py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <div>
              {/* Title */}
              <Animate>
                <h1 className="font-heading text-2xl leading-snug text-[#1A2332] sm:text-3xl lg:text-[34px] lg:leading-tight">
                  {article.title}
                </h1>
              </Animate>

              {/* Meta */}
              <Animate delay={50}>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#1A2332]/40">
                  <span className="font-medium text-primary">{article.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {article.readTime}
                  </span>
                  <span>·</span>
                  <span>{new Date(article.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  {article.views && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views.toLocaleString()} views</span>
                    </>
                  )}
                </div>
              </Animate>

              {/* Lead paragraph (bold) */}
              <Animate delay={100}>
                <p className="mt-6 text-base font-medium leading-relaxed text-[#1A2332]/80">
                  {article.excerpt}
                </p>
              </Animate>

              {/* Divider */}
              <div className="my-6 h-px bg-[#1A2332]/10" />

              {/* Article Content */}
              <Animate delay={150}>
                <article>
                  {renderContent(article.content)}
                </article>
              </Animate>

              {/* Author + Share */}
              <Animate delay={200}>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#1A2332]/10 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A2332]">{article.author.name}</p>
                      <p className="text-[10px] text-[#1A2332]/40">{article.author.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#1A2332]/10 px-3.5 py-2 text-xs font-medium text-[#1A2332]/60 transition-all duration-300 hover:border-primary/30 hover:text-primary"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      {copied ? 'Copied!' : 'Share'}
                    </button>
                  </div>
                </div>
              </Animate>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Popular / Related */}
              <Animate delay={100}>
                <div>
                  <div className="flex items-center gap-2 border-b border-[#1A2332]/10 pb-3 mb-3">
                    <div className="h-5 w-1 rounded-full bg-primary" />
                    <h3 className="font-heading text-base font-normal text-[#1A2332]">Popular</h3>
                  </div>
                  <div className="space-y-0 divide-y divide-[#1A2332]/10">
                    {related.map((rel, i) => (
                      <Link key={rel.id} href={`/insights/${rel.slug}`} className="group flex gap-3 py-3.5 first:pt-0">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                          <Image src={rel.image} alt={rel.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium leading-snug text-[#1A2332] transition-colors group-hover:text-primary line-clamp-3">
                            {rel.title}
                          </h4>
                          <span className="mt-1 flex items-center gap-1 text-[10px] text-[#1A2332]/30">
                            <Clock className="h-2.5 w-2.5" /> {timeAgo(rel.publishDate)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Tags */}
              <Animate delay={200}>
                <div className="rounded-lg border border-[#1A2332]/10 bg-[#FAFAF8] p-4">
                  <h4 className="text-xs font-semibold text-[#1A2332] mb-3">Topics</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white border border-[#1A2332]/10 px-2.5 py-1 text-[10px] text-[#1A2332]/50 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Newsletter */}
              <Animate delay={300}>
                <div className="rounded-lg bg-[#1A2332] p-4 text-white">
                  <h4 className="text-xs font-semibold">Stay Updated</h4>
                  <p className="mt-1 text-[10px] text-gray-300">Get the latest insights delivered to your inbox.</p>
                  <div className="mt-3 space-y-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded bg-white/10 px-3 py-2 text-xs text-white placeholder-gray-400 outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button className="w-full rounded bg-primary px-3 py-2 text-xs font-medium text-[#1A2332] transition-all hover:bg-[#6BCF6B]">
                      Subscribe
                    </button>
                  </div>
                </div>
              </Animate>
            </aside>
          </div>
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
              Enjoyed This Article?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-gray-300 sm:text-base">
              Explore more insights on mental health, wellbeing and community support.
            </p>
          </Animate>
          <Animate delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/insights"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                View All Insights <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5"
              >
                Submit an Article
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
