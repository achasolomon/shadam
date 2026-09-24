'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Calendar,
  MessageSquare,
  Newspaper,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { adminApi } from '@/lib/api';

interface DashboardStats {
  projects: number;
  events: number;
  articles: number;
  enquiries: number;
  teamMembers: number;
  mediaAssets: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    events: 0,
    articles: 0,
    enquiries: 0,
    teamMembers: 0,
    mediaAssets: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, enquiriesRes] = await Promise.allSettled([
          adminApi.getDashboardStats(),
          adminApi.getEnquiries(),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.success) {
          const d = statsRes.value.data;
          setStats({
            projects: d.projects || 0,
            events: d.events || 0,
            articles: d.articles || 0,
            enquiries: d.enquiries || 0,
            teamMembers: d.teamMembers || 0,
            mediaAssets: d.mediaAssets || 0,
          });
        }

        if (enquiriesRes.status === 'fulfilled' && enquiriesRes.value.success) {
          setRecentEnquiries(enquiriesRes.value.data?.slice(0, 5) || []);
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/dashboard/projects' },
    { label: 'Events', value: stats.events, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/dashboard/events' },
    { label: 'Articles', value: stats.articles, icon: Newspaper, color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/dashboard/articles' },
    { label: 'Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/dashboard/enquiries' },
  ];

  const quickLinks = [
    { label: 'New Project', href: '/admin/dashboard/projects', icon: FileText },
    { label: 'New Event', href: '/admin/dashboard/events', icon: Calendar },
    { label: 'New Article', href: '/admin/dashboard/articles', icon: Newspaper },
    { label: 'Upload Media', href: '/admin/dashboard/media', icon: FileText },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#1A2332] to-[#2D3A4A] p-8 text-white lg:p-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-gray-400">Admin Dashboard</span>
        </div>
        <h1 className="font-heading text-2xl lg:text-3xl">
          Your Mental Health Is Our Priority
        </h1>
        <p className="mt-3 max-w-xl text-sm text-gray-300 sm:text-base">
          Creating Awareness, Breaking the Stigma, and Connecting People with Professional Help.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {link.label}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-primary" />
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {loading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-gray-200" />
              ) : (
                s.value
              )}
            </p>
            <p className="mt-1 text-sm text-gray-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Recent Enquiries */}
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-heading text-lg text-gray-900">Recent Enquiries</h2>
            <Link href="/admin/dashboard/enquiries" className="text-xs font-medium text-primary hover:text-[#6BCF6B]">
              View All
            </Link>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : recentEnquiries.length > 0 ? (
              <div className="space-y-3">
                {recentEnquiries.map((e: any) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {e.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{e.name}</p>
                      <p className="truncate text-xs text-gray-500">{e.subject || e.message?.slice(0, 50)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      e.status === 'NEW' ? 'bg-blue-50 text-blue-600' :
                      e.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {e.status?.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto h-10 w-10 text-gray-200" />
                <p className="mt-3 text-sm text-gray-400">No enquiries yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="font-heading text-sm font-medium text-gray-900">Content Overview</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Media Assets</span>
                <span className="font-medium text-gray-900">{stats.mediaAssets}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Team Members</span>
                <span className="font-medium text-gray-900">{stats.teamMembers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Content</span>
                <span className="font-medium text-gray-900">
                  {stats.projects + stats.events + stats.articles}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="font-heading text-sm font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
