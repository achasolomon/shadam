import { FileText, Calendar, MessageSquare, Users } from 'lucide-react';

const stats = [
  { label: 'Projects', value: '0', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Events', value: '0', icon: Calendar, color: 'text-info', bg: 'bg-info/10' },
  { label: 'Enquiries', value: '0', icon: MessageSquare, color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Articles', value: '0', icon: Users, color: 'text-success', bg: 'bg-success/10' },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold text-dark">Dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-white p-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${s.bg}`}><s.icon className={`h-6 w-6 ${s.color}`} /></div>
            <p className="mt-4 text-3xl font-bold text-dark">{s.value}</p>
            <p className="mt-1 text-sm text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="font-heading text-lg font-semibold text-dark">Recent Enquiries</h2>
        <p className="mt-4 text-center text-sm text-text-muted">No enquiries yet.</p>
      </div>
    </div>
  );
}
