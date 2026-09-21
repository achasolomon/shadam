import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SHEDAM Mental Health Initiative.',
};

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">About SHEDAM</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Learn about our mission, vision, and the story behind SHEDAM Mental Health Initiative.
        </p>
      </div>
    </div>
  );
}
