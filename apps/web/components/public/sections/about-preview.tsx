'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Target, Eye, Heart } from 'lucide-react';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import { useSettingsMap } from '@/hooks/use-api';

const defaultValues = ['Compassion', 'Inclusion', 'Integrity', 'Collaboration', 'Impact'];

export function AboutPreview() {
  const { get, getJSON } = useSettingsMap();
  const eyebrow = get('about_eyebrow', 'About SHEDAM');
  const title = get('about_title', 'Who We Are');
  const description = get(
    'about_description',
    'SHEDAM Mental Health Initiative (SMHI) is a community-driven organization focused on promoting mental well-being, breaking the stigma around mental health, and connecting people to professional help and support services.'
  );
  const mission = get(
    'about_mission',
    'To create awareness, reduce stigma and ensure access to professional mental health support for all.'
  );
  const vision = get(
    'about_vision',
    'A society where mental health is valued, understood and supported for everyone.'
  );
  const storyCta = get('about_story_cta', 'Our Story');
  const missionLabel = get('about_mission_label', 'Our Mission');
  const visionLabel = get('about_vision_label', 'Our Vision');
  const valuesLabel = get('about_values_label', 'Our Values');

  const rawValues = getJSON<{ name: string }[]>('about_values', []);
  const valueNames = rawValues.length > 0 ? rawValues.map((v) => v.name).filter(Boolean).slice(0, 5) : defaultValues;

  return (
    <section className="py-12 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr_1fr] lg:items-center">
          {/* Left: Text */}
          <ScrollReveal animation="slide-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
              <h2 className="mt-2 font-heading text-xl font-normal text-dark sm:text-2xl lg:text-3xl xl:text-4xl">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {description}
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 hover:gap-3"
              >
                {storyCta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Center: Image */}
          <ScrollReveal animation="scale-in" delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/banner/banner2.jpg"
                alt="SHEDAM mental health counselling session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </ScrollReveal>

          {/* Right: Mission / Vision / Values */}
          <ScrollReveal animation="slide-right" delay={200} stagger>
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-3 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110 sm:h-10 sm:w-10">
                  <Target className="h-4 w-4 text-primary transition-colors group-hover:text-white sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm text-dark sm:text-base">{missionLabel}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {mission}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110 sm:h-10 sm:w-10">
                  <Eye className="h-4 w-4 text-primary transition-colors group-hover:text-white sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm text-dark sm:text-base">{visionLabel}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {vision}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110 sm:h-10 sm:w-10">
                  <Heart className="h-4 w-4 text-primary transition-colors group-hover:text-white sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm text-dark sm:text-base">{valuesLabel}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {valueNames.map((v) => (
                      <span key={v} className="rounded-full bg-primary/5 px-2 py-0.5 text-[10px] text-text-secondary sm:px-2.5 sm:text-xs">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
