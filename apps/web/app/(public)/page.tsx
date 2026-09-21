import { Hero } from '@/components/sections/hero';
import { EventCountdown } from '@/components/sections/event-countdown';
import { AboutPreview } from '@/components/sections/about-preview';
import { Services } from '@/components/sections/services';
import { Projects } from '@/components/sections/projects';
import { Impact } from '@/components/sections/impact';
import { GalleryPreview } from '@/components/sections/gallery-preview';
import { GetHelpCTA } from '@/components/sections/get-help-cta';
import { LatestInsights } from '@/components/sections/latest-insights';
import { Newsletter } from '@/components/sections/newsletter';

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
