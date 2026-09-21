import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What We Do',
  description:
    'Explore our services: Mental Health Awareness, Education, Professional Referral, Community Support, and Vulnerable Persons Support.',
};

export default function WhatWeDoPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">What We Do</h1>
        <p className="mt-4 text-lg text-text-secondary">
          We focus on education, support and access to ensure better mental health outcomes for individuals and communities.
        </p>
      </div>
    </div>
  );
}
