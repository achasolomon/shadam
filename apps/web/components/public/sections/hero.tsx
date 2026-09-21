import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-dark py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              SHEDAM Mental Health Initiative (SMHI)
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-white lg:text-5xl xl:text-6xl">
              Creating Awareness.{' '}
              <span className="text-primary">Breaking the Stigma.</span>{' '}
              Connecting People to Professional Help.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-300">
              We are a growing initiative dedicated to making mental health support more accessible,
              inclusive and stigma-free for everyone.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/get-help" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
                Get Help Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                Learn More <Play className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-dark-secondary">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
                    <span className="text-4xl font-bold text-primary">S</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">Hero Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
