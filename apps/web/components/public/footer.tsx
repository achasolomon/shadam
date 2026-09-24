'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useSettingsMap, useNavigation, useSubscribe } from '@/hooks/use-api';

const socialMeta: { key: string; icon: any; fallback: string; label: string }[] = [
  { key: 'social_facebook', icon: Facebook, fallback: '#', label: 'Facebook' },
  { key: 'social_twitter', icon: Twitter, fallback: '#', label: 'Twitter' },
  { key: 'social_instagram', icon: Instagram, fallback: '#', label: 'Instagram' },
  { key: 'social_linkedin', icon: Linkedin, fallback: '#', label: 'LinkedIn' },
  { key: 'social_youtube', icon: Youtube, fallback: '#', label: 'YouTube' },
];

const defaultQuickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Team', href: '/team' },
  { label: 'Projects', href: '/projects' },
  { label: 'Insights', href: '/insights' },
  { label: 'Resources', href: '/resources' },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
];

const defaultSupportLinks = [
  { label: 'Get Help', href: '/get-help' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Donate', href: '/get-involved' },
  { label: 'Volunteer', href: '/get-involved' },
  { label: 'Partner With Us', href: '/get-involved' },
];

const majorPages = ['About', 'Projects', 'Events', 'Insights', 'Gallery', 'Contact'];

export function Footer() {
  const { get } = useSettingsMap();
  const { data: apiNav, source } = useNavigation();
  const { subscribe, loading, error, success } = useSubscribe();
  const [email, setEmail] = useState('');

  const siteName = get('site_name', 'SHEDAM Mental Health Initiative');
  const siteShort = get('site_short_name', 'SHEDAM');
  const siteTagline = get('site_tagline', 'Mental Health Initiative');
  const contactEmail = get('contact_email', 'info@shedam.org');
  const contactPhone = get('contact_phone', '0805 177 2262');
  const contactPhoneRaw = get('contact_phone_raw', '+2348051772262');
  const contactAddress = get('contact_address', 'Lagos, Nigeria');
  const quickLinksTitle = get('footer_quick_links_title', 'Quick Links');
  const supportTitle = get('footer_support_title', 'Support Us');
  const newsletterTitle = get('footer_newsletter_title', 'Stay Updated');

  const apiQuickLinks =
    source === 'api' && apiNav.length > 0
      ? apiNav
          .filter((n: any) => n.status !== 'INACTIVE' && n.location !== 'HEADER')
          .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((n: any) => ({ label: n.label, href: n.url || '/' }))
      : [];
  const quickLinks =
    apiQuickLinks.length > 0
      ? apiQuickLinks
      : defaultQuickLinks.filter((q) => !majorPages.includes(q.label) || q.label === 'Contact');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    const ok = await subscribe(email.trim());
    if (ok) setEmail('');
  };

  return (
    <footer className="border-t border-border bg-[#1A2332]">
      <div className="mx-auto max-w-7xl px-8 sm:px-12 lg:px-20 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/assets/LOGO-transparent.png"
                alt="SHEDAM"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <p className="font-heading text-sm font-bold text-white">{siteShort}</p>
                <p className="text-[10px] text-gray-400">{siteTagline}</p>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              {get('footer_about', 'Creating Awareness. Breaking the Stigma. Connecting People to Professional Help.')}
            </p>
            <div className="mt-6 space-y-3">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-primary" /> {contactEmail}
              </a>
              <a href={`tel:${contactPhoneRaw}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-primary" /> {contactPhone}
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{contactAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-normal text-white">{quickLinksTitle}</h4>
            <div className="mt-4 space-y-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-gray-400 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-sm font-normal text-white">{supportTitle}</h4>
            <div className="mt-4 space-y-3">
              {defaultSupportLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="block text-sm text-gray-400 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-sm font-normal text-white">{newsletterTitle}</h4>
            <p className="mt-4 text-sm text-gray-400">
              {get('newsletter_text', 'Subscribe to our newsletter for the latest updates on mental health awareness.')}
            </p>
            {success ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" /> Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-0 flex-1 rounded-l-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-r-lg bg-primary px-4 py-2.5 text-sm font-medium text-[#1A2332] transition-colors hover:bg-[#6BCF6B] disabled:opacity-60"
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
            <div className="mt-6 flex gap-3">
              {socialMeta.map((social) => {
                const href = get(social.key, social.fallback);
                if (!href || href === '#') return null;
                return (
                  <a
                    key={social.label}
                    href={href}
                    target={href.startsWith('#') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 sm:px-12 lg:px-20 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}