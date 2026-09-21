import { FileText, Calendar, MessageSquare, Users } from 'lucide-react';

const stats = [
  { label: 'Total Projects', value: '0', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Upcoming Events', value: '0', icon: Calendar, color: 'text-info', bg: 'bg-info/10' },
  { label: 'New Enquiries', value: '0', icon: MessageSquare, color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Total Articles', value: '0', icon: Users, color: 'text-success', bg: 'bg-success/10' },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-sm text-text-secondary">Welcome back. Here is an overview of your content.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-white p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className="mt-4 font-heading text-3xl font-bold text-dark">{stat.value}</p>
            <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-white">
        <div className="border-b border-border p-6">
          <h2 className="font-heading text-lg font-semibold text-dark">Recent Enquiries</h2>
        </div>
        <div className="p-6">
          <p className="text-center text-sm text-text-muted">No enquiries yet.</p>
        </div>
      </div>
    </div>
  );
}
