import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SupportWidget } from '@/components/support-widget';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <SupportWidget />
    </>
  );
}
