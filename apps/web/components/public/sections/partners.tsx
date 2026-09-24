'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, GraduationCap, Globe, Heart, Shield, Users } from 'lucide-react';
import { usePartners, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const categoryIcons = [Shield, Building2, GraduationCap, Globe];

const categoriesFallback = [
  {
    label: 'Professional Bodies',
    icon: Shield,
    partners: [
      { name: 'Nigerian Psychological Association', abbr: 'NPA' },
      { name: 'Nigerian Medical Association', abbr: 'NMA' },
      { name: 'Association of Psychiatrists in Nigeria', abbr: 'APN' },
    ] as Array<{ name: string; abbr: string; logoUrl?: string }>,
  },
  {
    label: 'Government & Healthcare',
    icon: Building2,
    partners: [
      { name: 'Federal Ministry of Health', abbr: 'FMoH' },
      { name: 'National Hospital Abuja', abbr: 'NHA' },
      { name: 'FCT Primary Health Care Board', abbr: 'FPHCB' },
    ] as Array<{ name: string; abbr: string; logoUrl?: string }>,
  },
  {
    label: 'Academic & Research',
    icon: GraduationCap,
    partners: [
      { name: 'University of Abuja', abbr: 'UniAbuja' },
      { name: 'Nigerian Defence Academy', abbr: 'NDA' },
      { name: 'Baze University', abbr: 'Baze' },
    ] as Array<{ name: string; abbr: string; logoUrl?: string }>,
  },
  {
    label: 'International & Development',
    icon: Globe,
    partners: [
      { name: 'World Health Organization', abbr: 'WHO' },
      { name: 'UNICEF Nigeria', abbr: 'UNICEF' },
      { name: 'Mental Health Foundation', abbr: 'MHF' },
    ] as Array<{ name: string; abbr: string; logoUrl?: string }>,
  },
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function Partners() {
  const [count, setCount] = useState(0);
  const { ref: countRef, visible: countVisible } = useInView(0.5);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const { get, getJSON } = useSettingsMap();
  const { data: apiPartners, source: partnersSource } = usePartners();
  const partnersEyebrow = get('partners_eyebrow', 'Our Partners');
  const partnersTitle = get('partners_title', 'Trusted by Leading Organisations');
  const partnersDescription = get(
    'partners_description',
    'We collaborate with government agencies, healthcare institutions, professional bodies, and international organisations to strengthen mental health systems across Nigeria.'
  );
  const partnersCount = parseInt(get('partners_count', '12'), 10) || 12;
  const partnersCta = get('partners_cta', 'Become a Partner');
  const partnersBottomLabel = get('partners_bottom_label', 'Partner Organisations');
  const partnersBottomNote = get('partners_bottom_note', 'And growing across Nigeria and beyond');
  const partnersViewAll = get('partners_view_all', 'View all partners');

  const apiCategories =
    partnersSource === 'api' && Array.isArray(apiPartners) && apiPartners.length > 0
      ? (() => {
          const byCat = new Map<string, { name: string; abbr: string; logoUrl?: string }[]>();
          apiPartners.forEach((p: any) => {
            const key = p.category || 'Partners';
            if (!byCat.has(key)) byCat.set(key, []);
            byCat.get(key)!.push({
              name: p.name,
              abbr: p.abbr || p.name.split(' ').map((w: string) => w[0]).join('').slice(0, 4).toUpperCase(),
              logoUrl: p.logoUrl || undefined,
            });
          });
          return Array.from(byCat.entries()).map(([label, partners], i) => ({
            label,
            partners,
            icon: categoryIcons[i % categoryIcons.length],
          }));
        })()
      : [];

  const rawPartners = getJSON<Array<{ label: string; partners: Array<{ name: string; abbr: string; logoUrl?: string }> }>>(
    'partners_list',
    []
  );
  const settingsCategories =
    rawPartners.length > 0
      ? rawPartners.map((cat, i) => ({ ...cat, icon: categoryIcons[i % categoryIcons.length] }))
      : categoriesFallback;
  const categories = apiCategories.length > 0 ? apiCategories : settingsCategories;
  const totalPartners =
    partnersSource === 'api' && apiPartners.length > 0
      ? apiPartners.length
      : categories.reduce((sum, c) => sum + c.partners.length, 0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSectionVisible(true); obs.disconnect(); } }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!countVisible) return;
    const end = totalPartners || partnersCount;
    const duration = 1500;
    const startTime = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [countVisible, partnersCount, totalPartners]);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden bg-[#1A2332] ${sectionVisible ? 'partner-visible' : ''}`}>
      {/* Animated background glows */}
      <div className="absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[150px] transition-all duration-[3s] hover:bg-primary/[0.08]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.02] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-20 lg:py-24">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end lg:gap-12">
          <div className="max-w-xl">
            <div className="partner-pill inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary backdrop-blur-sm sm:text-xs">
              <Users className="h-3 w-3" />
              {partnersEyebrow}
            </div>
            <h2 className="partner-title mt-4 font-heading text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl">
              {partnersTitle}
            </h2>
            <p className="partner-desc mt-4 text-sm text-gray-400 sm:text-base">
              {partnersDescription}
            </p>
          </div>
          <Link
            href="/contact"
            className="partner-cta group inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-xs font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-[#1A2332] hover:shadow-lg hover:shadow-primary/20 sm:text-sm"
          >
            {partnersCta}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, ci) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                className="partner-card group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 sm:p-6"
                style={{ animationDelay: `${ci * 120}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="partner-icon flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-4 w-4 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">{cat.label}</span>
                </div>
                <div className="mt-5 space-y-2">
                  {cat.partners.map((p, pi) => (
                    <div
                      key={p.name}
                      className="partner-row flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:border-white/5 hover:bg-white/[0.03]"
                      style={{ animationDelay: `${ci * 120 + pi * 60}ms` }}
                    >
                      {p.logoUrl ? (
                        <div className="partner-badge flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white transition-all duration-500 group-hover:border-primary/30 group-hover:scale-105">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={resolveMediaUrl(p.logoUrl)}
                            alt={`${p.name} logo`}
                            className="h-full w-full object-contain p-0.5"
                          />
                        </div>
                      ) : (
                        <div className="partner-badge flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-105">
                          {p.abbr}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-white transition-colors duration-300 group-hover:text-primary/90 sm:text-sm">{p.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom strip */}
        <div
          ref={countRef}
          className="partner-bottom mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5 transition-all duration-500 hover:border-primary/10 hover:bg-white/[0.04] sm:flex-row sm:px-8"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="partner-heart flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-all duration-500 hover:bg-primary/20 hover:scale-110">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                <span className="font-heading text-lg text-primary">{count}+</span>{' '}
                {partnersBottomLabel}
              </p>
              <p className="text-xs text-gray-500">{partnersBottomNote}</p>
            </div>
          </div>
          <Link
            href="/partners"
            className="group inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-300 hover:text-[#6BCF6B] hover:gap-2 sm:text-sm"
          >
            {partnersViewAll}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
