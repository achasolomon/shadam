import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Articles, stories, and resources on mental health.',
};

export default function InsightsPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">Insights</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Articles, stories, and resources to support your mental health journey.
        </p>
      </div>
    </div>
  );
}
