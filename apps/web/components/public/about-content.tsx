'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Target,
  Eye,
  Users,
  Heart,
  Shield,
  BookOpen,
  Sparkles,
  HeartHandshake,
  Globe,
  TrendingUp,
  GraduationCap,
  Stethoscope,
  Megaphone,
  Scale,
} from 'lucide-react';
import { useTeam, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const foundersFallback = [
  {
    name: 'Rev. Fr. Istifanus Sheyin',
    role: 'Co-Founder',
    bio: 'Clinical Psychologist with extensive pastoral experience and professional training in mental health.',
    image: '/images/banner/banner3.jpeg',
  },
  {
    name: 'Rev. Fr. Dr. Christopher Damina',
    role: 'Co-Founder',
    bio: 'Professional in Guidance and Counselling with deep commitment to holistic human wellbeing.',
    image: '/images/banner/banner2.jpg',
  },
];

const teamFallback = [
  {
    name: 'Rev. Fr. Istifanus Sheyin',
    role: 'Co-Founder',
    bio: 'Clinical Psychologist with extensive pastoral experience and professional training in mental health.',
    image: '/images/banner/banner3.jpeg',
  },
  {
    name: 'Rev. Fr. Dr. Christopher Damina',
    role: 'Co-Founder',
    bio: 'Professional in Guidance and Counselling with deep commitment to holistic human wellbeing.',
    image: '/images/banner/banner2.jpg',
  },
];

const milestonesFallback = [
  { year: '2020', title: 'SHEDAM Founded', description: 'Rev. Fr. Istifanus Sheyin and Rev. Fr. Dr. Christopher Damina establish SHEDAM Mental Health Initiative to bridge the mental health gap in Nigeria.', icon: Sparkles },
  { year: '2021', title: 'First Community Forum', description: 'Hosted our inaugural community awareness forum in Kubwa, Abuja, reaching 200+ attendees and sparking important conversations about mental health.', icon: Users },
  { year: '2022', title: 'Referral Network Established', description: 'Partnered with licensed therapists, psychiatrists, and counsellors to create professional referral pathways for those in need.', icon: Shield },
  { year: '2023', title: 'School Outreach Programme', description: 'Launched mental health education workshops in secondary schools across FCT, reaching over 2,000 students and teachers.', icon: GraduationCap },
  { year: '2024', title: 'National Recognition', description: 'Recognized by the Nigerian Psychological Association for outstanding community mental health work and advocacy.', icon: TrendingUp },
];

const valuesFallback = [
  { name: 'Compassion', description: 'We serve every individual with empathy, kindness, respect, and genuine concern, recognizing the inherent dignity of every person.', icon: Heart },
  { name: 'Professional Excellence', description: 'We are committed to evidence-based practice, competence, innovation, and the highest ethical standards in mental healthcare.', icon: Shield },
  { name: 'Human Dignity', description: 'Every individual deserves respect, acceptance, inclusion, and equitable access to quality mental healthcare, free from stigma.', icon: Users },
  { name: 'Integrity', description: 'We uphold honesty, transparency, accountability, confidentiality, and responsible stewardship in all aspects of our work.', icon: Scale },
  { name: 'Collaboration', description: 'Lasting improvements in mental health require effective partnerships among professionals, governments, communities, and families.', icon: Users },
  { name: 'Inclusiveness', description: 'Our programmes and services are accessible to all persons regardless of age, gender, ethnicity, religion, or socioeconomic status.', icon: Globe },
  { name: 'Advocacy', description: 'We actively promote policies and public awareness that protect the rights, dignity, and wellbeing of people with mental health conditions.', icon: Megaphone },
  { name: 'Service', description: 'We are driven by a commitment to improving lives, strengthening families, empowering communities, and building resilient societies.', icon: HeartHandshake },
];

const areasFallback = [
  { title: 'Mental Health Awareness', description: 'Public education, conferences, seminars, media campaigns, and community outreach to promote mental health literacy and reduce stigma.', icon: Megaphone },
  { title: 'Professional Referral', description: 'Connecting individuals with qualified psychologists, psychiatrists, counsellors, and rehabilitation centres through trusted referral pathways.', icon: Stethoscope },
  { title: 'Psycho-Spiritual Care', description: 'Responsible collaboration between mental health professionals and faith leaders for holistic wellbeing, complementing professional care.', icon: Heart },
  { title: 'Indigent Support', description: 'Free or subsidized assessments, counselling, therapy, and medication support for economically disadvantaged individuals.', icon: HeartHandshake },
  { title: 'Rescue & Rehabilitation', description: 'Supporting rescue, treatment, family reunification, and community reintegration of persons with untreated mental illness.', icon: HeartHandshake },
  { title: 'School Programmes', description: 'Mental health education, peer support, anti-bullying programmes, and early identification systems in educational institutions.', icon: GraduationCap },
];

const statsFallback = [
  { key: 'stat_people_supported', end: 500, suffix: '+', label: 'Lives Touched' },
  { key: 'stat_community_events', end: 20, suffix: '+', label: 'Programmes Run' },
  { key: 'stat_volunteers', end: 50, suffix: '+', label: 'Volunteers' },
  { key: 'stat_commitment', end: 100, suffix: '%', label: 'Commitment' },
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

function Animate({ children, className = '', animation = 'animate-fade-up', delay = 0 }: { children: React.ReactNode; className?: string; animation?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`${animation} ${visible ? 'animate-in' : 'animate-hidden'} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function AboutTeamCard({ person }: { person: any }) {
  const href = person.slug ? `/team/${person.slug}` : '/team';
  const card = (
    <>
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image src={person.image} alt={person.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A2332]/60 opacity-0 transition-all duration-500 group-hover:opacity-100 backdrop-blur-sm">
          <span className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-[#1A2332]">View profile</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-base text-white">{person.name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">{person.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">{person.bio}</p>
      </div>
    </>
  );
  const cls = 'group relative block overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.06] hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5';
  if (person.slug) {
    return (
      <Link href={href} className={cls}>
        {card}
      </Link>
    );
  }
  return <div className={cls}>{card}</div>;
}

function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const { ref, visible } = useInView();
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!visible || hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [visible, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function MottoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { get } = useSettingsMap();
  const mottoEyebrow = get('motto_eyebrow', 'Our Motto');
  const mottoPart1 = get('motto_part1', 'Creating Awareness.');
  const mottoPart2 = get('motto_part2', 'Breaking the Stigma.');
  const mottoPart3 = get('motto_part3', 'Connecting People to Professional Help.');
  const mottoSub = get('motto_sub', 'Guided by compassion and professional excellence, SHEDAM works to ensure that every person has access to the mental health support they deserve.');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`relative overflow-hidden bg-[#1A2332] pb-24 pt-16 lg:pb-32 lg:pt-24 ${visible ? 'motto-visible' : ''}`}>
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[150px]" />
        <div className="absolute -left-20 top-0 h-[200px] w-[200px] rounded-full bg-primary/[0.03] blur-[80px]" />
        <div className="absolute -right-20 bottom-0 h-[200px] w-[200px] rounded-full bg-primary/[0.03] blur-[80px]" />
      </div>
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-20">
        <div className="motto-quote mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 lg:mb-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary">
            <path d="M10 8c-1.1 0-2 .9-2 2v4h4v-4H8c0-1.1.9-2 2-2V6c-2.2 0-4 1.8-4 4v8h8v-8c0-1.1-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2v4h4v-4h-4c0-1.1.9-2 2-2V6c-2.2 0-4 1.8-4 4v8h8v-8c0-1.1-.9-2-2-2z" fill="currentColor"/>
          </svg>
        </div>
        <p className="motto-eyebrow text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">{mottoEyebrow}</p>
        <div className="mt-5 space-y-1 sm:space-y-2 lg:mt-6">
          <h2 className="motto-part-1 font-heading text-2xl text-white/90 sm:text-3xl lg:text-4xl xl:text-5xl">{mottoPart1}</h2>
          <h2 className="motto-part-2 font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
            <span className="bg-gradient-to-r from-primary via-[#6BCF6B] to-primary bg-clip-text text-transparent">{mottoPart2}</span>
          </h2>
          <h2 className="motto-part-3 font-heading text-2xl text-white/90 sm:text-3xl lg:text-4xl xl:text-5xl">{mottoPart3}</h2>
        </div>
        <div className="motto-divider mx-auto mt-8 flex items-center gap-3 lg:mt-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
          <div className="h-2 w-2 rotate-45 bg-primary/40" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
        </div>
        <p className="motto-sub mx-auto mt-6 max-w-2xl text-sm text-gray-400/80 sm:text-base lg:mt-8">
          {mottoSub}
        </p>
      </div>
      <div className="absolute left-[15%] top-16 h-1.5 w-1.5 rounded-full bg-primary/20 float-particle" style={{ '--duration': '4s', '--delay': '0s' } as React.CSSProperties} />
      <div className="absolute bottom-20 right-[20%] h-2 w-2 rounded-full bg-primary/15 float-particle" style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties} />
      <div className="absolute right-[10%] top-1/2 h-1 w-1 rounded-full bg-primary/25 float-particle" style={{ '--duration': '3.5s', '--delay': '0.5s' } as React.CSSProperties} />
    </section>
  );
}

export function AboutContent() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { setHeroLoaded(true); }, []);

  const { data: apiTeam, source: teamSource } = useTeam();
  const { get, getJSON } = useSettingsMap();

  const heroEyebrow = get('about_hero_eyebrow', 'About SHEDAM');
  const heroTitle = get('about_hero_title', 'Our Story of');
  const heroTitleHighlight = get('about_hero_title_highlight', 'Hope & Healing');
  const heroDescription = get('about_hero_description', 'Founded by Rev. Fr. Istifanus Sheyin and Rev. Fr. Dr. Christopher Damina, SHEDAM Mental Health Initiative exists to ensure no one faces their mental health challenges alone.');
  const whoTitle = get('about_who_title', 'A Multidisciplinary Organisation');
  const whoParagraphs = (get('about_who_paragraphs', '') || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const missionMore = get('about_mission_more', '');
  const visionMore = get('about_vision_more', '');
  const yearsLabel = get('about_years_label', 'Years of Impact');
  const valuesTitle = get('about_values_title', 'What Guides Us');
  const valuesDescription = get('about_values_description', 'These principles shape every decision we make and every programme we run.');
  const areasEyebrow = get('about_areas_eyebrow', 'What We Do');
  const areasTitle = get('about_areas_title', 'Areas of Intervention');
  const areasDescription = get('about_areas_description', 'A holistic, multidisciplinary approach to promoting mental wellbeing and improving access to quality mental healthcare.');
  const journeyEyebrow = get('about_journey_eyebrow', 'Our Journey');
  const journeyTitle = get('about_journey_title', 'Milestones That Define Us');
  const foundersEyebrow = get('founders_eyebrow', 'Our Founders');
  const foundersTitle = get('founders_title', 'The Vision Behind SHEDAM');
  const foundersDescription = get('founders_description', 'Catholic priests with extensive pastoral experience and professional training in mental health, whose experience showed that many individuals require timely, evidence-based psychological care.');
  const teamTitle = get('about_team_title', 'The People Behind SHEDAM');
  const mottoEyebrow = get('motto_eyebrow', 'Our Motto');
  const mottoPart1 = get('motto_part1', 'Creating Awareness.');
  const mottoPart2 = get('motto_part2', 'Breaking the Stigma.');
  const mottoPart3 = get('motto_part3', 'Connecting People to Professional Help.');
  const mottoSub = get('motto_sub', 'Guided by compassion and professional excellence, SHEDAM works to ensure that every person has access to the mental health support they deserve.');
  const ctaTitle = get('about_cta_title', 'Join Our Mission');
  const ctaDescription = get('about_cta_description', 'Whether you volunteer, partner with us, or spread the word, you can make a real difference in someone\u2019s life.');

  const rawValues = getJSON<{ name: string; description: string }[]>('about_values', []);
  const stats = statsFallback.map((s) => {
    const raw = get(s.key, '');
    const num = raw ? Number(String(raw).replace(/[^\d.]/g, '')) : NaN;
    return { ...s, end: Number.isFinite(num) && num > 0 ? num : s.end };
  });
  const values = rawValues.length > 0
    ? rawValues.map((v, i) => ({ ...v, icon: valuesFallback[i]?.icon || Heart }))
    : valuesFallback;
  const rawAreas = getJSON<{ title: string; description: string }[]>('about_areas', []);
  const areas = rawAreas.length > 0
    ? rawAreas.map((a, i) => ({ ...a, icon: areasFallback[i]?.icon || Megaphone }))
    : areasFallback;
  const rawMilestones = getJSON<{ year: string; title: string; description: string }[]>('about_milestones', []);
  const milestoneIcons = [Sparkles, Users, Shield, GraduationCap, TrendingUp];
  const milestones = rawMilestones.length > 0
    ? rawMilestones.map((m, i) => ({ ...m, icon: milestoneIcons[i] || Sparkles }))
    : milestonesFallback;

  const apiMapped =
    teamSource === 'api' && apiTeam.length > 0
      ? apiTeam.map((m: any) => ({
          id: m.id,
          slug: m.slug || '',
          name: m.name,
          role: m.role || m.position || 'Team Member',
          bio: m.bio || m.description || '',
          image: resolveMediaUrl(m.photoUrl) || '/images/banner/banner3.jpeg',
        }))
      : [];
  const founders = apiMapped.length > 0
    ? apiMapped.filter((m: any) => /founder/i.test(m.role))
    : foundersFallback;
  const team = apiMapped.length > 0
    ? apiMapped.filter((m: any) => !/founder/i.test(m.role))
    : teamFallback;
  const teamList = team.length >= 2 ? team : teamFallback;
  const foundersList = founders.length > 0 ? founders : foundersFallback;

  const whoContent = whoParagraphs.length > 0 ? whoParagraphs : [
    'SHEDAM Mental Health Initiative (SMHI) is a non-profit, non-governmental, multidisciplinary organisation dedicated to promoting mental wellbeing through awareness, education, prevention, early intervention, advocacy, research, professional referral, and improved access to quality mental healthcare.',
    'Founded by Rev. Fr. Istifanus Sheyin, a Clinical Psychologist, and Rev. Fr. Dr. Christopher Damina, a professional in Guidance and Counselling, SHEDAM was established to complement pastoral care by promoting professional mental healthcare while recognising the positive contribution of healthy spirituality to holistic human wellbeing.',
    'We bring together clinical psychologists, psychiatrists, counsellors, social workers, educators, researchers, and public health professionals who share a common commitment to advancing mental wellbeing through multidisciplinary collaboration.',
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
        <div className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
          <Image src="/images/banner/hero-banner.png" alt="SHEDAM Team" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2332]/90 via-[#1A2332]/70 to-[#1A2332]/50" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-20">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm transition-all duration-700 delay-300 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Heart className="h-3.5 w-3.5 animate-pulse" />
              {heroEyebrow}
            </div>
            <h1 className={`mt-6 font-heading text-3xl font-normal text-white sm:text-4xl lg:text-5xl xl:text-6xl transition-all duration-700 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {heroTitle} <span className="text-primary">{heroTitleHighlight}</span>
            </h1>
            <p className={`mt-6 max-w-lg text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg transition-all duration-700 delay-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {heroDescription}
            </p>
            <div className={`mt-8 flex flex-wrap gap-3 transition-all duration-700 delay-[900ms] ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Link href="/get-involved" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20">
                Join Our Mission <ArrowRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/40">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-10 h-2 w-2 rounded-full bg-primary/40 float-particle" style={{ '--duration': '3s', '--delay': '0s' } as React.CSSProperties} />
        <div className="absolute top-40 right-32 h-1.5 w-1.5 rounded-full bg-primary/30 float-particle" style={{ '--duration': '4s', '--delay': '1s' } as React.CSSProperties} />
        <div className="absolute bottom-32 right-20 h-2.5 w-2.5 rounded-full bg-primary/20 float-particle" style={{ '--duration': '3.5s', '--delay': '0.5s' } as React.CSSProperties} />
      </section>

      {/* ── Torn Edge ── */}
      <div className="relative -mt-1 bg-[#1A2332]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full" preserveAspectRatio="none">
          <path d="M0 60V20C80 35 160 10 240 25C320 40 400 15 480 30C560 45 640 20 720 35C800 50 880 25 960 40C1040 55 1120 30 1200 45C1280 60 1360 35 1440 50V60H0Z" fill="#FAFAF8"/>
        </svg>
      </div>

      {/* ── Stats ── */}
      <section className="bg-warm-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Animate key={s.label} delay={i * 100} animation="animate-fade-up">
                <div className="text-center group cursor-default">
                  <p className="font-heading text-3xl text-primary lg:text-4xl transition-transform duration-300 group-hover:scale-110">
                    <CountUp end={s.end} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#1A2332]/50 sm:text-sm">{s.label}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Stacking Cards over Motto ── */}
      <div className="relative">
        {/* Sticky Motto background */}
        <div className="sticky top-0 z-0">
          <MottoSection />
        </div>

        {/* Stacking cards */}
        <div className="relative z-10 -mt-8 lg:-mt-16">
          {/* Card 1: Who We Are */}
          <div id="who-we-are" className="scroll-mt-24">
            <div className="sticky-card" style={{ '--card-index': 0, '--card-top': '40px' } as React.CSSProperties}>
            <div className="bg-warm-white p-6 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Who We Are</p>
                  <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl xl:text-4xl">
                    {whoTitle}
                  </h2>
                  {whoContent.map((paragraph, pi) => (
                    <p key={pi} className={`text-sm leading-relaxed text-[#1A2332]/60 sm:text-base ${pi === 0 ? 'mt-5' : 'mt-4'}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="relative">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src="/images/projects/community-outreach.jpg" alt="Community outreach event" fill className="object-cover" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-[#1A2332] p-5 shadow-xl lg:block border border-glow">
                    <p className="font-heading text-2xl text-primary"><CountUp end={5} suffix="+" /></p>
                    <p className="text-xs text-gray-400">{yearsLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Card 2: Mission / Vision */}
          <div id="mission" className="scroll-mt-24">
            <div className="sticky-card" style={{ '--card-index': 1, '--card-top': '80px' } as React.CSSProperties}>
            <div className="bg-warm-white p-6 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="group rounded-2xl border border-[#1A2332]/5 bg-white p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                    <Target className="h-7 w-7 text-primary transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <h2 className="mt-6 font-heading text-xl text-[#1A2332] sm:text-2xl">Our Mission</h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#1A2332]/60 sm:text-base">
                    {get('about_mission', 'To promote mental wellbeing by advancing mental health awareness, reducing stigma, improving mental health literacy, facilitating access to quality, affordable, and evidence-based mental healthcare, and fostering multidisciplinary collaboration among professionals, institutions, communities, and development partners.')}
                  </p>
                  {missionMore && (
                    <p className="mt-3 text-sm leading-relaxed text-[#1A2332]/60 sm:text-base">
                      {missionMore}
                    </p>
                  )}
                </div>
                <div className="group rounded-2xl border border-[#1A2332]/5 bg-white p-8 transition-all duration-500 hover:border-[#D4A843]/20 hover:shadow-lg hover:shadow-[#D4A843]/5 hover:-translate-y-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#D4A843]/10 transition-all duration-500 group-hover:bg-[#D4A843] group-hover:scale-110 group-hover:-rotate-6">
                    <Eye className="h-7 w-7 text-[#D4A843] transition-colors duration-500 group-hover:text-white" />
                  </div>
                  <h2 className="mt-6 font-heading text-xl text-[#1A2332] sm:text-2xl">Our Vision</h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#1A2332]/60 sm:text-base">
                    {get('about_vision', 'A society where mental health is understood, openly discussed, and valued as an essential component of overall health and human wellbeing; where every person experiencing mental health challenges is treated with dignity, compassion, and respect; where stigma no longer prevents people from seeking professional help; and where everyone has equitable access to quality mental healthcare regardless of social, cultural, religious, or economic background.')}
                  </p>
                  {visionMore && (
                    <p className="mt-3 text-sm leading-relaxed text-[#1A2332]/60 sm:text-base">
                      {visionMore}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Card 3: Values */}
          <div id="values" className="scroll-mt-24">
            <div className="sticky-card" style={{ '--card-index': 2, '--card-top': '120px' } as React.CSSProperties}>
            <div className="bg-[#1A2332] p-6 sm:p-8 lg:p-10">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our Core Values</p>
                <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl">{valuesTitle}</h2>
                <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400 sm:text-base">
                  {valuesDescription}
                </p>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div key={v.name} className="group rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 cursor-default">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                        <Icon className="h-5 w-5 text-primary transition-colors duration-500 group-hover:text-white" />
                      </div>
                      <h3 className="mt-3 font-heading text-sm text-white sm:text-base">{v.name}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-400 sm:text-sm">{v.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ── Areas of Intervention ── */}
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{areasEyebrow}</p>
              <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl xl:text-4xl">
                {areasTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-[#1A2332]/60 sm:text-base">
                {areasDescription}
              </p>
            </div>
          </Animate>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a, i) => {
              const Icon = a.icon;
              return (
                <Animate key={a.title} delay={i * 80} animation="animate-fade-up">
                  <div className="group h-full rounded-2xl border border-[#1A2332]/5 bg-white p-6 transition-all duration-500 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="h-6 w-6 text-primary transition-colors duration-500 group-hover:text-white" />
                    </div>
                    <h3 className="mt-4 font-heading text-base text-[#1A2332] sm:text-lg">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#1A2332]/60">{a.description}</p>
                  </div>
                </Animate>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline / Journey ── */}
      <section className="bg-warm-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{journeyEyebrow}</p>
              <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl xl:text-4xl">
                {journeyTitle}
              </h2>
            </div>
          </Animate>

          <div className="relative mt-14">
            {/* Continuous vertical line — full height */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-primary/25 lg:left-1/2 lg:-translate-x-px" />

            {milestones.map((m, i) => {
              const Icon = m.icon;
              const isLeft = i % 2 === 0;

              return (
                <div key={m.year} className={`relative mb-8 lg:mb-6 ${isLeft ? 'lg:flex lg:items-start' : 'lg:flex lg:flex-row-reverse lg:items-start'}`}>
                  {/* Dot on the line */}
                  <div className="absolute left-6 top-0 z-10 -translate-x-1/2 lg:left-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-warm-white bg-primary text-xs font-bold text-white shadow-md shadow-primary/20 transition-transform duration-300 hover:scale-125">
                      {m.year.slice(-2)}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`ml-14 lg:ml-0 lg:w-1/2 ${isLeft ? 'lg:pr-14' : 'lg:pl-14'}`}>
                    <Animate animation={isLeft ? 'animate-fade-left' : 'animate-fade-right'} delay={i * 120}>
                      <div className="group rounded-2xl border border-[#1A2332]/5 bg-white p-5 transition-all duration-500 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6">
                            <Icon className="h-4 w-4 text-primary transition-colors duration-500 group-hover:text-white" />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">{m.year}</span>
                            <h3 className="font-heading text-base text-[#1A2332] sm:text-lg">{m.title}</h3>
                          </div>
                        </div>
                        <p className="mt-2.5 text-sm leading-relaxed text-[#1A2332]/60">{m.description}</p>
                      </div>
                    </Animate>
                  </div>

                  {/* Spacer for opposite side on desktop */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Founders ── */}
      <section id="founders" className="bg-[#1A2332] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{foundersEyebrow}</p>
              <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl">
                {foundersTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400 sm:text-base">
                {foundersDescription}
              </p>
            </div>
          </Animate>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto">
            {foundersList.map((person: any, i: number) => (
              <Animate key={person.name} delay={i * 150} animation="animate-fade-up">
                <AboutTeamCard person={person} />
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section id="team" className="bg-[#1A2332] pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{get('about_team_eyebrow', 'Our Team')}</p>
              <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl">
                {teamTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
                Open a profile for full biography, seminars, and contributions.
              </p>
              <Link
                href="/team"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-[#1A2332]"
              >
                View full team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Animate>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamList.map((person: any, i: number) => (
              <Animate key={person.name} delay={i * 100} animation="animate-fade-up">
                <AboutTeamCard person={person} />
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 float-particle" style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties} />
          <div className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-white/20 float-particle" style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties} />
          <div className="absolute right-1/4 bottom-1/3 h-40 w-40 rounded-full bg-white/10 float-particle" style={{ '--duration': '7s', '--delay': '2s' } as React.CSSProperties} />
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
              <Link href="/get-involved" className="btn-ripple inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-primary transition-all duration-300 hover:bg-[#1A2332] hover:text-white hover:shadow-xl hover:-translate-y-0.5">
                Get Involved <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5">
                Contact Us
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
