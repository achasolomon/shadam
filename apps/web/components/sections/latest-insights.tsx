import Link from 'next/link';
import { Container } from '@smhi/ui';
import { ArrowRight, Clock } from 'lucide-react';

const articles = [
  {
    title: 'Understanding Mental Health: A Comprehensive Guide',
    excerpt: 'Mental health is a fundamental component of overall health and human wellbeing.',
    category: 'Education',
    readTime: '5 min read',
    date: 'Sep 15, 2025',
  },
  {
    title: 'Breaking the Stigma: How to Talk About Mental Health',
    excerpt: 'Learn how to have open and supportive conversations about mental health.',
    category: 'Awareness',
    readTime: '4 min read',
    date: 'Sep 10, 2025',
  },
  {
    title: ' Supporting a Loved One with Mental Health Challenges',
    excerpt: 'Practical tips for supporting someone who is experiencing mental health difficulties.',
    category: 'Support',
    readTime: '6 min read',
    date: 'Sep 5, 2025',
  },
];

export function LatestInsights() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Insights
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">
              Latest Articles
            </h2>
          </div>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.title}
              className="group rounded-xl border border-border bg-white transition-all hover:border-primary hover:shadow-md"
            >
              {/* Image Placeholder */}
              <div className="aspect-[16/10] overflow-hidden rounded-t-xl bg-surface-alt">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-text-muted">Article Image</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="mt-3 font-heading text-lg font-semibold text-dark transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                  {article.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-text-muted">{article.date}</span>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Read More
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
