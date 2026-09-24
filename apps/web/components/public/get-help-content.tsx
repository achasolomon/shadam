'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Shield,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Users,
  Headphones,
  FileText,
  ArrowUpRight,
} from 'lucide-react';
import { useResources, useSettingsMap } from '@/hooks/use-api';

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

const helplinesFallback = [
  {
    name: 'SHEDAM Support Line',
    number: '+2348051772262',
    display: '0805 177 2262',
    available: '24/7',
    primary: true,
    icon: Headphones,
    description: 'Free, confidential support from trained professionals',
  },
  {
    name: 'Mental Health Foundation Nigeria',
    number: '08008002000',
    display: '0800 800 2000',
    available: '24/7',
    primary: false,
    icon: Phone,
    description: 'Toll-free mental health helpline',
  },
  {
    name: 'Lagos State Emergency',
    number: '112',
    display: '112',
    available: '24/7',
    primary: false,
    icon: Shield,
    description: 'Emergency services for immediate danger',
  },
];

const supportChannelsFallback = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    description: 'Chat with us confidentially',
    action: 'https://wa.me/2348051772262',
    color: '#25D366',
    available: '24/7',
  },
  {
    icon: Mail,
    label: 'Email Support',
    description: 'Send us a message anytime',
    action: 'mailto:support@shedam.org',
    color: '#3B82F6',
    available: 'Response within 24hrs',
  },
  {
    icon: Phone,
    label: 'Phone Call',
    description: 'Speak with someone now',
    action: 'tel:+2348051772262',
    color: '#88E788',
    available: '24/7',
  },
];

const warningSignsFallback = [
  'Persistent sadness or hopelessness',
  'Withdrawal from friends and activities',
  'Dramatic changes in eating or sleeping',
  'Extreme mood swings or irritability',
  'Increased use of alcohol or drugs',
  'Talking about wanting to die',
  'Giving away prized possessions',
  'Sudden calmness after depression',
];

const selfCareStepsFallback = [
  {
    step: '01',
    title: 'Acknowledge Your Feelings',
    desc: 'It is okay to not feel okay. Recognise what you are going through.',
  },
  {
    step: '02',
    title: 'Talk to Someone You Trust',
    desc: 'Share your feelings with a friend, family member or counsellor.',
  },
  {
    step: '03',
    title: 'Reach Out for Professional Help',
    desc: 'Contact our helpline or a mental health professional.',
  },
  {
    step: '04',
    title: 'Take It One Day at a Time',
    desc: 'Recovery is a journey. Be patient with yourself.',
  },
];

const resourcesFallback = [
  {
    icon: BookOpen,
    title: 'What is Mental Health?',
    desc: 'Understanding the basics of mental health and why it matters.',
    link: '/insights/understanding-mental-health',
  },
  {
    icon: AlertTriangle,
    title: 'Recognising Warning Signs',
    desc: 'Learn to identify when you or someone you know needs help.',
    link: '/insights/breaking-stigma-around-mental-health',
  },
  {
    icon: Users,
    title: 'Supporting Someone You Love',
    desc: 'How to be there for someone going through a mental health challenge.',
    link: '/insights/supporting-children-mental-health',
  },
  {
    icon: Heart,
    title: 'Self-Care Strategies',
    desc: 'Simple daily habits to improve your mental wellbeing.',
    link: '/insights/self-care-mental-health',
  },
  {
    icon: FileText,
    title: 'Workplace Mental Health',
    desc: 'Creating a mentally healthy environment at work.',
    link: '/insights/workplace-mental-health',
  },
  {
    icon: Headphones,
    title: 'Youth Mental Health',
    desc: 'Supporting young people through mental health challenges.',
    link: '/insights/youth-mental-health-crisis',
  },
];

export function GetHelpContent() {
  const { data: apiResources, source: resourceSource } = useResources();
  const { get, getJSON } = useSettingsMap();

  const heroEyebrow = get('help_hero_eyebrow', 'You Are Not Alone');
  const heroTitle = get('help_hero_title', 'We Are Here');
  const heroTitleHighlight = get('help_hero_title_highlight', 'For You');
  const heroDescription = get('help_hero_description', 'Whether you are going through a difficult time, need someone to talk to, or want to help a loved one — we are here to support you every step of the way.');
  const helplinesTitle = get('help_helplines_title', 'Helplines');
  const channelsTitle = get('help_channels_title', 'Other Ways to Reach Us');
  const warningTitle = get('help_warning_title', 'Warning Signs to Watch For');
  const warningDescription = get('help_warning_description', 'If you or someone you know is showing these signs, it may be time to reach out for help.');
  const crisisTitle = get('help_crisis_title', 'In Crisis or Immediate Danger?');
  const crisisDescription = get('help_crisis_description', 'If you or someone you know is in immediate danger, please call emergency services right now or go to the nearest hospital emergency room.');
  const stepsEyebrow = get('help_steps_eyebrow', 'Taking the First Step');
  const stepsTitle = get('help_steps_title', 'How to Get Help');
  const stepsDescription = get('help_steps_description', 'Taking the first step is brave. Here is how we can support you.');
  const resourcesTitle = get('help_resources_title', 'Mental Health Resources');
  const ctaTitle = get('help_cta_title', 'Taking the First Step Is Brave');
  const ctaDescription = get('help_cta_description', 'You do not have to face this alone. We are here to listen, support and guide you towards the help you deserve.');
  const phoneRaw = get('contact_phone_raw', '+2348051772262');
  const phoneDisplay = get('contact_phone', '0805 177 2262');
  const whatsapp = get('contact_whatsapp', '+2348051772262');
  const whatsappHref = 'https://wa.me/' + whatsapp.replace(/[^0-9]/g, '');

  const helplinesFallbackWithIcons = helplinesFallback.map((h, i) => ({
    ...h,
    icon: h.primary ? Headphones : i === 1 ? Phone : Shield,
  }));
  const helplines = (() => {
    const raw = getJSON<any[]>('help_helplines', []);
    if (raw.length === 0) return helplinesFallbackWithIcons;
    return raw.map((h, i) => ({
      ...h,
      icon: h.primary ? Headphones : i === 1 ? Phone : Shield,
    }));
  })();

  const channelIcons = [MessageCircle, Mail, Phone];
  const supportChannels = (() => {
    const raw = getJSON<any[]>('help_channels', []);
    const base = raw.length > 0 ? raw : supportChannelsFallback;
    return base.map((ch, i) => ({ ...ch, icon: ch.icon || channelIcons[i % channelIcons.length] }));
  })();

  const warningSigns = getJSON<string[]>('help_warning_signs', warningSignsFallback);
  const selfCareSteps = getJSON<any[]>('help_self_care_steps', selfCareStepsFallback);

  const resourceList =
    resourceSource === 'api' && apiResources.length > 0
      ? apiResources.slice(0, 6).map((r: any) => ({
          icon: BookOpen,
          title: r.title,
          desc: r.description || '',
          link:
            r.resourceType === 'ARTICLE'
              ? `/resources/${r.id}`
              : r.fileUrl || r.url || '/resources',
        }))
      : resourcesFallback;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#1A2332] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 float-particle" style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties} />
          <div className="absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-primary/20 float-particle" style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties} />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-20 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
              <Heart className="h-3.5 w-3.5" />
              {heroEyebrow}
            </div>
            <h1 className="mt-6 font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl xl:text-6xl">
              {heroTitle} <span className="text-primary">{heroTitleHighlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg">
              {heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`tel:${phoneRaw}`}
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Torn Edge ── */}
      <div className="relative -mt-1 bg-[#1A2332]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full" preserveAspectRatio="none">
          <path d="M0 60V20C80 35 160 10 240 25C320 40 400 15 480 30C560 45 640 20 720 35C800 50 880 25 960 40C1040 55 1120 30 1200 45C1280 60 1360 35 1440 50V60H0Z" fill="#FEF2F2" />
        </svg>
      </div>

      {/* ── Crisis Alert ── */}
      <section className="bg-[#FEF2F2] py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-lg shadow-red-100/50">
              <div className="flex items-start gap-4 p-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-lg text-red-600">{crisisTitle}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#1A2332]/60">
                    {crisisDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="tel:112"
                      className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200"
                    >
                      <Phone className="h-4 w-4" />
                      Call 112 Now
                    </a>
                    <a
                      href={`tel:${phoneRaw}`}
                      className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-50"
                    >
                      <Phone className="h-4 w-4" />
                      SHEDAM: {phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Animate>
        </div>
      </section>

      {/* ── Helplines ── */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="font-heading text-2xl font-normal text-[#1A2332] sm:text-3xl">{helplinesTitle}</h2>
            </div>
          </Animate>

          <div className="grid gap-4 sm:grid-cols-3">
            {helplines.map((line, i) => (
              <Animate key={line.name} delay={i * 100}>
                <a
                  href={`tel:${line.number}`}
                  className={`group flex flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
                    line.primary
                      ? 'border-primary/20 bg-primary/5 hover:border-primary/40 hover:shadow-primary/10'
                      : 'border-[#1A2332]/5 bg-white hover:border-primary/20 hover:shadow-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      line.primary ? 'bg-primary/20' : 'bg-[#1A2332]/5'
                    }`}>
                      <line.icon className={`h-5 w-5 ${line.primary ? 'text-primary' : 'text-[#1A2332]/40'}`} />
                    </div>
                    {line.primary && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-semibold text-primary">
                        24/7
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-heading text-base text-[#1A2332]">{line.name}</h3>
                  <p className="mt-1 text-xs text-[#1A2332]/40">{line.description}</p>
                  <p className={`mt-3 font-heading text-2xl ${line.primary ? 'text-primary' : 'text-[#1A2332]'}`}>
                    {line.display}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#1A2332]/40">
                    <Clock className="h-3 w-3" />
                    Available {line.available}
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2.5">
                      Call Now <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Support Channels ── */}
      <section className="bg-[#FAFAF8] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="font-heading text-2xl font-normal text-[#1A2332] sm:text-3xl">{channelsTitle}</h2>
            </div>
          </Animate>

          <div className="grid gap-4 sm:grid-cols-3">
            {supportChannels.map((ch, i) => (
              <Animate key={ch.label} delay={i * 100}>
                <Link
                  href={ch.action}
                  target={ch.action.startsWith('http') ? '_blank' : undefined}
                  rel={ch.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-[#1A2332]/5 bg-white p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors" style={{ backgroundColor: `${ch.color}15` }}>
                    <ch.icon className="h-5 w-5" style={{ color: ch.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A2332] group-hover:text-primary transition-colors">{ch.label}</p>
                    <p className="text-xs text-[#1A2332]/40">{ch.description}</p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-[#1A2332]/30">
                      <Clock className="h-2.5 w-2.5" /> {ch.available}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#1A2332]/20 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Warning Signs ── */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1px_340px]">
            <div>
              <Animate>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 rounded-full bg-[#F59E0B]" />
                  <h2 className="font-heading text-2xl font-normal text-[#1A2332] sm:text-3xl">{warningTitle}</h2>
                </div>
                <p className="text-sm text-[#1A2332]/50 mb-6">
                  {warningDescription}
                </p>
              </Animate>

              <div className="grid gap-3 sm:grid-cols-2">
                {warningSigns.map((sign, i) => (
                  <Animate key={sign} delay={i * 60}>
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#1A2332]/5 bg-[#FEF2F2] p-3.5">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                      <span className="text-sm text-[#1A2332]/70">{sign}</span>
                    </div>
                  </Animate>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block bg-[#1A2332]/10" />
            <aside className="lg:pl-8 lg:sticky lg:top-24 lg:self-start">
              <Animate delay={200}>
                <div className="rounded-2xl bg-[#FEF2F2] border border-red-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-red-500" />
                    <h3 className="font-heading text-sm font-normal text-[#1A2332]">Need Immediate Help?</h3>
                  </div>
                  <p className="text-xs text-[#1A2332]/50">
                    If you are in crisis, do not wait. Reach out now.
                  </p>
                  <div className="mt-4 space-y-2">
                    <a
                      href="tel:112"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-600"
                    >
                      <Phone className="h-4 w-4" />
                      Call 112
                    </a>
                    <a
                      href={`tel:${phoneRaw}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                    >
                      <Phone className="h-4 w-4" />
                      SHEDAM Line
                    </a>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 px-4 py-2.5 text-sm font-medium text-green-600 transition-all hover:bg-green-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </Animate>
            </aside>
          </div>
        </div>
      </section>

      {/* ── How to Get Help (Steps) ── */}
      <section className="bg-[#FAFAF8] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {stepsEyebrow}
              </div>
              <h2 className="mt-4 font-heading text-2xl text-[#1A2332] sm:text-3xl">{stepsTitle}</h2>
              <p className="mt-3 text-sm text-[#1A2332]/50">
                {stepsDescription}
              </p>
            </div>
          </Animate>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {selfCareSteps.map((item, i) => (
              <Animate key={item.step} delay={i * 100}>
                <div className="relative rounded-2xl border border-[#1A2332]/5 bg-white p-5 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A2332]">
                    <span className="font-heading text-sm text-primary">{item.step}</span>
                  </div>
                  {i < 3 && (
                    <div className="absolute top-10 left-[65%] hidden h-px w-[70%] border-t border-dashed border-[#1A2332]/10 lg:block" />
                  )}
                  <h3 className="mt-3 font-heading text-sm text-[#1A2332]">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-[#1A2332]/50">{item.desc}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="font-heading text-2xl font-normal text-[#1A2332] sm:text-3xl">{resourcesTitle}</h2>
            </div>
          </Animate>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resourceList.map((res, i) => (
              <Animate key={res.title} delay={i * 80}>
                <Link
                  href={res.link}
                  className="group flex items-start gap-3 rounded-2xl border border-[#1A2332]/5 bg-[#FAFAF8] p-5 transition-all duration-300 hover:border-primary/20 hover:bg-white hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <res.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#1A2332] group-hover:text-primary transition-colors">
                      {res.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#1A2332]/50 line-clamp-2">
                      {res.desc}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Read More <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
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
              <a
                href={`tel:${phoneRaw}`}
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                Call Us Now
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
