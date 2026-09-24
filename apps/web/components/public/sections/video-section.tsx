'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSettingsMap } from '@/hooks/use-api';

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const { get } = useSettingsMap();
  const eyebrow = get('video_eyebrow', 'Watch Our Story');
  const title = get('video_title', 'See the Impact of Your Support');
  const description = get(
    'video_description',
    'Watch how SHEDAM is transforming lives through mental health awareness, community support, and professional referrals.'
  );
  const videoUrl = get('video_url', '/video/Mentalhealth.mp4');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoUrl]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section className="relative overflow-hidden bg-[#1A2332] min-h-[500px] lg:min-h-[600px] flex items-center">
      {/* Video background */}
      <video
        ref={videoRef}
        key={videoUrl}
        src={videoUrl}
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      {/* Content overlay */}
      <div className="relative mx-auto max-w-7xl px-8 sm:px-12 lg:px-20 text-center w-full">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        <h2 className="mt-3 font-heading text-3xl font-normal text-white lg:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-300">
          {description}
        </p>

        {/* Volume toggle */}
        <button
          onClick={toggleMute}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </section>
  );
}
