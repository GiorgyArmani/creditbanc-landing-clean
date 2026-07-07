import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from '@/components/sections/Footer';
import BusinessCreditBuilder from '@/components/BusinessCreditBuilder';

export const metadata: Metadata = {
  title: 'Free Business Credit Builder 101 Course — Credit Banc',
  description:
    'You built the business. We’ll help you build the credit. Our free Business Credit Builder 101 Course shows you how to get bigger approvals, better terms, and no personal guarantees.',
  alternates: { canonical: '/business-credit-builder' },
  openGraph: {
    title: 'Free Business Credit Builder 101 Course | Credit Banc',
    description:
      'Four short videos, checklists, and real advisors. Learn how to set up your business the right way, build credit profiles that matter, and get approved under your business name.',
    type: 'website',
  },
};

export default function BusinessCreditBuilderPage() {
  return (
    <>
      <main className="bg-surface">
        <Suspense fallback={<Fallback />}>
          <BusinessCreditBuilder />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-on-surface-variant text-sm">Loading…</div>
    </div>
  );
}
