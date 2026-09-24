'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart } from 'lucide-react';
import { useCountUp } from '@/hooks/use-count-up';
import { useSettingsMap, useAlbums } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

function StatCard({ value, label, color, image }: { value: number; label: string; color: string; image: string }) {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-3 overflow-hidden rounded-full ${color} p-1.5 pr-5 sm:p-2 sm:pr-6 transition-transform duration-300 hover:scale-[1.02]`}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full sm:h-16 sm:w-16">
        <Image src={image} alt={label} fill className="object-cover" sizes="64px" />
      </div>
      <div className="text-white">
        <p className="font-heading text-xl font-normal leading-tight sm:text-2xl">{count}+</p>
        <p className="text-[10px] opacity-80 sm:text-[11px]">{label}</p>
      </div>
    </div>
  );
}

const galleryImages = [
  { src: '/images/projects/awareness.jpg', alt: 'Awareness Campaign', tall: true },
  { src: '/images/projects/community-outreach.jpg', alt: 'Community Outreach', tall: false },
  { src: '/images/projects/educational-workshop.jpg', alt: 'Educational Workshop', tall: false },
  { src: '/images/projects/support-referal-system.jpg', alt: 'Support Services', tall: true },
  { src: '/images/banner/banner2.jpg', alt: 'Community Impact', tall: false },
  { src: '/images/banner/banner3.jpeg', alt: 'Our Team', tall: false },
];

export function ImpactGalleryHelp() {
  const { get } = useSettingsMap();
  const { data: albums, source } = useAlbums();
  const impactEyebrow = get('impact_eyebrow', 'In Numbers');
  const impactTitle = get('impact_title', 'Our Impact');
  const impactDescription = get(
    'impact_description',
    'Every conversation, every support session, every life touched matters. We are just getting started.'
  );
  const stat1Value = parseInt(get('stat_people_supported', '500'), 10) || 500;
  const stat2Value = parseInt(get('stat_community_events', '12'), 10) || 12;
  const stat3Value = parseInt(get('stat_volunteers', '8'), 10) || 8;
  const images =
    source === 'api' && albums.length >= 6
      ? albums.slice(0, 6).map((a: any) => ({ src: resolveMediaUrl(a.coverMedia?.url) || '/images/projects/awareness.jpg', alt: a.title, tall: false }))
      : galleryImages;
  const gridImages = images.length >= 6 ? images : galleryImages;

  const galleryEyebrow = get('home_gallery_eyebrow', 'Gallery');
  const galleryTitle = get('home_gallery_title', 'Moments from Our Work');
  const galleryCta = get('home_gallery_cta', 'View Gallery');
  const helpTitle = get('home_help_title', 'You Are Not Alone.');
  const helpDescription = get('home_help_description', 'It is okay to talk. It is okay to ask for help. It is okay to seek professional support.');
  const helpCta = get('home_help_cta', 'Get Help Now');
  const helpOrCall = get('home_help_or_call', 'Or call:');
  const phoneDisplay = get('contact_phone', '0805 177 2262');
  const phoneRaw = get('contact_phone_raw', '+2348051772262');

  return (
    <section className="bg-[#1A2332] py-12 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        {/* Mobile: single column / Desktop: 3 columns */}
        <div className="grid gap-10 lg:grid-cols-[280px_1fr_300px] lg:items-start">
          {/* Column 1: Impact Stats */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{impactEyebrow}</p>
            <h2 className="mt-2 font-heading text-xl font-normal text-white sm:text-2xl lg:text-3xl">{impactTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {impactDescription}
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:gap-3 lg:mt-8">
              <StatCard value={stat1Value} label={get('impact_stat1_label', 'People Reached')} color="bg-primary" image={gridImages[0].src} />
              <StatCard value={stat2Value} label={get('impact_stat2_label', 'Communities')} color="bg-[#4A90D9]" image={gridImages[1].src} />
              <StatCard value={stat3Value} label={get('impact_stat3_label', 'Programs')} color="bg-[#D4A843]" image={gridImages[2].src} />
            </div>
          </div>

          {/* Column 2: Gallery */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{galleryEyebrow}</p>
                <h2 className="mt-2 font-heading text-lg font-normal text-white sm:text-xl">{galleryTitle}</h2>
              </div>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-300 hover:gap-2.5"
              >
                {galleryCta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mobile: 2 cols / Desktop: 3 cols staggered */}
            <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-3">
              {/* Col 1 */}
              <div className="hidden lg:grid gap-2 auto-rows-[120px]">
                <div className="group relative overflow-hidden rounded-2xl row-span-2">
                  <Image src={gridImages[0].src} alt={gridImages[0].alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" sizes="200px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 text-[10px] font-medium text-white translate-y-full transition-transform group-hover:translate-y-0">{gridImages[0].alt}</p>
                </div>
                <div className="group relative overflow-hidden rounded-2xl">
                  <Image src={gridImages[3].src} alt={gridImages[3].alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" sizes="200px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 text-[10px] font-medium text-white translate-y-full transition-transform group-hover:translate-y-0">{gridImages[3].alt}</p>
                </div>
              </div>

              {/* Col 2 */}
              <div className="hidden lg:grid gap-2 auto-rows-[120px]">
                <div className="group relative overflow-hidden rounded-2xl">
                  <Image src={gridImages[1].src} alt={gridImages[1].alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" sizes="200px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 text-[10px] font-medium text-white translate-y-full transition-transform group-hover:translate-y-0">{gridImages[1].alt}</p>
                </div>
                <div className="group relative overflow-hidden rounded-2xl row-span-2">
                  <Image src={gridImages[4].src} alt={gridImages[4].alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" sizes="200px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 text-[10px] font-medium text-white translate-y-full transition-transform group-hover:translate-y-0">{gridImages[4].alt}</p>
                </div>
              </div>

              {/* Col 3 */}
              <div className="hidden lg:grid gap-2 auto-rows-[120px]">
                <div className="group relative overflow-hidden rounded-2xl">
                  <Image src={gridImages[2].src} alt={gridImages[2].alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" sizes="200px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 text-[10px] font-medium text-white translate-y-full transition-transform group-hover:translate-y-0">{gridImages[2].alt}</p>
                </div>
                <div className="group relative overflow-hidden rounded-2xl row-span-2">
                  <Image src={gridImages[5].src} alt={gridImages[5].alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" sizes="200px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 text-[10px] font-medium text-white translate-y-full transition-transform group-hover:translate-y-0">{gridImages[5].alt}</p>
                </div>
              </div>

              {/* Mobile: simple 2-col grid */}
              {gridImages.map((img, i) => (
                <div key={i} className="lg:hidden group relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={img.src} alt={img.alt} fill className="object-cover transition-all duration-500 group-hover:scale-110" sizes="50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-2 left-2 text-[10px] font-medium text-white translate-y-full transition-transform group-hover:translate-y-0">{img.alt}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            </div>
          </div>

          {/* Column 3: Get Help CTA */}
          <div className="flex items-center">
            <div className="w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#7DDF7D] to-[#6BCF6B] p-6 text-center transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 sm:p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:h-20 sm:w-20">
                <Heart className="h-8 w-8 text-white sm:h-10 sm:w-10" />
              </div>
              <h2 className="mt-5 font-heading text-lg font-normal text-white sm:text-xl">{helpTitle}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                {helpDescription}
              </p>
              <Link
                href="/get-help"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 sm:mt-6 sm:px-8 sm:py-3.5"
              >
                {helpCta} <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-5 border-t border-white/20 pt-4 sm:mt-6 sm:pt-5">
                <p className="text-xs text-white/60">{helpOrCall}</p>
                <a href={`tel:${phoneRaw}`} className="mt-1 block text-base font-semibold text-white transition-colors duration-300 hover:text-white/90 sm:text-lg">
                  {phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
