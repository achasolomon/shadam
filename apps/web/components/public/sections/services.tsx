import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Heart, HeartHandshake, Shield } from 'lucide-react';

const services = [
  { number: '01', title: 'Mental Health Awareness', description: 'Campaigns and outreach to promote understanding and acceptance.', icon: BookOpen, href: '/what-we-do' },
  { number: '02', title: 'Mental Health Education', description: 'Workshops, talks and resources for individuals, schools and communities.', icon: Users, href: '/what-we-do' },
  { number: '03', title: 'Professional Referral', description: 'Connecting people to qualified mental health professionals and services.', icon: Heart, href: '/what-we-do' },
  { number: '04', title: 'Community Support', description: 'Building safe spaces and support networks for ongoing care.', icon: HeartHandshake, href: '/what-we-do' },
  { number: '05', title: 'Vulnerable Persons Support', description: 'Helping those in need, including the indigent and at-risk groups, access care.', icon: Shield, href: '/what-we-do' },
];

export function Services() {
  return (
    <section className="bg-surface-alt py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Services</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">What We Do</h2>
          </div>
          <Link href="/what-we-do" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Explore All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s) => (
            <Link key={s.number} href={s.href} className="group rounded-xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary">
                <s.icon className="h-6 w-6 text-primary transition-colors group-hover:text-white" />
              </div>
              <p className="mt-4 text-xs font-semibold text-text-muted">{s.number}</p>
              <h3 className="mt-1 font-heading text-base font-semibold text-dark">{s.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
