import { Users, MapPin, BookOpen } from 'lucide-react';

const stats = [
  { icon: Users, value: '0+', label: 'People Reached' },
  { icon: MapPin, value: '0+', label: 'Communities' },
  { icon: BookOpen, value: '0+', label: 'Programs' },
];

export function Impact() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">In Numbers</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-dark lg:text-4xl">Our Impact</h2>
            <p className="mt-4 max-w-md text-text-secondary">Every conversation, every support session, every life touched matters. We are just getting started.</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><s.icon className="h-8 w-8 text-primary" /></div>
                <p className="mt-4 font-heading text-3xl font-bold text-dark lg:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
