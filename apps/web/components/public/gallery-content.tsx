'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  Camera,
  Calendar,
  Grid3X3,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { albums, photos, galleryCategories, type GalleryAlbum, type GalleryPhoto } from '@/lib/gallery-data';
import { Pagination, usePagination } from '@/components/ui/pagination';
import { useAlbums, useSettingsMap } from '@/hooks/use-api';
import { resolveMediaUrl } from '@/lib/api';

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

export function GalleryContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [lightboxAlbum, setLightboxAlbum] = useState<GalleryAlbum | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Try API first, fall back to static data
  const { data: apiAlbums } = useAlbums();
  const { get, getJSON } = useSettingsMap();

  const heroTitle = get('gallery_hero_title', 'Photo Gallery');
  const heroDescription = get('gallery_hero_description', 'A visual journey through our community events, workshops, outreach programmes and the people who make our mission possible.');
  const ctaTitle = get('gallery_cta_title', 'Have Photos to Share?');
  const ctaDescription = get('gallery_cta_description', 'If you have photos from our events or programmes, we would love to feature them in our gallery.');
  const categories = getJSON<string[]>('gallery_categories', galleryCategories);

  type ApiAlbumWithItems = GalleryAlbum & { items?: any[] };

  const allAlbums: ApiAlbumWithItems[] = apiAlbums.length > 0
    ? apiAlbums.map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        description: a.description || '',
        category: 'Events',
        coverImage: resolveMediaUrl(a.coverMedia?.url || a.items?.[0]?.media?.url) || '/images/projects/awareness.jpg',
        date: a.publishedAt || a.createdAt,
        photoCount: a.items?.length || 0,
        items: a.items || [],
      }))
    : albums;

  const filteredAlbums =
    activeCategory === 'All' ? allAlbums : allAlbums.filter((a) => a.category === activeCategory);

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(filteredAlbums, 6);

  const allPhotos: GalleryPhoto[] = (() => {
    const apiPhotos: GalleryPhoto[] = [];
    for (const album of allAlbums as ApiAlbumWithItems[]) {
      if (album.items?.length) {
        album.items.forEach((item: any, idx: number) => {
          const media = item.media || item;
          if (!media?.url && !media?.src) return;
          apiPhotos.push({
            id: (apiPhotos.length + 1) as any,
            albumSlug: album.slug,
            src: resolveMediaUrl(media.url) || media.src,
            alt: item.caption || media.alt || album.title,
            caption: item.caption || '',
          });
        });
      }
    }
    return apiPhotos.length > 0 ? apiPhotos : photos;
  })();

  const openLightbox = (album: GalleryAlbum) => {
    const albumPhotos = allPhotos.filter((p) => p.albumSlug === album.slug);
    if (albumPhotos.length > 0) {
      setLightboxAlbum(album);
      setLightboxPhoto(albumPhotos[0]);
      setLightboxIndex(0);
    }
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
    setLightboxAlbum(null);
  };

  const navigate = useCallback(
    (dir: 'prev' | 'next') => {
      if (!lightboxAlbum) return;
      const albumPhotos = allPhotos.filter((p) => p.albumSlug === lightboxAlbum.slug);
      const idx = albumPhotos.findIndex((p) => p.id === lightboxPhoto?.id);
      if (dir === 'next') {
        const next = (idx + 1) % albumPhotos.length;
        setLightboxPhoto(albumPhotos[next]);
        setLightboxIndex(next);
      } else {
        const prev = (idx - 1 + albumPhotos.length) % albumPhotos.length;
        setLightboxPhoto(albumPhotos[prev]);
        setLightboxIndex(prev);
      }
    },
    [lightboxAlbum, lightboxPhoto, allPhotos],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigate('next');
      if (e.key === 'ArrowLeft') navigate('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxPhoto, navigate]);

  const totalPhotos = allAlbums.reduce((sum, a) => sum + a.photoCount, 0);

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-white pt-24 pb-8 lg:pt-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="flex items-center gap-2 text-xs text-[#1A2332]/40">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#1A2332]">Gallery</span>
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <h1 className="font-heading text-2xl font-normal text-[#1A2332] sm:text-3xl lg:text-4xl">
                  {heroTitle}
                </h1>
              </div>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#1A2332]/50 sm:text-base">
                {heroDescription}
              </p>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-heading text-2xl text-[#1A2332]">{allAlbums.length}</p>
                <p className="text-[10px] text-[#1A2332]/40">Albums</p>
              </div>
              <div className="h-8 w-px bg-[#1A2332]/10" />
              <div className="text-center">
                <p className="font-heading text-2xl text-[#1A2332]">{totalPhotos}</p>
                <p className="text-[10px] text-[#1A2332]/40">Photos</p>
              </div>
            </div>
          </div>

          {/* Filter + View Toggle */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#1A2332]/10 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-[#1A2332] text-white shadow-lg shadow-[#1A2332]/20'
                      : 'bg-[#1A2332]/5 text-[#1A2332]/60 hover:bg-[#1A2332]/10 hover:text-[#1A2332]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-[#1A2332]/10 p-1">
              <button
                onClick={() => setViewMode('masonry')}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === 'masonry' ? 'bg-[#1A2332] text-white' : 'text-[#1A2332]/40 hover:text-[#1A2332]'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded p-1.5 transition-colors ${
                  viewMode === 'grid' ? 'bg-[#1A2332] text-white' : 'text-[#1A2332]/40 hover:text-[#1A2332]'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Albums Grid ── */}
      <section className="bg-[#FAFAF8] pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          {viewMode === 'masonry' ? (
            /* Masonry View - Albums with cover images */
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {paginatedItems.map((album, i) => (
                <Animate key={album.id} delay={i * 80}>
                  <div
                    className="mb-4 break-inside-avoid cursor-pointer group"
                    onClick={() => openLightbox(album)}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        width={600}
                        height={400}
                        className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                          i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/70 via-[#1A2332]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          <Camera className="h-2.5 w-2.5" />
                          {album.photoCount} photos
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        <p className="text-xs font-medium text-white">View Album →</p>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <h3 className="font-heading text-sm text-[#1A2332] group-hover:text-primary transition-colors">
                        {album.title}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#1A2332]/40">
                        <Calendar className="h-2.5 w-2.5" />
                        {new Date(album.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        <span className="mx-1">·</span>
                        {album.category}
                      </p>
                    </div>
                  </div>
                </Animate>
              ))}
            </div>
          ) : (
            /* Grid View - Album cards */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((album, i) => (
                <Animate key={album.id} delay={i * 80}>
                  <div
                    className="group cursor-pointer rounded-xl border border-[#1A2332]/5 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
                    onClick={() => openLightbox(album)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image src={album.coverImage} alt={album.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          <Camera className="h-2.5 w-2.5" />
                          {album.photoCount} photos
                        </span>
                        <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-[#1A2332]">
                          {album.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-base text-[#1A2332] group-hover:text-primary transition-colors">
                        {album.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#1A2332]/50 line-clamp-2">
                        {album.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[10px] text-[#1A2332]/30">
                          <Calendar className="h-2.5 w-2.5" />
                          {new Date(album.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </Animate>
              ))}
            </div>
          )}

          {filteredAlbums.length === 0 && (
            <div className="py-16 text-center">
              <Camera className="mx-auto h-12 w-12 text-[#1A2332]/20" />
              <p className="mt-4 text-sm text-[#1A2332]/40">No albums in this category yet.</p>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            className="mt-10"
          />
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxPhoto && lightboxAlbum && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A2332]/95 backdrop-blur-sm animate-fade-up animate-in"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Album title */}
          <div className="absolute top-4 left-4 z-10">
            <p className="text-xs text-white/60">{lightboxAlbum.title}</p>
            <p className="text-[10px] text-white/40">
              {lightboxIndex + 1} / {allPhotos.filter((p) => p.albumSlug === lightboxAlbum.slug).length}
            </p>
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Image */}
          <div className="relative max-h-[80vh] max-w-[85vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxPhoto.src}
              alt={lightboxPhoto.alt}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {lightboxPhoto.caption && (
              <p className="mt-2 text-center text-xs text-white/60">{lightboxPhoto.caption}</p>
            )}
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate('next'); }}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

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
                Share Your Photos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
