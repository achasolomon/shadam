import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with SHEDAM.',
};

export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">Contact Us</h1>
        <p className="mt-4 text-lg text-text-secondary">
          We would love to hear from you.
        </p>
      </div>
    </div>
  );
}
