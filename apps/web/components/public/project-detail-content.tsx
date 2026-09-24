'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Calendar,
  Heart,
  Users,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Share2,
  ChevronRight,
  DollarSign,
  BarChart3,
  Quote,
} from 'lucide-react';
import type { ProjectData } from '@/lib/projects-data';
import { useDonationModal } from '@/components/public/donation-modal';

const categoryColors: Record<string, string> = {
  Community: '#88E788',
  Education: '#3B82F6',
  Healthcare: '#EF4444',
  Corporate: '#F59E0B',
};

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Ongoing: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  Active: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  Pilot: { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500' },
};

function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return { ref: setRef, visible };
}

function Animate({
  children,
  className = '',
  animation = 'animate-fade-up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`${animation} ${visible ? 'animate-in' : 'animate-hidden'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ProjectDetailContent({
  project,
  relatedProjects,
}: {
  project: ProjectData;
  relatedProjects: ProjectData[];
}) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [animatedRaised, setAnimatedRaised] = useState(0);
  const pct = Math.round((project.raised / project.goal) * 100);
  const status = statusColors[project.status] || statusColors.Ongoing;
  const catColor = categoryColors[project.category] || '#88E788';
  const { openModal } = useDonationModal();

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = project.raised / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= project.raised) {
        setAnimatedRaised(project.raised);
        clearInterval(timer);
      } else {
        setAnimatedRaised(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [project.raised]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] overflow-hidden bg-[#1A2332] lg:min-h-[65vh]">
        <div
          className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${
            heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
        >
          <Image src={project.image} alt={project.title} fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332] via-[#1A2332]/60 to-[#1A2332]/30" />

        {/* Breadcrumb */}
        <div className="relative mx-auto max-w-7xl px-5 pt-24 sm:px-8 lg:px-20">
          <nav
            className={`flex items-center gap-2 text-xs text-gray-400 transition-all duration-700 delay-300 ${
              heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{project.title}</span>
          </nav>
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-12 pt-8 sm:px-8 lg:px-20 lg:pb-16">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold ${status.bg} ${status.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {project.status}
              </span>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm"
                style={{ backgroundColor: `${catColor}CC` }}
              >
                {project.category}
              </span>
            </div>
            <h1
              className={`mt-4 font-heading text-2xl font-normal text-white sm:text-3xl lg:text-4xl xl:text-5xl transition-all duration-700 delay-500 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {project.title}
            </h1>
            <div
              className={`mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-300 transition-all duration-700 delay-700 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {project.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                Since {project.startDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                {project.beneficiaries} beneficiaries
              </span>
            </div>
          </div>
        </div>
        <div
          className="absolute top-20 right-10 h-2 w-2 rounded-full bg-primary/40 float-particle"
          style={{ '--duration': '3s', '--delay': '0s' } as React.CSSProperties}
        />
      </section>

      {/* ── Funding Progress Bar ── */}
      <section className="bg-warm-white py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <Animate>
            <div className="rounded-2xl border border-[#1A2332]/5 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1A2332]/40">
                    Funding Progress
                  </p>
                  <p className="mt-1 font-heading text-2xl text-[#1A2332] sm:text-3xl">
                    ₦{(animatedRaised / 1000000).toFixed(1)}M{' '}
                    <span className="text-sm font-normal text-[#1A2332]/40">
                      of ₦{(project.goal / 1000000).toFixed(1)}M goal
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-3xl text-primary sm:text-4xl">{pct}%</p>
                  <p className="text-xs text-[#1A2332]/40">funded</p>
                </div>
              </div>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#1A2332]/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-2000 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => openModal({
                    type: 'project',
                    projectName: project.title,
                    projectSlug: project.slug,
                    projectImage: project.image,
                    raised: project.raised,
                    goal: project.goal,
                  })}
                  className="btn-ripple inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20 sm:flex-initial"
                >
                  <Heart className="h-4 w-4" />
                  Donate Now
                </button>
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share({ title: project.title, url: window.location.href });
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1A2332]/10 px-6 py-3.5 text-sm font-medium text-[#1A2332]/60 transition-all duration-300 hover:border-primary/30 hover:text-primary"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </Animate>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-warm-white pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
            {/* Main content */}
            <div>
              {/* About */}
              <Animate>
                <div>
                  <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">About This Project</h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#1A2332]/60 sm:text-base">
                    {project.fullDescription.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Highlights */}
              <Animate delay={100}>
                <div className="mt-10">
                  <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">What We Do</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {project.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-start gap-3 rounded-xl border border-[#1A2332]/5 bg-white p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-[#1A2332]/70">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Impact */}
              <Animate delay={200}>
                <div className="mt-10">
                  <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">Our Impact</h2>
                  <div className="mt-5 space-y-3">
                    {project.impact.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <p className="text-sm text-[#1A2332]/60">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Milestones */}
              <Animate delay={300}>
                <div className="mt-10">
                  <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">Milestones</h2>
                  <div className="mt-5 space-y-0">
                    {project.milestones.map((m, i) => (
                      <div
                        key={i}
                        className="group flex gap-4 border-l-2 border-[#1A2332]/10 py-4 pl-5 transition-all duration-300 hover:border-primary hover:bg-primary/5 -ml-px"
                      >
                        <div className="shrink-0 pt-0.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-[#1A2332]/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-125" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-primary">{m.date}</p>
                          <p className="mt-1 font-heading text-sm text-[#1A2332]">{m.title}</p>
                          <p className="mt-0.5 text-xs text-[#1A2332]/50">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Fund Allocation */}
              <Animate delay={400}>
                <div className="mt-10">
                  <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">How Funds Are Used</h2>
                  <div className="mt-5 space-y-4">
                    {project.allocation.map((a) => (
                      <div key={a.item} className="rounded-xl border border-[#1A2332]/5 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-heading text-sm text-[#1A2332]">{a.item}</p>
                            <p className="mt-0.5 text-xs text-[#1A2332]/50">{a.description}</p>
                          </div>
                          <p className="font-heading text-lg text-primary">{a.percentage}%</p>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#1A2332]/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                            style={{ width: `${a.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Animate>

              {/* Testimonials */}
              {project.testimonials && project.testimonials.length > 0 && (
                <Animate delay={500}>
                  <div className="mt-10">
                    <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">What People Say</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {project.testimonials.map((t, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-[#1A2332]/5 bg-white p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
                        >
                          <Quote className="h-6 w-6 text-primary/30" />
                          <p className="mt-3 text-sm leading-relaxed text-[#1A2332]/60 italic">
                            &ldquo;{t.quote}&rdquo;
                          </p>
                          <div className="mt-4 border-t border-[#1A2332]/5 pt-3">
                            <p className="font-heading text-sm text-[#1A2332]">{t.name}</p>
                            <p className="text-xs text-[#1A2332]/40">{t.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Animate>
              )}

              {/* Gallery */}
              {project.gallery.length > 0 && (
                <Animate delay={600}>
                  <div className="mt-10">
                    <h2 className="font-heading text-xl text-[#1A2332] sm:text-2xl">Gallery</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {project.gallery.map((img, i) => (
                        <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
                          <Image
                            src={img}
                            alt={`${project.title} gallery ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-[#1A2332]/0 transition-all duration-300 group-hover:bg-[#1A2332]/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Animate>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {/* Quick Stats */}
              <Animate delay={100}>
                <div className="rounded-2xl border border-[#1A2332]/5 bg-white p-6 shadow-sm">
                  <h3 className="font-heading text-lg text-[#1A2332]">Project Overview</h3>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#1A2332]/50">Status</span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#1A2332]/50">Category</span>
                      <span className="text-sm font-medium text-[#1A2332]">{project.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#1A2332]/50">Location</span>
                      <span className="text-sm font-medium text-[#1A2332] text-right max-w-[180px]">{project.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#1A2332]/50">Since</span>
                      <span className="text-sm font-medium text-[#1A2332]">{project.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#1A2332]/50">Beneficiaries</span>
                      <span className="text-sm font-medium text-[#1A2332]">{project.beneficiaries}</span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#1A2332]/5 pt-5">
                    <button
                      onClick={() => openModal({
                        type: 'project',
                        projectName: project.title,
                        projectSlug: project.slug,
                        projectImage: project.image,
                        raised: project.raised,
                        goal: project.goal,
                      })}
                      className="btn-ripple flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-[#1A2332] transition-all duration-300 hover:bg-[#6BCF6B] hover:shadow-lg hover:shadow-primary/20"
                    >
                      <Heart className="h-4 w-4" />
                      Donate to This Project
                    </button>
                    <Link
                      href="/contact"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A2332]/10 px-6 py-3 text-sm font-medium text-[#1A2332]/60 transition-all duration-300 hover:border-primary/30 hover:text-primary"
                    >
                      Volunteer for This Project
                    </Link>
                  </div>
                </div>
              </Animate>

              {/* Donation Impact */}
              <Animate delay={200}>
                <div className="mt-5 rounded-2xl bg-[#1A2332] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Your Donation Impact
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">₦5,000</p>
                        <p className="text-[10px] text-gray-400">Provides counselling for 1 person</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">₦20,000</p>
                        <p className="text-[10px] text-gray-400">Funds a community workshop</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">₦100,000</p>
                        <p className="text-[10px] text-gray-400">Sponsors a month of outreach</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Animate>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Projects ── */}
      {relatedProjects.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-20">
            <Animate>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Support More Projects
                </p>
                <h2 className="mt-3 font-heading text-xl text-[#1A2332] sm:text-2xl lg:text-3xl">
                  Other Projects
                </h2>
              </div>
            </Animate>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((rp, i) => {
                const rpPct = Math.round((rp.raised / rp.goal) * 100);
                const rpColor = categoryColors[rp.category] || '#88E788';
                return (
                  <Animate key={rp.id} delay={i * 80}>
                    <Link href={`/projects/${rp.slug}`} className="block h-full">
                      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#1A2332]/5 bg-[#F8F9FA] transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={rp.image}
                            alt={rp.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2332]/70 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white"
                              style={{ backgroundColor: `${rpColor}CC` }}
                            >
                              {rp.category}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${rpPct}%` }}
                              />
                            </div>
                            <p className="mt-1 text-[10px] text-white/80">{rpPct}% funded</p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <h3 className="font-heading text-sm text-[#1A2332] transition-colors duration-300 group-hover:text-primary">
                            {rp.title}
                          </h3>
                          <p className="mt-1.5 flex-1 text-xs text-[#1A2332]/50 line-clamp-2">
                            {rp.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between border-t border-[#1A2332]/5 pt-3">
                            <span className="text-[10px] text-[#1A2332]/30">
                              ₦{(rp.raised / 1000000).toFixed(1)}M raised
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-all duration-300 group-hover:gap-2">
                              Donate <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Animate>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-primary py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '6s', '--delay': '0s' } as React.CSSProperties}
          />
          <div
            className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-white/20 float-particle"
            style={{ '--duration': '5s', '--delay': '1s' } as React.CSSProperties}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-20 text-center">
          <Animate>
            <h2 className="font-heading text-xl text-white sm:text-2xl lg:text-3xl">
              Make a Difference Today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 sm:text-base">
              Your donation directly supports mental health care in communities that need it most.
              Every contribution matters.
            </p>
          </Animate>
          <Animate delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/get-involved"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-[#1A2332] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#1A2332] hover:shadow-xl hover:-translate-y-0.5"
              >
                <Heart className="h-4 w-4" />
                Donate Now
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5"
              >
                View All Projects
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </>
  );
}
