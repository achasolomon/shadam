'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Globe,
  GraduationCap,
  Heart,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { usePartners, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const categoryIcons = [Shield, Building2, GraduationCap, Globe];

type PartnerItem = { name: string; abbr?: string; website?: string; logoUrl?: string };

const categoriesFallback: { label: string; partners: PartnerItem[] }[] = [
  {
    label: 'Professional Bodies',
    partners: [
      { name: 'Nigerian Psychological Association', abbr: 'NPA' },
      { name: 'Nigerian Medical Association', abbr: 'NMA' },
      { name: 'Association of Psychiatrists in Nigeria', abbr: 'APN' },
    ],
  },
  {
    label: 'Government & Healthcare',
    partners: [
      { name: 'Federal Ministry of Health', abbr: 'FMoH' },
      { name: 'National Hospital Abuja', abbr: 'NHA' },
      { name: 'FCT Primary Health Care Board', abbr: 'FPHCB' },
    ],
  },
  {
    label: 'Academic & Research',
    partners: [
      { name: 'University of Abuja', abbr: 'UniAbuja' },
      { name: 'Nigerian Defence Academy', abbr: 'NDA' },
      { name: 'Baze University', abbr: 'Baze' },
    ],
  },
  {
    label: 'International & Development',
    partners: [
      { name: 'World Health Organization', abbr: 'WHO' },
      { name: 'UNICEF Nigeria', abbr: 'UNICEF' },
      { name: 'Mental Health Foundation', abbr: 'MHF' },
    ],
  },
];

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

export function PartnersContent() {
  const { data: apiPartners, source } = usePartners();
  const { get, getJSON } = useSettingsMap();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  const eyebrow = get('partners_page_eyebrow', get('partners_eyebrow', 'Our Network'));
  const title = get('partners_page_title', 'Our');
  const titleHighlight = get('partners_page_title_highlight', 'Partners');
  const description = get(
    'partners_page_description',
    get(
      'partners_description',
      'We collaborate with government agencies, healthcare institutions, professional bodies, and international organisations to strengthen mental health systems across Nigeria.'
    )
  );
  const cta = get('partners_cta', 'Become a Partner');
  const bottomLabel = get('partners_bottom_label', 'Partner Organisations');
  const bottomNote = get('partners_bottom_note', 'And growing across Nigeria and beyond');

  const categories = (() => {
    if (source === 'api' && Array.isArray(apiPartners) && apiPartners.length > 0) {
      const byCat = new Map<string, { name: string; abbr?: string; website?: string; logoUrl?: string }[]>();
      apiPartners.forEach((p: any) => {
        const key = p.category || 'Partners';
        if (!byCat.has(key)) byCat.set(key, []);
        byCat.get(key)!.push({
          name: p.name,
          abbr: p.abbr || p.name.split(' ').map((w: string) => w[0]).join('').slice(0, 4).toUpperCase(),
          website: p.website,
          logoUrl: p.logoUrl || undefined,
        });
      });
      return Array.from(byCat.entries()).map(([label, partners], i) => ({
        label,
        partners,
        icon: categoryIcons[i % categoryIcons.length],
      }));
    }
    const rawPartners = getJSON<{ label: string; partners: PartnerItem[] }[]>(
      'partners_list',
      []
    );
    const base = rawPartners.length > 0 ? rawPartners : categoriesFallback;
    return base.map((cat, i) => ({ ...cat, icon: categoryIcons[i % categoryIcons.length] }));
  })();

  const totalPartners = categories.reduce((sum, c) => sum + c.partners.length, 0);

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
            <span className="text-white/80">Partners</span>
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
                className={`mt-4 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base transition-all duration-700 delay-700 ${
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

      {/* ── Category Grid ── */}
      <section className="bg-[#FAFAF8] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, ci) => {
              const Icon = (cat as any).icon;
              return (
                <Animate key={cat.label} delay={ci * 80}>
                  <div className="group h-full rounded-2xl border border-[#1A2332]/5 bg-white p-6 transition-all duration-500 hover:border-primary/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110">
                        <Icon className="h-4 w-4 text-primary transition-colors duration-500 group-hover:text-white" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
                        {cat.label}
                      </span>
                    </div>
                    <div className="mt-5 space-y-2">
                      {cat.partners.map((p, pi) => {
                        const inner = (
                          <>
                            {p.logoUrl ? (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#1A2332]/5 bg-white transition-all duration-500 group-hover:border-primary/20 group-hover:scale-105">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={resolveMediaUrl(p.logoUrl)}
                                  alt={`${p.name} logo`}
                                  className="h-full w-full object-contain p-0.5"
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-105">
                                {p.abbr}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-[#1A2332] transition-colors duration-300 group-hover:text-primary">
                                {p.name}
                              </p>
                            </div>
                          </>
                        );
                        return p.website ? (
                          <a
                            key={p.name}
                            href={p.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:border-[#1A2332]/5 hover:bg-[#1A2332]/[0.02]"
                            style={{ animationDelay: `${ci * 120 + pi * 60}ms` }}
                          >
                            {inner}
                          </a>
                        ) : (
                          <div
                            key={p.name}
                            className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:border-[#1A2332]/5 hover:bg-[#1A2332]/[0.02]"
                            style={{ animationDelay: `${ci * 120 + pi * 60}ms` }}
                          >
                            {inner}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Animate>
              );
            })}
          </div>

          {/* Bottom strip */}
          <Animate>
            <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#1A2332]/5 bg-white px-6 py-5 transition-all duration-500 hover:border-primary/10 sm:flex-row sm:px-8">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A2332]">
                    <span className="font-heading text-lg text-primary">{totalPartners}+</span>{' '}
                    {bottomLabel}
                  </p>
                  <p className="text-xs text-[#1A2332]/40">{bottomNote}</p>
                </div>
              </div>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-300 hover:text-[#6BCF6B] hover:gap-2 sm:text-sm"
              >
                {cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
