import { Hero } from '@/components/public/sections/hero';
import { EventCountdown } from '@/components/public/sections/event-countdown';
import { AboutPreview } from '@/components/public/sections/about-preview';
import { Services } from '@/components/public/sections/services';
import { Projects } from '@/components/public/sections/projects';
import { Impact } from '@/components/public/sections/impact';
import { GalleryPreview } from '@/components/public/sections/gallery-preview';
import { GetHelpCTA } from '@/components/public/sections/get-help-cta';
import { LatestInsights } from '@/components/public/sections/latest-insights';
import { Newsletter } from '@/components/public/sections/newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventCountdown />
      <AboutPreview />
      <Services />
      <Projects />
      <Impact />
      <GalleryPreview />
      <GetHelpCTA />
      <LatestInsights />
      <Newsletter />
    </>
  );
}
