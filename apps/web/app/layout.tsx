import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'SHEDAM Mental Health Initiative',
    template: '%s | SHEDAM Mental Health Initiative',
  },
  description:
    'Creating Awareness. Breaking the Stigma. Connecting People to Professional Help.',
  keywords: ['mental health', 'awareness', 'Nigeria', 'counselling', 'psychology', 'SHEDAM'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SHEDAM Mental Health Initiative',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-surface font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
