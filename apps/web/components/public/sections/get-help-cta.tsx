import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export function GetHelpCTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-white lg:text-4xl">You Are Not Alone.</h2>
          <p className="mt-4 text-lg text-white/80">It is okay to talk. It is okay to ask for help. It is okay to seek professional support.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/get-help" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-white/90">
              Get Help Now <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="tel:+234XXXXXXXXXX" className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10">
              <Phone className="h-5 w-5" /> Call Us
            </a>
          </div>
          <p className="mt-8 text-sm text-white/60">
            Need immediate support? <a href="tel:08051772262" className="font-semibold text-white hover:underline">Call 0805 177 2262</a>
          </p>
        </div>
      </div>
    </section>
  );
}
