'use client';

import { Heart } from 'lucide-react';
import { useDonationModal } from '@/components/public/donation-modal';
import { useSettingsMap } from '@/hooks/use-api';

export function FloatingBanner() {
  const { openModal } = useDonationModal();
  const { get } = useSettingsMap();
  const eyebrow = get('donate_eyebrow', 'Be the Change');
  const title = get('donate_title', 'Every Donation Makes a Difference');
  const description = get(
    'donate_description',
    'Your support helps us provide critical mental health services, awareness campaigns, and community outreach programs to those who need it most.'
  );
  const donateCta = get('donate_cta', 'Donate Now');

  return (
    <section className="relative z-10 bg-[#FAFAF8] py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
        <div className="overflow-hidden rounded-2xl bg-[#D4A843] shadow-2xl">
          <div className="flex flex-col items-center gap-5 px-5 py-8 text-center sm:flex-row sm:items-center sm:px-8 sm:py-10 sm:text-left lg:px-16">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2332]/70 sm:text-xs">{eyebrow}</p>
              <h2 className="mt-1.5 font-heading text-lg font-normal text-[#1A2332] sm:text-2xl lg:text-3xl">
                {title}
              </h2>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-[#1A2332]/80 sm:text-sm">
                {description}
              </p>
            </div>
            <button
              onClick={() => openModal({ type: 'general' })}
              className="inline-flex items-center gap-2 rounded-full bg-[#1A2332] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#1A2332]/90 hover:shadow-lg shrink-0 sm:px-8 sm:py-3.5"
            >
              <Heart className="h-4 w-4" />
              {donateCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
