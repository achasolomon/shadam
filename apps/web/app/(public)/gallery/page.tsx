import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Moments from our work - photos and videos from SHEDAM events and programmes.',
};

export default function GalleryPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-dark">Gallery</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Moments from our work.
        </p>
      </div>
    </div>
  );
}
