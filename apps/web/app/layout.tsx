import type { Metadata } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { DonationModalProvider } from '@/components/public/donation-modal';
import { RegistrationModalProvider } from '@/components/public/registration-modal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
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
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen bg-surface font-sans antialiased">
        <DonationModalProvider>
          <RegistrationModalProvider>
            {children}
          </RegistrationModalProvider>
        </DonationModalProvider>
      </body>
    </html>
  );
}
