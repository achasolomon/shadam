import Link from 'next/link';
import { Container } from '@smhi/ui';
import { ArrowRight, Target, Eye, Users } from 'lucide-react';

export function AboutPreview() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              About SHEDAM
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">
              Who We Are
            </h2>
            <p className="mt-4 text-text-secondary">
              SHEDAM Mental Health Initiative (SMHI) is a community-driven organization focused on
              promoting mental well-being, breaking the stigma around mental health, and connecting
              people to professional help and support services.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Our Story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Image Placeholder */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-alt">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-text-muted">About Image</p>
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Mission */}
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-dark">Our Mission</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  To create awareness, reduce stigma and ensure access to professional mental health
                  support for all.
                </p>
              </div>

              {/* Vision */}
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-dark">Our Vision</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  A society where mental health is valued, understood and supported for everyone.
                </p>
              </div>

              {/* Values */}
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                  <Users className="h-6 w-6 text-info" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-dark">Our Values</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Compassion', 'Inclusion', 'Integrity', 'Collaboration', 'Impact'].map(
                    (value) => (
                      <span
                        key={value}
                        className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-text-secondary"
                      >
                        {value}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
