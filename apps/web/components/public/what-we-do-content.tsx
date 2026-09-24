'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Megaphone,
  GraduationCap,
  Heart,
  HeartHandshake,
  Shield,
  Lightbulb,
  Users,
  ArrowLeft,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { useSettingsMap } from '@/hooks/use-api';

const servicesFallback = [
  {
    slug: 'awareness',
    icon: Megaphone,
    number: '01',
    title: 'Mental Health Awareness',
    short: 'Promoting understanding and acceptance',
    description:
      'We run campaigns, public forums and outreach programmes to promote understanding and acceptance of mental health conditions in communities across Nigeria.',
    highlights: ['Community forums', 'Public campaigns', 'Media engagement', 'Digital outreach'],
    image: '/images/projects/awareness.jpg',
    color: '#88E788',
  },
  {
    slug: 'education',
    icon: GraduationCap,
    number: '02',
    title: 'Mental Health Education',
    short: 'Building mental health literacy',
    description:
      'We deliver workshops, seminars and educational resources for individuals, schools, workplaces and community groups to build mental health literacy.',
    highlights: ['School outreach', 'Workplace wellness', 'Community workshops', 'Educational materials'],
    image: '/images/projects/educational-workshop.jpg',
    color: '#3B82F6',
  },
  {
    slug: 'referral',
    icon: Heart,
    number: '03',
    title: 'Professional Referral',
    short: 'Connecting to quality care',
    description:
      'We connect individuals to licensed mental health professionals — psychologists, counsellors and psychiatrists — ensuring access to quality care.',
    highlights: ['Therapist matching', 'Counselling coordination', 'Psychiatric referrals', 'Follow-up support'],
    image: '/images/projects/support-referal-system.jpg',
    color: '#EF4444',
  },
  {
    slug: 'community',
    icon: HeartHandshake,
    number: '04',
    title: 'Community Support',
    short: 'Building safe spaces and networks',
    description:
      'We build safe spaces and peer support networks that provide ongoing emotional support and a sense of belonging for those navigating mental health challenges.',
    highlights: ['Peer support groups', 'Online communities', 'Safe spaces', 'Ongoing check-ins'],
    image: '/images/projects/community-outreach.jpg',
    color: '#F59E0B',
  },
  {
    slug: 'vulnerable',
    icon: Shield,
    number: '05',
    title: 'Vulnerable Persons Support',
    short: 'Reaching those who need it most',
    description:
      'We specialise in reaching those who need it most — the indigent, at-risk groups and underserved populations — helping them access care they might otherwise miss.',
    highlights: ['Underserved outreach', 'Free counselling', 'Crisis intervention', 'NGO partnerships'],
    image: '/images/banner/banner2.jpg',
    color: '#8B5CF6',
  },
  {
    slug: 'research',
    icon: Lightbulb,
    number: '06',
    title: 'Research & Advocacy',
    short: 'Driving systemic change',
    description:
      'We contribute to policy discussions and publish insights that advance mental health awareness and influence systemic change at community and national levels.',
    highlights: ['Policy advocacy', 'Publications', 'Stakeholder engagement', 'Data insights'],
    image: '/images/banner/banner3.jpeg',
    color: '#06B6D4',
  },
];

const stepsFallback = [
  { step: '01', title: 'Reach Out', description: 'Contact us through our helpline, WhatsApp, email or the get help page.', icon: Phone },
  { step: '02', title: 'Get Connected', description: 'We listen, understand your needs and connect you to the right professional or resource.', icon: Users },
  { step: '03', title: 'Receive Support', description: 'Access counselling, therapy, peer support or ongoing care tailored to your situation.', icon: Heart },
];

function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

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

function Animate({ children, className = '', animation = 'animate-fade-up', delay = 0 }: { children: React.ReactNode; className?: string; animation?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`${animation} ${visible ? 'animate-in' : 'animate-hidden'} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function WhatWeDoContent() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { setHeroLoaded(true); }, []);

  const { get, getJSON } = useSettingsMap();

  const heroEyebrow = get('wwd_hero_eyebrow', 'Our Services');
  const heroTitle = get('wwd_hero_title', 'What');
  const heroTitleHighlight = get('wwd_hero_title_highlight', 'We Do');
  const heroDescription = get('wwd_hero_description', 'From awareness campaigns to direct professional support, we provide a comprehensive range of services designed to improve mental health outcomes in our communities.');
  const sectionEyebrow = get('wwd_section_eyebrow', 'What We Offer');
  const sectionTitle = get('wwd_section_title', 'Comprehensive Mental Health Services');
  const sectionDescription = get('wwd_section_description', 'Six pillars of support that address every aspect of mental wellbeing — from awareness to professional care.');
  const stepsTitle = get('wwd_steps_title', 'Getting Support Is');
  const stepsTitleHighlight = get('wwd_steps_title_highlight', 'Simple');
  const ctaTitle = get('wwd_cta_title', 'Ready to Take the Next Step?');
  const ctaDescription = get('wwd_cta_description', 'You are not alone. We are here to help. Reach out today and let us connect you with the support you deserve.');
  const stepsEyebrow = get('wwd_steps_eyebrow', 'How It Works');
  const exploreLabel = get('wwd_card_explore_label', 'Explore Service');
  const helpCtaLabel = get('wwd_cta_help_label', 'Get Help Now');
  const contactCtaLabel = get('wwd_cta_contact_label', 'Contact Us');
  const heroImage = get('wwd_hero_image', '/images/projects/community-outreach.jpg');

  const serviceIcons: Record<string, React.ComponentType<any>> = {
    awareness: Megaphone,
    education: GraduationCap,
    referral: Heart,
    community: HeartHandshake,
    vulnerable: Shield,
    research: Lightbulb,
  };
  const stepIcons = [Phone, Users, Heart];
  const services = (() => {
    const raw = getJSON<any[]>('services_list', []);
    const base = raw.length > 0 ? raw : servicesFallback;
    return base.map((s) => ({ ...s, icon: serviceIcons[s.slug] || Megaphone }));
  })();
  const rawSteps = getJSON<{ step: string; title: string; description?: string; desc?: string }[]>('wwd_steps', []);
  const steps = (rawSteps.length > 0 ? rawSteps : stepsFallback).map((s: any, i: number) => ({
    step: s.step,
    title: s.title,
    description: s.description || s.desc || '',
    icon: stepIcons[i % stepIcons.length],
  }));

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] overflow-hidden bg-[#1A2332] lg:min-h-[60vh]">
        <div className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
          <Image src={heroImage} alt="SHEDAM Services" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2332]/95 via-[#1A2332]/80 to-[#1A2332]/60" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-20">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm transition-all duration-700 delay-300 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Sparkles className="h-3.5 w-3.5" />
              {heroEyebrow}
            </div>
            <h1 className={`mt-6 font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl xl:text-6xl transition-all duration-700 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {heroTitle} <span className="text-primary">{heroTitleHighlight}</span>
            </h1>
            <p className={`mt-6 max-w-lg text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg transition-all duration-700 delay-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {heroDescription}
            </p>
          </div>
        </div>
        {/* Floating dots */}
        <div className="absolute top-20 right-10 h-2 w-2 rounded-full bg-primary/40 float-particle" style={{ '--duration': '3s', '--delay': '0s' } as React.CSSProperties} />
        <div className="absolute bottom-32 right-32 h-1.5 w-1.5 rounded-full bg-primary/30 float-particle" style={{ '--duration': '4s', '--delay': '1s' } as React.CSSProperties} />
      </section>

      {/* ── Torn Edge ── */}
      <div className="relative -mt-1 bg-[#1A2332]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full" preserveAspectRatio="none">
          <path d="M0 60V20C80 35 160 10 240 25C320 40 400 15 480 30C560 45 640 20 720 35C800 50 880 25 960 40C1040 55 1120 30 1200 45C1280 60 1360 35 1440 50V60H0Z" fill="#FAFAF8"/>
        </svg>
      </div>

      {/* ── Services Grid ── */}
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{sectionEyebrow}</p>
              <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl xl:text-4xl">
                {sectionTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-[#1A2332]/60 sm:text-base">
                {sectionDescription}
              </p>
            </div>
          </Animate>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Animate key={s.title} delay={i * 80}>
                  <Link
                    href={`/what-we-do/${s.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-white transition-all duration-500 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                  >
                    {/* Image header */}
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/80 via-[#1A2332]/20 to-transparent" />
                      {/* Number badge */}
                      <div className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 font-heading text-xs text-white backdrop-blur-sm">
                        {s.number}
                      </div>
                      {/* Icon badge */}
                      <div
                        className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                        style={{ backgroundColor: `${s.color}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: s.color }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-heading text-lg text-[#1A2332]">{s.title}</h3>
                      <p className="mt-1 text-xs font-medium text-primary">{s.short}</p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#1A2332]/60">{s.description}</p>
                      <ul className="mt-3 space-y-1.5">
                        {s.highlights.map((h: string) => (
                          <li key={h} className="flex items-center gap-2 text-xs text-[#1A2332]/50">
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2.5">
                        {exploreLabel} <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </Animate>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-[#1A2332] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{stepsEyebrow}</p>
              <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl">
                {stepsTitle} <span className="text-primary">{stepsTitleHighlight}</span>
              </h2>
            </div>
          </Animate>

          <div className="relative mt-12">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 hidden w-px bg-gradient-to-b from-primary/30 via-primary/20 to-transparent lg:block" />

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Animate key={item.step} delay={i * 150}>
                    <div className="group relative text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:scale-110">
                        <Icon className="h-8 w-8 text-primary transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="mt-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-[#1A2332]">
                        {item.step}
                      </div>
                      <h3 className="mt-3 font-heading text-lg text-white">{item.title}</h3>
                      <p className="mt-2 max-w-xs mx-auto text-sm leading-relaxed text-gray-400">{item.description}</p>
                    </div>
                  </Animate>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 float-particle" style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties} />
          <div className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-white/20 float-particle" style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties} />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <Animate>
            <h2 className="font-heading text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl">
              {ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 sm:text-base">
              {ctaDescription}
            </p>
          </Animate>
          <Animate delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/get-help" className="btn-ripple inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-primary transition-all duration-300 hover:bg-[#1A2332] hover:text-white hover:shadow-xl hover:-translate-y-0.5">
                {helpCtaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5">
                {contactCtaLabel}
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
