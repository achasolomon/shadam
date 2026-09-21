import Link from 'next/link';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-white">SHEDAM</p>
                <p className="text-[10px] text-gray-400">Mental Health Initiative</p>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-400">
              Creating Awareness. Breaking the Stigma. Connecting People to Professional Help.
            </p>
            <div className="mt-6 space-y-2">
              <a href="mailto:info@shedam.org" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                <Mail className="h-4 w-4" /> info@shedam.org
              </a>
              <a href="tel:+234XXXXXXXXXX" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                <Phone className="h-4 w-4" /> +234 XXX XXX XXXX
              </a>
            </div>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-secondary text-gray-400 transition-colors hover:bg-primary hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'What We Do', href: '/what-we-do' },
                { label: 'Projects', href: '/projects' },
                { label: 'Events', href: '/events' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-white">Get Involved</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Volunteer', href: '/get-involved' },
                { label: 'Partner With Us', href: '/get-involved' },
                { label: 'Support Us', href: '/get-involved' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-heading text-sm font-semibold text-white">Resources</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Get Help', href: '/get-help' },
                { label: 'Insights', href: '/insights' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="rounded-lg bg-dark-secondary p-6">
              <h3 className="font-heading text-lg font-semibold text-white">Need Support?</h3>
              <p className="mt-2 text-sm text-gray-400">It is okay to talk. It is okay to ask for help.</p>
              <Link href="/get-help" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
                Get Help Now
              </Link>
              <div className="mt-4 border-t border-dark pt-4">
                <p className="text-xs text-gray-500">Or call:</p>
                <a href="tel:+234XXXXXXXXXX" className="text-sm font-medium text-white">0805 177 2262</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-secondary py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SHEDAM Mental Health Initiative. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-400">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
