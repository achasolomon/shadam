import { Calendar, MapPin, Clock } from 'lucide-react';

export function EventCountdown() {
  const hasEvent = false;
  if (!hasEvent) return null;

  return (
    <section className="relative -mt-8 z-20 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-white p-6 shadow-lg lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Upcoming Event</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-dark">Mental Health Awareness Community Forum</h2>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Sat, Nov 15, 2025</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>10:00 AM</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Christ the King Catholic Church, Kubwa, Abuja</span></div>
              </div>
            </div>
            <div className="flex gap-4">
              {[{ value: '23', label: 'Days' }, { value: '08', label: 'Hours' }, { value: '42', label: 'Minutes' }, { value: '17', label: 'Seconds' }].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-2xl font-bold text-white">{item.value}</div>
                  <p className="mt-1 text-xs text-text-secondary">{item.label}</p>
                </div>
              ))}
            </div>
            <a href="#" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
              Register Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
