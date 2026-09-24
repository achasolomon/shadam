'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAlbums } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

const staticImages = [
  { src: '/images/projects/awareness.jpg', alt: 'Mental Health Awareness Campaign' },
  { src: '/images/projects/community-outreach.jpg', alt: 'Community Outreach' },
  { src: '/images/banner/banner2.jpg', alt: 'Community Impact' },
  { src: '/images/projects/educational-workshop.jpg', alt: 'Educational Workshop' },
  { src: '/images/banner/banner3.jpeg', alt: 'Our Team' },
  { src: '/images/projects/support-referal-system.jpg', alt: 'Support & Referral' },
];

export function MasonryGallery() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'pile' | 'disperse'>('pile');
  const { data: albums, source } = useAlbums();

  const images =
    source === 'api' && albums.length > 0
      ? albums
          .slice(0, 6)
          .map((a: any) => ({ src: resolveMediaUrl(a.coverMedia?.url) || '/images/projects/awareness.jpg', alt: a.title }))
      : staticImages;
  const imageList = images.length >= 2 ? images : staticImages;

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setPhase('disperse'), 800);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-white py-12 lg:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: "url('/images/banner/banner1.jpg')" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our Gallery</p>
            <h2 className="mt-2 font-heading text-xl font-normal text-dark sm:text-2xl lg:text-3xl xl:text-4xl">
              Moments of Impact
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all duration-300 hover:gap-2.5 sm:text-sm"
          >
            View Gallery <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>

        <div ref={gridRef} className="mt-8 relative lg:mt-10">
          {/* Pile */}
          {phase === 'pile' && (
            <div className="flex justify-center py-12 lg:py-20">
              <div className="relative h-[160px] w-[160px] sm:h-[200px] sm:w-[200px]">
                {imageList.map((img, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 pile-card"
                    style={{
                      transform: `rotate(${-12 + i * 5}deg) translateY(${-i * 2}px)`,
                      zIndex: imageList.length - i,
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover rounded-xl shadow-2xl"
                      sizes="200px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          <div
            className={`grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 ${
              phase === 'disperse' ? 'gallery-grid-visible' : 'gallery-grid-hidden'
            }`}
          >
            {imageList.map((img, i) => (
              <Link
                key={i}
                href="/gallery"
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Heart icon */}
                <div className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 sm:h-9 sm:w-9">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                  <p className="text-xs font-medium text-white sm:text-sm">{img.alt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
