import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Volunteer, partner with us, or support our mission.',
};

export default function GetInvolvedPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">Get Involved</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Join us in creating awareness and breaking the stigma.
        </p>
      </div>
    </div>
  );
}
