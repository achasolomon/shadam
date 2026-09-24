'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFeaturedEvent, useSettingsMap } from '@/hooks/use-api';

const defaultHeroImages = [
  { src: '/images/banner/hero-banner.png', alt: 'Mental health awareness' },
  { src: '/images/banner/banner1.jpg', alt: 'Community support programs' },
  { src: '/images/banner/banner2.jpg', alt: 'Volunteer outreach' },
  { src: '/images/banner/banner3.jpeg', alt: 'Professional counselling' },
];

const fallbackEvent = {
  title: 'Mental Health Awareness Forum',
  startAt: '2026-12-15T10:00:00',
  location: 'Abuja',
  slug: '',
};

function splitHeadline(raw: string) {
  const trimmed = raw.trim();
  const quoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith('“') && trimmed.endsWith('”'));
  const inner = quoted ? trimmed.slice(1, -1).trim() : trimmed;
  const words = inner.split(/\s+/).filter(Boolean);
  const pivot = words.length >= 2 ? words.length - 2 : 0;
  return {
    quoted,
    quote: quoted ? trimmed[0] : '',
    white: words.slice(0, pivot).join(' '),
    green: words.slice(pivot).join(' '),
  };
}

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000)) % 60,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

export function Hero() {
  const { data: featuredEvent } = useFeaturedEvent();
  const { get, getJSON } = useSettingsMap();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeEvent = useMemo(
    () =>
      featuredEvent
        ? {
            ...featuredEvent,
            location: featuredEvent.venue || featuredEvent.venueAddress || '',
          }
        : fallbackEvent,
    [featuredEvent]
  );

  const tagline = get('hero_tagline', 'Creating Awareness, Breaking the Stigma, and Connecting People with Professional Help.');
  const headline = get('hero_headline', '"Your Mental Health Is Our Priority."');
  const heroImages = useMemo(() => {
    const slides = getJSON<Array<{ src: string; alt?: string }>>('hero_slides', defaultHeroImages);
    const valid = Array.isArray(slides)
      ? slides
          .filter((s) => s && typeof s.src === 'string' && s.src.trim())
          .map((s) => ({ src: s.src, alt: s.alt || '' }))
      : [];
    return valid.length > 0 ? valid : defaultHeroImages;
  }, [getJSON]);

  const eventDate = useMemo(
    () => new Date(activeEvent.startAt || '2026-12-15T10:00:00'),
    [activeEvent.startAt]
  );
  const countdown = useCountdown(eventDate);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    setCurrentSlide((prev) => (prev % heroImages.length) || 0);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative overflow-hidden bg-[#1A2332] pt-14 lg:pt-16">
      {/* SVG clip paths for desktop */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id="hero-img" clipPathUnits="objectBoundingBox">
            <path d="M 0.35 0 L 1 0 L 1 1 L 0.4 1 C 0.25 1, 0.12 0.92, 0.06 0.8 C 0 0.68, 0 0.55, 0.06 0.42 C 0.12 0.28, 0.22 0.15, 0.35 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Mobile: Full-screen image carousel */}
      <div className="absolute inset-0 lg:hidden">
        {heroImages.map((img, i) => (
          <div
            key={img.src}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: i === currentSlide ? 1 : 0 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover hero-breathe"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2332]/70 via-[#1A2332]/40 to-[#1A2332]/90" />
      </div>

      {/* Desktop: Image carousel — right side with organic shape */}
      <div className="hidden lg:block absolute top-0 right-0 h-full w-[60%] xl:w-[55%]">
        <svg
          className="absolute inset-0 w-full h-full hero-outline-animate z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 10px rgba(136, 231, 136, 0.6)) drop-shadow(0 0 25px rgba(136, 231, 136, 0.35))' }}
        >
          <path
            d="M 35 0 L 100 0 L 100 100 L 40 100 C 25 100, 12 92, 6 80 C 0 68, 0 55, 6 42 C 12 28, 22 15, 35 0 Z"
            stroke="#88E788"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div
          className="hero-image-animate absolute inset-0 overflow-hidden"
          style={{ clipPath: 'url(#hero-img)' }}
        >
          {heroImages.map((img, i) => (
            <div
              key={img.src}
              className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
              style={{ opacity: i === currentSlide ? 1 : 0 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover hero-breathe"
                priority={i === 0}
                sizes="55vw"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2332]/40 via-transparent to-transparent animate-[kenBurns_6s_ease-in-out_infinite]" />
        </div>
        {/* Desktop carousel indicators */}
        <div className="absolute bottom-8 right-8 z-30 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-8 bg-[#88E788]' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Carousel indicators */}
      <div className="absolute bottom-28 left-0 right-0 z-30 flex justify-center gap-2 lg:hidden">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentSlide ? 'w-6 bg-[#88E788]' : 'w-1.5 bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start gap-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center lg:min-h-[520px] py-10 lg:py-10">
          {/* Left: Text */}
          <div className="relative z-10 max-w-xl">
            <p className="hero-eyebrow text-[10px] font-semibold uppercase tracking-[0.15em] text-[#88E788] sm:text-xs sm:tracking-[0.2em]">
              {get('site_name', 'SHEDAM Mental Health Initiative')}
            </p>

            <h1 className="hero-headline mt-3 font-heading text-[26px] font-normal leading-[1.1] text-white sm:text-[32px] lg:text-[48px] xl:text-[54px]">
              {(() => {
                const { quoted, quote, white, green } = splitHeadline(headline);
                return (
                  <>
                    {quoted && quote}
                    {white && <span>{white} </span>}
                    <span className="hero-highlight text-[#88E788]">{green}</span>
                    {quoted && quote}
                  </>
                );
              })()}
            </h1>

            <p className="hero-description mt-3 max-w-[460px] text-xs font-medium text-white/80 sm:text-sm lg:text-base leading-relaxed">
              {tagline}
            </p>

            <div className="hero-buttons mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
              <Link
                href="/get-help"
                className="group inline-flex items-center gap-2 rounded-full bg-[#88E788] px-5 py-3 text-sm font-medium text-[#1A2332] transition-all duration-250 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-[#88E788]/20 sm:px-6"
              >
                Get Help Now
                <ArrowRight className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition-all duration-250 hover:border-white/40 hover:bg-white/5 sm:px-6"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: spacer (desktop only) */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Desktop: Event Countdown Card */}
      <div className="absolute bottom-6 left-[55%] z-20 hidden lg:block hero-float">
        <Link
          href={activeEvent.slug ? `/events/${activeEvent.slug}` : '/events'}
          className="hero-card inline-flex items-center gap-5 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-5 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#88E788]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#88E788] animate-pulse" />
              Upcoming Event
            </div>
            <h3 className="mt-1 font-heading text-sm text-white">{activeEvent.title}</h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[#88E788]/70" /> {eventDate.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {activeEvent.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#88E788]/70" /> {activeEvent.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1.5">
            {[
              { v: countdown.days, l: 'Days' },
              { v: countdown.hours, l: 'Hrs' },
              { v: countdown.minutes, l: 'Min' },
              { v: countdown.seconds, l: 'Sec' },
            ].map((item) => (
              <div key={item.l} className="text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold text-white tabular-nums">
                  {String(item.v).padStart(2, '0')}
                </div>
                <p className="mt-0.5 text-[7px] text-gray-500">{item.l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-[#88E788] whitespace-nowrap">
            Register <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      </div>

      {/* Mobile: Event card */}
      <div className="lg:hidden px-4 pb-5 relative z-20">
        <Link
          href={activeEvent.slug ? `/events/${activeEvent.slug}` : '/events'}
          className="hero-card flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-3.5 transition-all duration-300"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#88E788]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#88E788] animate-pulse" />
              Upcoming Event
            </div>
            <h3 className="mt-1 font-heading text-sm text-white truncate">{activeEvent.title}</h3>
            <span className="text-[11px] text-gray-400">
              {eventDate.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              {activeEvent.location ? ` • ${activeEvent.location}` : ''}
            </span>
          </div>
          <div className="flex gap-1">
            {[
              { v: countdown.days, l: 'D' },
              { v: countdown.hours, l: 'H' },
              { v: countdown.minutes, l: 'M' },
              { v: countdown.seconds, l: 'S' },
            ].map((item) => (
              <div key={item.l} className="text-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-[11px] font-semibold text-white tabular-nums">
                  {String(item.v).padStart(2, '0')}
                </div>
                <p className="text-[7px] text-gray-500">{item.l}</p>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}
