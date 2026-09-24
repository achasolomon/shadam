'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, ChevronDown } from 'lucide-react';
import { useNavigation, useSettingsMap } from '@/hooks/use-api';

type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const aboutChildren = [
  { label: 'Who We Are', href: '/about#who-we-are' },
  { label: 'Our Mission & Vision', href: '/about#mission' },
  { label: 'Our Core Values', href: '/about#values' },
  { label: 'Our Founders', href: '/about#founders' },
  { label: 'Our Team', href: '/team' },
];

const whatWeDoChildren = [
  { label: 'Mental Health Awareness', href: '/what-we-do/awareness' },
  { label: 'Mental Health Education', href: '/what-we-do/education' },
  { label: 'Professional Referral', href: '/what-we-do/referral' },
  { label: 'Community Support', href: '/what-we-do/community' },
  { label: 'Vulnerable Persons', href: '/what-we-do/vulnerable' },
  { label: 'Research & Advocacy', href: '/what-we-do/research' },
];

const exploreLabels = ['Projects', 'Events', 'Insights', 'Resources', 'Gallery', 'Team'];

const exploreChildrenDefault = exploreLabels.map((label) => ({
  label,
  href: `/${label.toLowerCase()}`,
}));

const defaultNavLinks: NavLink[] = [
  { label: 'About Us', href: '/about', children: aboutChildren },
  { label: 'What We Do', href: '/what-we-do', children: whatWeDoChildren },
  { label: 'Explore', href: '/insights', children: exploreChildrenDefault },
  { label: 'Partners', href: '/partners' },
  { label: 'Contact', href: '/contact' },
];

function buildNavLinks(apiNav: any[]): NavLink[] {
  const items = apiNav
    .filter((n: any) => n.status !== 'INACTIVE' && n.location !== 'FOOTER' && n.label !== 'Home')
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const byLabel = new Map<string, any>(items.map((n: any) => [n.label, n]));
  const hrefOf = (label: string, fallback: string) => byLabel.get(label)?.url || fallback;

  const exploreChildren = items
    .filter((n: any) => exploreLabels.includes(n.label))
    .map((n: any) => ({ label: n.label, href: n.url || '/' }));
  const orderedExplore = exploreLabels
    .map((label) => exploreChildren.find((c) => c.label === label))
    .filter(Boolean) as { label: string; href: string }[];

  const known = new Set(['About Us', 'What We Do', ...exploreLabels, 'Partners', 'Contact']);

  const nav: NavLink[] = [
    { label: 'About Us', href: hrefOf('About Us', '/about'), children: aboutChildren },
    { label: 'What We Do', href: hrefOf('What We Do', '/what-we-do'), children: whatWeDoChildren },
  ];

  if (orderedExplore.length > 0) {
    nav.push({
      label: 'Explore',
      href: hrefOf('Insights', orderedExplore[0].href),
      children: orderedExplore,
    });
  }

  for (const n of items) {
    if (!known.has(n.label)) {
      nav.push({ label: n.label, href: n.url || '/' });
    }
  }

  if (byLabel.has('Partners')) nav.push({ label: 'Partners', href: hrefOf('Partners', '/partners') });
  else nav.push({ label: 'Partners', href: '/partners' });

  if (byLabel.has('Contact')) nav.push({ label: 'Contact', href: hrefOf('Contact', '/contact') });
  else nav.push({ label: 'Contact', href: '/contact' });

  return nav;
}

export function Header({ forceScrolled = false }: { forceScrolled?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const { data: apiNav, source } = useNavigation();
  const { get } = useSettingsMap();
  const helpLabel = get('header_help_label', 'Get Help');
  const supportLabel = get('header_support_label', 'Support Us');

  const navLinks =
    source === 'api' && apiNav.length > 0 && apiNav.some((n: any) => n.label && n.url)
      ? buildNavLinks(apiNav)
      : defaultNavLinks;

  const isLightPage = forceScrolled || pathname.startsWith('/insights') || pathname.startsWith('/what-we-do') || pathname.startsWith('/gallery');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isScrolled = scrolled || isLightPage;

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={isScrolled ? '/images/assets/LOGO-transparent.png' : '/images/assets/LOGO.jpeg'}
            alt="SHEDAM"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <div className="hidden sm:block">
            <p className={`font-heading text-sm font-bold leading-tight transition-colors ${isScrolled ? 'text-[#1A2332]' : 'text-white'}`}>
              {get('site_short_name', 'SHEDAM')}
            </p>
            <p className={`text-[10px] leading-tight transition-colors ${isScrolled ? 'text-gray-500' : 'text-white/60'}`}>
              {get('site_tagline', 'Mental Health Initiative')}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && handleMouseEnter(link.label)}
              onMouseLeave={() => link.children && handleMouseLeave()}
            >
              {link.children ? (
                <button
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isScrolled
                      ? 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isScrolled
                      ? 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              )}
              {link.children && openDropdown === link.label && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 rounded-lg bg-white py-2 shadow-lg border border-gray-100"
                  onMouseEnter={() => handleMouseEnter(link.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {child.label}
                    </Link>
                  ))}
                  <div className="mx-4 mt-1 border-t border-gray-100 pt-1">
                    <Link
                      href={link.href}
                      className="block px-4 py-2 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      View All {link.label} →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/get-help"
            className={`hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              isScrolled
                ? 'border border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                : 'border border-white/30 text-white hover:bg-white/10'
            }`}
          >
            <Heart className="h-4 w-4" />
            {helpLabel}
          </Link>
          <Link
            href="/get-involved"
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              isScrolled
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-white text-[#1A2332] hover:bg-white/90'
            }`}
          >
            {supportLabel}
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
          <nav className="mx-auto max-w-7xl px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.label && (
                      <div className="pl-4 pb-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-500 hover:text-primary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-xs font-medium text-primary"
                        >
                          View All →
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-primary/5 hover:text-primary rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3 space-y-2">
              <Link
                href="/get-help"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                <Heart className="h-4 w-4" />
                {helpLabel}
              </Link>
              <Link
                href="/get-involved"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
              >
                {supportLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
