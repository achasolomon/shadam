'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useSettingsMap } from '@/hooks/use-api';

interface ServicePageProps {
  slug: string;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  titleHighlight: string;
  description: string;
  heroImage: string;
  whyTitle: string;
  whyDescription: string;
  whyImage: string;
  activities: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  impact: string[];
  statNumber: string;
  statLabel: string;
  ctaTitle: string;
  ctaDescription: string;
}

export function ServicePageContent({
  slug,
  badge,
  badgeIcon,
  title,
  titleHighlight,
  description,
  heroImage,
  whyTitle,
  whyDescription,
  whyImage,
  activities,
  impact,
  statNumber,
  statLabel,
  ctaTitle,
  ctaDescription,
}: ServicePageProps) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { setHeroLoaded(true); }, []);

  const { get, getJSON } = useSettingsMap();
  const override = getJSON<Partial<ServicePageProps>>(`service_page_${slug}`, {});
  const backLabel = get('sp_back_label', 'All Services');
  const whyEyebrow = get('sp_why_eyebrow', 'Why It Matters');
  const activitiesEyebrow = get('sp_activities_eyebrow', 'What We Do');
  const activitiesTitle = get('sp_activities_title', 'Our Activities');
  const impactEyebrow = get('sp_impact_eyebrow', 'Our Impact');
  const impactTitle = get('sp_impact_title', 'What This Achieves');
  const ctaPrimary = get('sp_cta_primary', 'Get Involved');
  const ctaSecondary = get('sp_cta_secondary', 'Contact Us');
  const merged: ServicePageProps = {
    slug,
    badge,
    title,
    titleHighlight,
    description,
    heroImage,
    whyTitle,
    whyDescription,
    whyImage,
    activities,
    impact,
    statNumber,
    statLabel,
    ctaTitle,
    ctaDescription,
    ...override,
    // keep badgeIcon (React node) from props always
    badgeIcon,
  };
  const {
    badge: mergedBadge,
    title: mergedTitle,
    titleHighlight: mergedTitleHighlight,
    description: mergedDescription,
    heroImage: mergedHeroImage,
    whyTitle: mergedWhyTitle,
    whyDescription: mergedWhyDescription,
    whyImage: mergedWhyImage,
    activities: mergedActivities,
    impact: mergedImpact,
    statNumber: mergedStatNumber,
    statLabel: mergedStatLabel,
    ctaTitle: mergedCtaTitle,
    ctaDescription: mergedCtaDescription,
  } = merged;

  const finalActivities = mergedActivities.map((a, i) => ({
    ...a,
    icon: a.icon ?? activities[i]?.icon ?? <CheckCircle2 className="h-5 w-5" />,
  }));

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] overflow-hidden bg-[#1A2332] lg:min-h-[60vh]">
        <div className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
          <Image src={mergedHeroImage} alt={mergedTitle} fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2332]/95 via-[#1A2332]/80 to-[#1A2332]/60" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-20">
          <div className="max-w-2xl">
            <Link href="/what-we-do" className={`mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-700 delay-200 hover:text-[#6BCF6B] ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
            <div className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm transition-all duration-700 delay-300 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {badgeIcon}
              {mergedBadge}
            </div>
            <h1 className={`mt-6 font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl xl:text-6xl transition-all duration-700 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {mergedTitle} <span className="text-primary">{mergedTitleHighlight}</span>
            </h1>
            <p className={`mt-6 max-w-lg text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg transition-all duration-700 delay-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {mergedDescription}
            </p>
          </div>
        </div>
        <div className="absolute top-20 right-10 h-2 w-2 rounded-full bg-primary/40 float-particle" style={{ '--duration': '3s', '--delay': '0s' } as React.CSSProperties} />
        <div className="absolute bottom-32 right-32 h-1.5 w-1.5 rounded-full bg-primary/30 float-particle" style={{ '--duration': '4s', '--delay': '1s' } as React.CSSProperties} />
      </section>

      {/* ── Torn Edge ── */}
      <div className="relative -mt-1 bg-[#1A2332]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full" preserveAspectRatio="none">
          <path d="M0 60V20C80 35 160 10 240 25C320 40 400 15 480 30C560 45 640 20 720 35C800 50 880 25 960 40C1040 55 1120 30 1200 45C1280 60 1360 35 1440 50V60H0Z" fill="#FAFAF8"/>
        </svg>
      </div>

      {/* ── Why It Matters ── */}
      <ServiceSection animation="animate-fade-left">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{whyEyebrow}</p>
            <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">{mergedWhyTitle}</h2>
            <p className="mt-5 text-sm leading-relaxed text-[#1A2332]/60 sm:text-base">{mergedWhyDescription}</p>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={mergedWhyImage} alt={mergedWhyTitle} fill className="object-cover" />
            </div>
          </div>
        </div>
      </ServiceSection>

      {/* ── Activities ── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <ServiceSection>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{activitiesEyebrow}</p>
              <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                {activitiesTitle}
              </h2>
            </div>
          </ServiceSection>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {finalActivities.map((a, i) => (
              <ServiceCard key={a.title} delay={i * 80}>
                <div className="group rounded-2xl border border-gray-100 bg-[#F8F9FA] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-primary/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                    <div className="text-primary transition-colors duration-500 group-hover:text-white">{a.icon}</div>
                  </div>
                  <h3 className="mt-5 font-heading text-lg text-dark">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{a.description}</p>
                </div>
              </ServiceCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact ── */}
      <section className="bg-[#1A2332] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <ServiceSection animation="animate-fade-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{impactEyebrow}</p>
                <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl lg:text-3xl">
                  {impactTitle}
                </h2>
                <ul className="mt-6 space-y-3">
                  {mergedImpact.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ServiceSection>
            <ServiceSection animation="animate-fade-right" delay={200}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.05]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <p className="mt-6 font-heading text-4xl text-white">{mergedStatNumber}</p>
                <p className="mt-2 text-sm text-gray-400">{mergedStatLabel}</p>
              </div>
            </ServiceSection>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 float-particle" style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties} />
          <div className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-white/20 float-particle" style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties} />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <ServiceSection>
            <h2 className="font-heading text-xl text-white sm:text-2xl lg:text-3xl">{mergedCtaTitle}</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 sm:text-base">{mergedCtaDescription}</p>
          </ServiceSection>
          <ServiceSection delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/get-involved" className="btn-ripple inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-primary transition-all duration-300 hover:bg-[#1A2332] hover:text-white hover:shadow-xl hover:-translate-y-0.5">
                {ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5">
                {ctaSecondary}
              </Link>
            </div>
          </ServiceSection>
        </div>
      </section>
    </>
  );
}

function ServiceSection({ children, className = '', animation = 'animate-fade-up', delay = 0 }: { children: React.ReactNode; className?: string; animation?: string; delay?: number }) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  return (
    <div ref={setRef} className={`${animation} ${visible ? 'animate-in' : 'animate-hidden'} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function ServiceCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  return (
    <div ref={setRef} className={`animate-fade-up ${visible ? 'animate-in' : 'animate-hidden'}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
