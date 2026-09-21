import { Container } from '@smhi/ui';
import { Users, MapPin, BookOpen } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '0+',
    label: 'People Reached',
  },
  {
    icon: MapPin,
    value: '0+',
    label: 'Communities',
  },
  {
    icon: BookOpen,
    value: '0+',
    label: 'Programs',
  },
];

export function Impact() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              In Numbers
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">
              Our Impact
            </h2>
            <p className="mt-4 max-w-md text-text-secondary">
              Every conversation, every support session, every life touched matters. We are just
              getting started.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <p className="mt-4 font-heading text-3xl font-bold text-dark lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
