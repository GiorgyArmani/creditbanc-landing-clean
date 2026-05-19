import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import CashFlowGapCalculator from '@/components/CashFlowGapCalculator';
import { FloatingSupport } from '@/components/floating-support';

export const metadata: Metadata = {
  title: 'Cash Flow Gap Calculator — Plan Your Funding Need',
  description:
    'Free planning tool from Credit Banc. Estimate your short-term cash flow gap, suggested funding target, and readiness score before talking to a lender.',
  alternates: { canonical: '/cash-flow-gap' },
  openGraph: {
    title: 'Cash Flow Gap Calculator | Credit Banc',
    description:
      'Estimate your short-term cash flow gap and suggested funding target with the free Credit Banc planning tool.',
    type: 'website',
  },
};

export default function CashFlowGapPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <CashFlowGapCalculator />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
