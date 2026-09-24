'use client';

import { Users, MapPin, BookOpen } from 'lucide-react';
import { useSettingsMap } from '@/hooks/use-api';

const iconMap: Record<string, typeof Users> = {
  people: Users,
  communities: MapPin,
  programs: BookOpen,
};

const defaultStats = [
  { key: 'stat_people_supported', icon: 'people', label: 'People Reached', fallback: '500', suffix: '+' },
  { key: 'stat_community_events', icon: 'communities', label: 'Communities', fallback: '20', suffix: '+' },
  { key: 'stat_volunteers', icon: 'programs', label: 'Programs', fallback: '50', suffix: '+' },
];

export function Impact() {
  const { get, getJSON } = useSettingsMap();

  const eyebrow = get('impact_eyebrow', 'In Numbers');
  const title = get('impact_title', 'Our Impact');
  const description = get(
    'impact_description',
    'Every conversation, every support session, every life touched matters. We are just getting started.'
  );

  const custom = getJSON<Array<{ value?: string; label?: string; icon?: string }>>('impact_stats', []);
  const stats =
    custom.length > 0
      ? custom.map((s, i) => {
          const base = defaultStats[i] || defaultStats[0];
          const Icon = iconMap[s.icon || base.icon] || Users;
          const raw = s.value !== undefined ? s.value : get(base.key, base.fallback);
          const num = String(raw).replace(/[^\d.]/g, '');
          return {
            Icon,
            value: num ? `${num}${base.suffix}` : String(raw || base.fallback + base.suffix),
            label: s.label || base.label,
          };
        })
      : defaultStats.map((s) => {
          const Icon = iconMap[s.icon] || Users;
          const raw = get(s.key, s.fallback);
          const num = String(raw).replace(/[^\d.]/g, '');
          return {
            Icon,
            value: num ? `${num}${s.suffix}` : s.fallback + s.suffix,
            label: s.label,
          };
        });

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">{title}</h2>
            <p className="mt-4 max-w-md text-text-secondary">{description}</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><s.Icon className="h-8 w-8 text-primary" /></div>
                <p className="mt-4 font-heading text-3xl font-bold text-dark lg:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
