'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useState } from 'react';
import { useDonationModal } from '@/components/public/donation-modal';
import { useProjects, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const staticProjects = [
  { slug: 'mental-health-awareness-campaigns', title: 'Mental Health Awareness Campaigns', category: 'Community', image: '/images/projects/awareness.jpg', raised: 2500000, goal: 5000000 },
  { slug: 'professional-referral-pathway', title: 'Support & Referral Services', category: 'Professional Help', image: '/images/projects/support-referal-system.jpg', raised: 1800000, goal: 3000000 },
  { slug: 'community-support-networks', title: 'Community Outreach Programs', category: 'Community', image: '/images/projects/community-outreach.jpg', raised: 3200000, goal: 4000000 },
  { slug: 'school-mental-health-programme', title: 'Educational Workshops', category: 'Education', image: '/images/projects/educational-workshop.jpg', raised: 900000, goal: 2000000 },
];

export function Projects() {
  const { openModal } = useDonationModal();
  const [current, setCurrent] = useState(0);
  const { get } = useSettingsMap();

  const eyebrow = get('projects_hero_eyebrow', 'Our Projects');
  const title = [get('projects_hero_title', 'Creating'), get('projects_hero_title_highlight', 'Real Change')].filter(Boolean).join(' ');
  const description = get('projects_hero_description', 'Through targeted programmes and community engagement, we provide support, education and hope for a healthier tomorrow.');
  const viewAllCta = get('projects_view_all_cta', 'View All Projects');
  const donateCta = get('projects_donate_cta', 'Donate Now');

  // Try API first, fall back to static
  const { data: apiProjects, source } = useProjects({ limit: 4 });

  const projects =
    source === 'api' && apiProjects.data.length > 0
      ? apiProjects.data.map((p: any) => ({
          slug: p.slug,
          title: p.title,
          category: p.category || 'Community',
          image: resolveMediaUrl(p.coverMedia?.url) || '/images/projects/awareness.jpg',
          raised: 0,
          goal: 0,
        }))
      : staticProjects;

  const visibleCount = 4;
  const maxIndex = Math.max(0, projects.length - visibleCount);

  return (
    <section className="bg-dark py-12 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
          {/* Left: Text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-3 font-heading text-xl font-normal text-white sm:text-2xl lg:text-3xl xl:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-300">
              {description}
            </p>
            <Link
              href="/projects"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
            >
              {viewAllCta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right: Carousel */}
          <div className="relative">
            {/* Pagination */}
            <div className="mb-3 flex items-center justify-end gap-1 text-sm text-gray-400 lg:mb-4">
              <span className="font-semibold text-white">{String(current + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(projects.length).padStart(2, '0')}</span>
            </div>

            {/* Cards Grid - Mobile: 1 col / Desktop: 2 col */}
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {projects.slice(current, current + visibleCount).map((p) => {
                const pct = p.goal > 0 ? Math.round((p.raised / p.goal) * 100) : null;
                return (
                  <div
                    key={p.title}
                    className="group relative overflow-hidden rounded-2xl"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="font-heading text-sm text-white sm:text-base">{p.title}</h3>
                      <span className="mt-1 inline-block rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary sm:px-2.5 sm:text-xs">
                        {p.category}
                      </span>
                      {/* Progress bar */}
                      {pct !== null && (
                        <div className="mt-2 sm:mt-3">
                          <div className="flex items-center justify-between text-[10px] text-gray-300 mb-1 sm:text-xs sm:mb-1.5">
                            <span>Raised: ₦{(p.raised / 1000000).toFixed(1)}M</span>
                            <span>Goal: ₦{(p.goal / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-white/20 sm:h-1.5">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {/* Donate CTA */}
                      <button
                        onClick={() => openModal({
                          type: 'project',
                          projectName: p.title,
                          projectSlug: p.slug,
                          projectImage: p.image,
                          raised: p.raised,
                          goal: p.goal,
                        })}
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] sm:mt-3 sm:px-4 sm:text-xs"
                      >
                        <Heart className="h-3 w-3" />
                        {donateCta}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <div className="mt-4 flex items-center gap-2 lg:mt-6">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed lg:h-10 lg:w-10"
              >
                <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
              <button
                onClick={() => setCurrent(Math.min(maxIndex, current + 1))}
                disabled={current >= maxIndex}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed lg:h-10 lg:w-10"
              >
                <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
