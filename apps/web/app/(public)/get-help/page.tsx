import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Help',
  description: 'Find support, professional help, and mental health resources.',
};

export default function GetHelpPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">Get Help</h1>
        <p className="mt-4 text-lg text-text-secondary">
          You are not alone. Find support and connect with professional help.
        </p>
      </div>
    </div>
  );
}
