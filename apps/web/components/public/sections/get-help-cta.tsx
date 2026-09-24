'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { useSettingsMap } from '@/hooks/use-api';

export function GetHelpCTA() {
  const { get } = useSettingsMap();

  const title = get('home_help_title', 'You Are Not Alone.');
  const description = get(
    'home_help_description',
    'It is okay to talk. It is okay to ask for help. It is okay to seek professional support.'
  );
  const cta = get('home_help_cta', 'Get Help Now');
  const callLabel = get('home_help_call_label', 'Call Us');
  const notePrefix = get('home_help_note_prefix', 'Need immediate support?');
  const phoneDisplay = get('contact_phone', '0805 177 2262');
  const phoneRaw = get('contact_phone_raw', '+2348051772262');

  return (
    <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-white lg:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-white/80">{description}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/get-help" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-white/90">
              {cta} <ArrowRight className="h-5 w-5" />
            </Link>
            <a href={`tel:${phoneRaw}`} className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10">
              <Phone className="h-5 w-5" /> {callLabel}
            </a>
          </div>
          <p className="mt-8 text-sm text-white/60">
            {notePrefix}{' '}
            <a href={`tel:${phoneRaw}`} className="font-semibold text-white hover:underline">
              Call {phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
