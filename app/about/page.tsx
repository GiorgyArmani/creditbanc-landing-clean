import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import AboutTeam from '@/components/sections/AboutTeam';
import Spotlight from '@/components/sections/Spotlight';
import CTA from '@/components/sections/CTA';
import { FloatingSupport } from '@/components/floating-support';

export const metadata: Metadata = {
  title: 'About Credit Banc — Meet the People Behind the Funding',
  description:
    'Credit Banc is built around real Advisors who help business owners compare options, understand the structure, and choose capital that fits. Meet the team and see us in the press.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Credit Banc | Meet the People Behind the Funding',
    description:
      'Real Advisors who help business owners compare financing options and choose capital that actually fits the move they are trying to make.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <AboutTeam />
        <Spotlight />
        <CTA />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
