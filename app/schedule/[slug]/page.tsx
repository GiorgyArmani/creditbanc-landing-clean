import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Footer from '@/components/sections/Footer';
import FAQ from '@/components/sections/FAQ';
import ScheduleACall from '@/components/ScheduleACall';
import { getAdvisorBySlug, bookingSlugs } from '@/lib/team';
import { personLd } from '@/lib/schema';

// One dynamic route serves every advisor's booking page. Add an advisor (with a
// `slug`) in lib/team.ts and their /schedule/[slug] page exists automatically —
// no new file per advisor.
export const dynamicParams = false;

export function generateStaticParams() {
  return bookingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const advisor = getAdvisorBySlug(slug);
  if (!advisor) return {};
  const name = advisor.fullName ?? advisor.name;
  return {
    title: `Schedule a Call with ${name} — Credit Banc`,
    description: `Book a free 15-minute strategy call with ${name}, your Credit Banc Business Advisor. Get clear, get strategic, and build a funding plan that fits your business.`,
    alternates: { canonical: `/schedule/${slug}` },
    openGraph: {
      title: `Schedule a Call with ${name} | Credit Banc`,
      description: `Book a free 15-minute strategy call with ${name}.`,
      type: 'website',
    },
  };
}

export default async function AdvisorSchedulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const advisor = getAdvisorBySlug(slug);
  if (!advisor) notFound();

  return (
    <>
      {/* Person schema for this advisor — name, role, direct line, and their
          public profiles, linked to the Credit Banc org node. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd(advisor)) }}
      />
      <main className="bg-surface">
        <Suspense fallback={<ScheduleFallback />}>
          <ScheduleACall
            advisor={{
              name: advisor.fullName ?? advisor.name,
              calendarId: advisor.calendarId,
              phone: advisor.phone,
              email: advisor.email,
              photo: advisor.photo,
              role: advisor.role,
            }}
          />
        </Suspense>
        <FAQ variant="green" />
      </main>
      <Footer />
    </>
  );
}

function ScheduleFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-on-surface-variant text-sm">
        Loading your calendar…
      </div>
    </div>
  );
}
