'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useAlbums, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const fallbackImages = [
  '/images/projects/awareness.jpg',
  '/images/projects/community-outreach.jpg',
  '/images/projects/educational-workshop.jpg',
  '/images/projects/support-referal-system.jpg',
];

export function GalleryPreview() {
  const { data: albums, source } = useAlbums();
  const { get } = useSettingsMap();

  const eyebrow = get('home_gallery_eyebrow', 'Gallery');
  const title = get('home_gallery_title', 'Moments from Our Work');
  const cta = get('home_gallery_cta', 'View Gallery');

  const apiPhotos =
    source === 'api' && Array.isArray(albums) && albums.length > 0
      ? albums
          .flatMap((al: any) => (Array.isArray(al.items) ? al.items : []))
          .filter((p: any) => p && p.url)
          .slice(0, 4)
          .map((p: any) => ({ id: p.id || p.url, url: p.url, alt: p.altText || p.caption || 'Gallery photo' }))
      : [];

  const photos =
    apiPhotos.length > 0
      ? apiPhotos
      : fallbackImages.map((url, i) => ({ id: i, url, alt: `Gallery ${i + 1}` }));

  return (
    <section className="bg-surface-alt py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">{title}</h2>
          </div>
          <Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            {cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-border">
              <Image
                src={resolveMediaUrl(p.url)}
                alt={p.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
