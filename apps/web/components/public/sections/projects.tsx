import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  { title: 'Mental Health Awareness Campaigns', category: 'Community' },
  { title: 'Support & Referral Services', category: 'Professional Help' },
  { title: 'Community Outreach Programs', category: 'Community' },
  { title: 'Educational Workshops', category: 'Education' },
];

export function Projects() {
  return (
    <section className="bg-dark py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Projects</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white lg:text-4xl">Creating Real Change</h2>
            <p className="mt-4 max-w-md text-gray-300">Through targeted programmes and community engagement, we provide support, education and hope for a healthier tomorrow.</p>
            <Link href="/projects" className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <div key={p.title} className="group relative overflow-hidden rounded-xl bg-dark-secondary">
                  <div className="aspect-[4/3] bg-dark-secondary">
                    <div className="flex h-full items-center justify-center"><p className="text-xs text-gray-500">Project Image</p></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading text-base font-semibold text-white">{p.title}</h3>
                    <span className="mt-1 inline-block rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">{p.category}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400"><span className="font-semibold text-white">01</span> / 04</div>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"><ChevronLeft className="h-5 w-5" /></button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
