'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Megaphone, BookOpen, Users, Heart, Shield, Phone, Target, Eye, HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSettingsMap } from '@/hooks/use-api';

const serviceIcons: Record<string, typeof Megaphone> = {
  awareness: Megaphone,
  education: BookOpen,
  referral: Users,
  community: Heart,
  vulnerable: Shield,
  research: Target,
};

const servicesFallback = [
  { icon: Megaphone, title: 'Mental Health Awareness', description: 'Campaigns and outreach to promote understanding and acceptance.', slug: 'awareness' },
  { icon: BookOpen, title: 'Mental Health Education', description: 'Workshops, talks and resources for individuals, schools and communities.', slug: 'education' },
  { icon: Users, title: 'Professional Referral', description: 'Connecting people to qualified mental health professionals.', slug: 'referral' },
  { icon: Heart, title: 'Community Support', description: 'Building safe spaces and support networks for ongoing care.', slug: 'community' },
  { icon: Shield, title: 'Vulnerable Persons', description: 'Helping those in need access care and support services.', slug: 'vulnerable' },
  { icon: Target, title: 'Research & Advocacy', description: 'Contributing to policy discussions and publishing insights that drive change.', slug: 'research' },
];

const featuresFallback = [
  {
    icon: Target,
    title: 'Creating Awareness',
    description: 'We run campaigns, public forums and outreach programmes to promote understanding and acceptance of mental health conditions in communities across Nigeria.',
    tags: ['Community forums', 'Public campaigns', 'Media engagement'],
    slug: 'awareness',
  },
  {
    icon: Eye,
    title: 'Professional Support',
    description: 'We connect individuals to licensed mental health professionals — psychologists, counsellors and psychiatrists — ensuring access to quality care.',
    tags: ['Therapist matching', 'Counselling', 'Psychiatric referrals'],
    slug: 'referral',
  },
  {
    icon: HeartHandshake,
    title: 'Community Care',
    description: 'We build safe spaces and peer support networks that provide ongoing emotional support and a sense of belonging for those navigating mental health challenges.',
    tags: ['Peer support', 'Safe spaces', 'Ongoing check-ins'],
    slug: 'community',
  },
];

export function Services() {
  const [currentService, setCurrentService] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { get, getJSON } = useSettingsMap();
  const servicesEyebrow = get('services_eyebrow', 'Our Services');
  const servicesTitle = get('services_title', 'What We Do');
  const servicesTitleHighlight = get('services_title_highlight', 'Do');
  const servicesDescription = get(
    'services_description',
    'We focus on education, support and access to ensure better mental health outcomes for individuals and communities.'
  );
  const exploreCta = get('services_explore_cta', 'Explore All Services');
  const helpCta = get('services_help_cta', 'Get Help Now');
  const phoneDisplay = get('contact_phone', '+234 805 177 2262');
  const phoneRaw = get('contact_phone_raw', '+2348051772262');
  const servicesBg = get('services_bg_image', '/images/banner/banner1.jpg');

  const rawServices = getJSON<Array<{ slug: string; title: string; short?: string; description?: string }>>('services_list', []);
  const services =
    rawServices.length > 0
      ? rawServices.map((s) => ({
          icon: serviceIcons[s.slug] || Megaphone,
          title: s.title,
          description: s.short || s.description || '',
          slug: s.slug,
        }))
      : servicesFallback;

  const rawFeatures = getJSON<Array<{ slug: string; title: string; description?: string; points?: string[]; tags?: string[] }>>('features_list', []);
  const features =
    rawFeatures.length > 0
      ? rawFeatures.slice(0, 3).map((f) => ({
          icon: serviceIcons[f.slug] || Target,
          title: f.title,
          description: f.description || '',
          tags: f.tags || f.points || [],
          slug: f.slug,
        }))
      : featuresFallback;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const nextService = useCallback(() => {
    setCurrentService((prev) => (prev + 1) % services.length);
  }, []);

  const prevService = useCallback(() => {
    setCurrentService((prev) => (prev - 1 + services.length) % services.length);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(nextService, 3000);
    return () => clearInterval(timer);
  }, [isMobile, nextService]);

  return (
    <section className="relative">
      {/* Fixed background image */}
      <div className="fixed inset-0 -z-10 h-full w-full">
        <Image
          src={servicesBg}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1A2332]/90" />
      </div>

      <div className="relative z-10">
        {/* Heading */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 pt-12 pb-8 sm:pt-20 sm:pb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{servicesEyebrow}</p>
            <h2 className="mt-3 font-heading text-2xl font-normal leading-[1.1] text-white sm:text-5xl lg:text-7xl">
              {servicesTitle.replace(/ *$/,'')} <span className="italic text-primary">{servicesTitleHighlight}</span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-300 sm:mt-6 sm:text-base">
              {servicesDescription}
            </p>
            <Link
              href="/what-we-do"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20 sm:mt-8 sm:px-7 sm:py-3.5"
            >
              {exploreCta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Service Cards */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 pb-10 lg:pb-16">
          {/* Mobile: Carousel */}
          <div className="lg:hidden">
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `translateX(-${currentService * 100}%)` }}
              >
                {services.map((s, i) => (
                  <div
                    key={s.title}
                    className="w-full shrink-0 p-1"
                  >
                    <Link href={`/what-we-do/${s.slug}`} className="block rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:-translate-y-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                        <s.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mt-4 font-heading text-base text-white">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300">{s.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">Learn More <ArrowRight className="h-3 w-3" /></span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={prevService}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextService}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-1.5">
                {services.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentService(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentService ? 'w-5 bg-primary' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 xl:grid-cols-3">
            {services.map((s, i) => (
              <Link
                key={s.title}
                href={`/what-we-do/${s.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                  <s.icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="mt-4 font-heading text-sm text-white">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-300">{s.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2.5">Learn More <ArrowRight className="h-3 w-3" /></span>
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 pb-10 lg:pb-20">
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.title}
                href={`/what-we-do/${f.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl hover:shadow-black/20 sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:scale-110 sm:h-12 sm:w-12">
                  <f.icon className="h-5 w-5 text-primary transition-colors duration-300 group-hover:text-white sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-3 font-heading text-base text-white sm:mt-4 sm:text-lg">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-300 sm:mt-2 sm:text-sm">{f.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                  {f.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/20 px-2.5 py-0.5 text-[10px] text-gray-300 transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary sm:px-3 sm:text-xs">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2.5">Learn More <ArrowRight className="h-3 w-3" /></span>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <Link
              href="/get-help"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20 sm:px-7 sm:py-3.5"
            >
              {helpCta} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white transition-colors hover:text-primary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Phone className="h-4 w-4 text-primary" />
              </span>
              {phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
