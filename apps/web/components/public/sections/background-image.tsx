'use client';

import Image from 'next/image';

export function BackgroundImage() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <Image
        src="/images/banner/banner1.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#1A2332]/90" />
    </div>
  );
}
