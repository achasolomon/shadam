'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@smhi/ui';
import { Container } from '@smhi/ui';
import { Menu, X, Heart } from 'lucide-react';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Projects', href: '/projects' },
  { label: 'Events', href: '/events' },
  { label: 'Insights', href: '/insights' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary lg:h-12 lg:w-12">
              <span className="text-lg font-bold text-white lg:text-xl">S</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading text-sm font-bold leading-tight text-dark lg:text-base">
                SHEDAM
              </p>
              <p className="text-[10px] leading-tight text-text-secondary lg:text-xs">
                Mental Health Initiative
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-primary-light hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/get-help" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Get Help
              </Button>
            </Link>
            <Link href="/get-involved/support-us">
              <Button size="sm">
                <Heart className="mr-2 h-4 w-4" />
                Support Us
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="rounded-md p-2 text-dark hover:bg-surface-alt lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-primary-light hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/get-help"
                className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary-light"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Help
              </Link>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
