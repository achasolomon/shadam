'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Users,
  HeartHandshake,
  DollarSign,
  Share2,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Target,
  Shield,
  Globe,
} from 'lucide-react';
import { useDonationModal } from '@/components/public/donation-modal';
import { useSettingsMap } from '@/hooks/use-api';

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

const involvementWaysFallback = [
  {
    icon: Users,
    title: 'Volunteer',
    tagline: 'Give Your Time',
    description: 'Join our team of dedicated volunteers and contribute your time and skills to mental health advocacy.',
    color: '#88E788',
    bgColor: 'bg-primary/10',
    items: [
      'Community outreach and events',
      'Peer support facilitation',
      'Administrative support',
      'Social media and communications',
    ],
    cta: 'Become a Volunteer',
    ctaLink: '/contact',
  },
  {
    icon: HeartHandshake,
    title: 'Partner With Us',
    tagline: 'Grow Together',
    description: 'We collaborate with organisations, healthcare providers, schools and government bodies to expand our reach.',
    color: '#D4A843',
    bgColor: 'bg-[#D4A843]/10',
    items: [
      'Corporate wellness programmes',
      'Healthcare provider partnerships',
      'School and university collaborations',
      'NGO and government alliances',
    ],
    cta: 'Explore Partnerships',
    ctaLink: '/contact',
  },
  {
    icon: DollarSign,
    title: 'Donate',
    tagline: 'Fund Change',
    description: 'Your financial support helps us provide free counselling, run community events and reach underserved populations.',
    color: '#8B5CF6',
    bgColor: 'bg-[#8B5CF6]/10',
    items: [
      'Fund counselling sessions',
      'Sponsor community events',
      'Support school outreach',
      'Enable free resources',
    ],
    cta: 'Make a Donation',
    ctaLink: '/get-involved',
    isDonate: true,
  },
  {
    icon: Share2,
    title: 'Spread the Word',
    tagline: 'Share the Message',
    description: 'One of the simplest ways to help is by sharing our message. Talk about mental health and help us reach more people.',
    color: '#EC4899',
    bgColor: 'bg-[#EC4899]/10',
    items: [
      'Share our content on social media',
      'Start conversations about mental health',
      'Refer someone who needs help',
      'Advocate for mental health in your community',
    ],
    cta: 'Get in Touch',
    ctaLink: '/contact',
  },
];

const impactStatsFallback = [
  { value: '2,500+', label: 'People Reached', icon: Globe, keys: ['stat_people_supported', 'involve_stat_people_label'] },
  { value: '150+', label: 'Volunteers', icon: Users, keys: ['stat_volunteers', 'involve_stat_volunteers_label'] },
  { value: '50+', label: 'Events Held', icon: Target, keys: ['stat_community_events', 'involve_stat_events_label'] },
  { value: '100%', label: 'Free Services', icon: Shield, keys: ['stat_commitment', 'involve_stat_free_label'] },
];

const contactMethodsFallback = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'info@shedam.org',
    action: 'mailto:info@shedam.org',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+234 805 177 2262',
    action: 'tel:+2348051772262',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Chat with us',
    action: 'https://wa.me/2348051772262',
  },
];

export function GetInvolvedContent() {
  const { openModal: openDonation } = useDonationModal();
  const { get, getJSON } = useSettingsMap();

  const heroEyebrow = get('involve_hero_eyebrow', 'Get Involved');
  const heroTitle = get('involve_hero_title', 'Join Our');
  const heroTitleHighlight = get('involve_hero_title_highlight', 'Mission');
  const heroDescription = get('involve_hero_description', 'There are many ways to be part of the change. Whether you volunteer your time, partner with us, or contribute financially, your support makes a real difference.');
  const waysTitle = get('involve_ways_title', 'Ways to Get Involved');
  const howTitle = get('involve_how_title', 'Getting Started Is Easy');
  const howDescription = get('involve_how_description', 'Three simple steps to make a difference');
  const contactTitle = get('involve_contact_title', 'Reach Out to Us');
  const ctaTitle = get('involve_cta_title', 'Ready to Make a Difference?');
  const ctaDescription = get('involve_cta_description', 'Join us in creating a world where mental health is valued and supported for everyone.');

  const wayIcons = [Users, HeartHandshake, DollarSign, Share2];
  const involvementWays = (() => {
    const raw = getJSON<any[]>('involve_ways', []);
    const base = raw.length > 0 ? raw : involvementWaysFallback;
    return base.map((w, i) => ({ ...w, icon: w.icon || wayIcons[i % wayIcons.length] }));
  })();

  const involveSteps = getJSON<{ step: string; title: string; desc: string }[]>('involve_steps', [
    { step: '01', title: 'Choose Your Way', desc: 'Select how you want to contribute — volunteer, partner, donate or share.' },
    { step: '02', title: 'Connect With Us', desc: 'Reach out through our contact channels and we will guide you through the process.' },
    { step: '03', title: 'Make an Impact', desc: 'Start making a real difference in mental health support in your community.' },
  ]);

  const phoneRaw = get('contact_phone_raw', '+2348051772262');
  const phoneDisplay = get('contact_phone', '0805 177 2262');
  const email = get('contact_email', 'info@shedam.org');
  const whatsapp = get('contact_whatsapp', '+2348051772262');
  const whatsappHref = 'https://wa.me/' + whatsapp.replace(/[^0-9]/g, '');
  const contactMethods = [
    { ...contactMethodsFallback[0], value: email, action: `mailto:${email}` },
    { ...contactMethodsFallback[1], value: phoneDisplay, action: `tel:${phoneRaw}` },
    { ...contactMethodsFallback[2], action: whatsappHref },
  ];

  const impactStats = impactStatsFallback.map((s) => {
    const numRaw = get(s.keys[0], '');
    const num = numRaw ? String(numRaw).replace(/[^\d.]/g, '') : '';
    const label = get(s.keys[1], s.label);
    const isPct = s.value.includes('%');
    const value = num ? (isPct ? `${num}%` : `${num}+`) : s.value;
    return { ...s, value, label };
  });

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#1A2332] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 float-particle" style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties} />
          <div className="absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-primary/20 float-particle" style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties} />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-20 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {heroEyebrow}
            </div>
            <h1 className="mt-6 font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              {heroTitle} <span className="text-primary">{heroTitleHighlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg">
              {heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => openDonation({ type: 'general' })}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5"
              >
                Donate Now <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Torn Edge ── */}
      <div className="relative -mt-1 bg-[#1A2332]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full" preserveAspectRatio="none">
          <path d="M0 60V20C80 35 160 10 240 25C320 40 400 15 480 30C560 45 640 20 720 35C800 50 880 25 960 40C1040 55 1120 30 1200 45C1280 60 1360 35 1440 50V60H0Z" fill="#FAFAF8" />
        </svg>
      </div>

      {/* ── Impact Stats ── */}
      <section className="bg-[#FAFAF8] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {impactStats.map((stat, i) => (
              <Animate key={stat.label} delay={i * 100}>
                <div className="flex items-center gap-3 rounded-xl border border-[#1A2332]/5 bg-white p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading text-xl text-[#1A2332]">{stat.value}</p>
                    <p className="text-[10px] text-[#1A2332]/40">{stat.label}</p>
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ways to Get Involved ── */}
      <section className="bg-[#FAFAF8] pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="font-heading text-2xl font-normal text-[#1A2332] sm:text-3xl">{waysTitle}</h2>
            </div>
          </Animate>

          <div className="grid gap-5 sm:grid-cols-2">
            {involvementWays.map((way, i) => (
              <Animate key={way.title} delay={i * 100}>
                <div className="group relative overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 sm:p-8">
                  {/* Accent line */}
                  <div className="absolute top-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: way.color }} />

                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${way.bgColor}`}>
                      <way.icon className="h-6 w-6" style={{ color: way.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: way.color }}>
                        {way.tagline}
                      </p>
                      <h3 className="mt-1 font-heading text-lg text-[#1A2332] sm:text-xl">
                        {way.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#1A2332]/50">
                    {way.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {way.items.map((item: string) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#1A2332]/60">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: way.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    {way.isDonate ? (
                      <button
                        onClick={() => openDonation({ type: 'general' })}
                        className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3"
                        style={{ color: way.color }}
                      >
                        {way.cta} <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <Link
                        href={way.ctaLink}
                        className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3"
                        style={{ color: way.color }}
                      >
                        {way.cta} <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <Target className="h-3.5 w-3.5" />
                How It Works
              </div>
              <h2 className="mt-4 font-heading text-2xl text-[#1A2332] sm:text-3xl">{howTitle}</h2>
              <p className="mt-3 text-sm text-[#1A2332]/50">{howDescription}</p>
            </div>
          </Animate>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {involveSteps.map((item, i) => (
              <Animate key={item.step} delay={i * 150}>
                <div className="relative text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A2332]">
                    <span className="font-heading text-xl text-primary">{item.step}</span>
                  </div>
                  {i < 2 && (
                    <div className="absolute top-8 left-[60%] hidden h-px w-[80%] bg-[#1A2332]/10 sm:block" />
                  )}
                  <h3 className="mt-4 font-heading text-base text-[#1A2332]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#1A2332]/50">{item.desc}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Methods ── */}
      <section className="bg-[#FAFAF8] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="font-heading text-2xl font-normal text-[#1A2332] sm:text-3xl">{contactTitle}</h2>
            </div>
          </Animate>

          <div className="grid gap-4 sm:grid-cols-3">
            {contactMethods.map((method, i) => (
              <Animate key={method.label} delay={i * 100}>
                <Link
                  href={method.action}
                  target={method.action.startsWith('http') ? '_blank' : undefined}
                  rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-[#1A2332]/5 bg-white p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <method.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2332]/40">{method.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-[#1A2332] group-hover:text-primary transition-colors">{method.value}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#1A2332]/20 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Animate>
            ))}
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
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => openDonation({ type: 'general' })}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5"
              >
                Donate Now <Heart className="h-4 w-4" />
              </button>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
