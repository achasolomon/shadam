'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSettingsMap } from '@/hooks/use-api';

type FeatureItem = {
  number: string;
  title: string;
  description: string;
  points: string[];
  image: string;
  cta: { label: string; href: string };
};

const featuresFallback: FeatureItem[] = [
  {
    number: '01',
    title: 'Responding to Crises',
    description: 'In times of crisis, every second counts. Our organization is committed to providing immediate relief.',
    points: ['Immediate Relief', 'Emergency Support', 'Direct Impact'],
    image: '/images/banner/banner2.jpg',
    cta: { label: 'Learn More', href: '/what-we-do' },
  },
  {
    number: '02',
    title: 'Building a Foundation',
    description: 'Our mission is to empower local communities by providing essential resources through training programs.',
    points: ['Long-term Change', 'Empowerment', 'Sustainable Solutions'],
    image: '/images/banner/banner3.jpeg',
    cta: { label: 'Explore Details', href: '/what-we-do' },
  },
  {
    number: '03',
    title: 'Protecting Our Communities',
    description: 'Protecting our communities is essential to creating a better future for all. Our programs focus on sustainability.',
    points: ['Educational Support', 'Youth Development', 'Resource Access'],
    image: '/images/projects/community-outreach.jpg',
    cta: { label: 'Get Involved', href: '/get-involved' },
  },
  {
    number: '04',
    title: 'Making a Difference',
    description: 'With every step, we are moving closer to a world where no one is left behind. From feeding the hungry to providing shelter.',
    points: ['Environmental', 'Restoring Nature', 'Clean Energy'],
    image: '/images/projects/awareness.jpg',
    cta: { label: 'Donate Now', href: '/get-involved' },
  },
];

function AnimatedCard({ f, i }: { f: FeatureItem; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="sticky-card"
      style={{ '--card-index': i, '--card-top': `${60 + i * 20}px` } as React.CSSProperties}
    >
      <div
        className={`grid gap-6 p-5 sm:p-6 lg:gap-8 lg:p-10 lg:grid-cols-2 lg:items-center ${
          isVisible ? 'feature-card-visible' : 'feature-card-hidden'
        }`}
        style={{ transitionDelay: `${i * 80}ms` }}
      >
        {/* Content */}
        <div className={i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
          <span className="font-heading text-6xl font-normal text-gray-100 lg:text-7xl xl:text-8xl">
            {f.number}
          </span>
          <h3 className="mt-2 font-heading text-xl font-normal text-dark lg:text-2xl xl:text-3xl">
            {f.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {f.description}
          </p>
          <ul className="mt-4 space-y-2">
            {f.points.map((p: string) => (
              <li key={p} className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <Link
            href={f.cta.href}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#6BCF6B] hover:text-[#1A2332] hover:shadow-lg"
          >
            {f.cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Image */}
        <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
          <Image
            src={f.image}
            alt={f.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const { getJSON } = useSettingsMap();
  const raw = getJSON<any[]>('features_list', []);
  const features = (raw.length > 0 ? raw : featuresFallback).map((f) => ({
    number: f.number,
    title: f.title,
    description: f.description,
    points: f.points || [],
    image: f.image,
    cta: { label: f.cta?.label || f.ctaLabel || 'Learn More', href: f.cta?.href || f.ctaHref || '/what-we-do' },
  }));
  return (
    <section className="bg-white py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <div className="relative">
          {features.map((f, i) => (
            <AnimatedCard key={f.number} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
