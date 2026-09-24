'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Play, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useStories, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const defaultSpotlights = [
  {
    type: 'image' as const,
    image: '/images/banner/banner2.jpg',
    name: 'Dr. Amina Bello',
    title: 'Consultant Psychiatrist, National Hospital Abuja',
    quote: 'Mental health is not a luxury — it is a fundamental human right. When we invest in mental wellbeing, we invest in the future of our communities.',
  },
  {
    type: 'image' as const,
    image: '/images/banner/banner3.jpeg',
    name: 'Prof. Chukwuemeka Okafor',
    title: 'Professor of Clinical Psychology, University of Lagos',
    quote: 'The stigma around mental health costs lives every day. Education and awareness are the most powerful tools we have to break the silence.',
  },
  {
    type: 'image' as const,
    image: '/images/projects/community-outreach.jpg',
    name: 'Dr. Fatima Yusuf',
    title: 'Mental Health Advocate & Researcher',
    quote: 'Every community needs trained mental health first responders. When people know what to look for and where to refer, lives are saved.',
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

function Animate({ children, className = '', animation = 'animate-fade-up', delay = 0 }: { children: React.ReactNode; className?: string; animation?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`${animation} ${visible ? 'animate-in' : 'animate-hidden'} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Spotlight() {
  const [current, setCurrent] = useState(0);
  const { data: apiStories, source } = useStories({ limit: 3 });
  const { get } = useSettingsMap();

  const eyebrow = get('spotlight_eyebrow', 'Spotlight');
  const title = get('spotlight_title', 'Voices of Change');
  const description = get('spotlight_description', 'Leading professionals share their insights on mental health awareness, advocacy, and the work ahead.');

  const storySpotlights =
    source === 'api' && apiStories.data.length > 0
      ? apiStories.data.map((st: any) => ({
          type: 'image' as const,
          image: resolveMediaUrl(st.media?.url) || '/images/banner/banner2.jpg',
          name: st.personLabel || 'SHEDAM Community',
          title: 'In Their Words',
          quote: st.quote || st.body,
        }))
      : null;

  const spotlights: Array<{ type: 'image' | 'video'; image: string; name: string; title: string; quote: string }> =
    (storySpotlights && storySpotlights.length > 0 ? storySpotlights : defaultSpotlights) as any;

  const next = () => setCurrent((c) => (c + 1) % spotlights.length);
  const prev = () => setCurrent((c) => (c - 1 + spotlights.length) % spotlights.length);

  const s = spotlights[current];

  return (
    <section className="bg-[#1A2332] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <Animate>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-3 font-heading text-xl text-white sm:text-2xl lg:text-3xl xl:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400 sm:text-base">
              {description}
            </p>
          </div>
        </Animate>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          {/* Media side */}
          <Animate animation="animate-fade-left">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src={s.image}
                alt={s.name}
                fill
                className="object-cover transition-all duration-700"
              />
              {/* Play button for video type */}
              {s.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary/90 text-white transition-all duration-300 hover:scale-110 hover:bg-primary shadow-lg shadow-primary/30">
                    <Play className="ml-1 h-7 w-7" />
                  </div>
                </div>
              )}
              {/* Navigation arrows */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={prev}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              {/* Counter */}
              <div className="absolute top-4 left-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {current + 1} / {spotlights.length}
              </div>
            </div>
          </Animate>

          {/* Quote side */}
          <Animate animation="animate-fade-right" delay={150}>
            <div className="flex flex-col justify-center">
              <Quote className="h-10 w-10 text-primary/30" />
              <blockquote className="mt-4 font-heading text-lg text-white sm:text-xl lg:text-2xl leading-relaxed">
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20" />
                <div>
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.title}</p>
                </div>
              </div>
              {/* Dots */}
              <div className="mt-6 flex gap-2">
                {spotlights.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'w-8 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Animate>
        </div>
      </div>
    </section>
  );
}
