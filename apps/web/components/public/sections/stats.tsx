'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useSettingsMap } from '@/hooks/use-api';

const defaultStats = [
  { settingKey: 'stat_people_supported', number: 500, suffix: '+', label: 'People Supported' },
  { settingKey: 'stat_community_events', number: 20, suffix: '+', label: 'Community Events' },
  { settingKey: 'stat_volunteers', number: 50, suffix: '+', label: 'Volunteers' },
  { settingKey: 'stat_commitment', number: 100, suffix: '%', label: 'Commitment' },
];

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return { count, ref };
}

function StatItem({ number, suffix, label }: { number: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(number);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl font-normal text-dark sm:text-5xl lg:text-6xl">
        {count}
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="mt-1.5 text-xs text-text-secondary sm:text-sm">{label}</p>
    </div>
  );
}

export function Stats() {
  const { get, source } = useSettingsMap();

  const stats = useMemo(
    () =>
      defaultStats.map((s) => {
        const raw = get(s.settingKey, '');
        if (!raw) return s;
        const num = Number(raw.replace(/[^\d.]/g, ''));
        return num ? { ...s, number: num } : s;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source, get]
  );

  return (
    <section className="bg-[#FAFAF8] py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
