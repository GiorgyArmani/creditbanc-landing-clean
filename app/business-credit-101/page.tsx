import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowRight } from 'lucide-react';
import CourseOptInForm from '@/components/CourseOptInForm';
import CourseStepper from '@/components/CourseStepper';
import { ROUTES, SITE } from '@/lib/site';

// Ad-friendly opt-in for the free Business Credit 101 course. Educational
// framing only (no approval/terms promises), same GHL form as
// /business-credit-builder so leads land in one workflow. Like
// /cash-flow-snapshot: no site nav, no footer link farm.
//
// noindex on purpose: /business-credit-builder is the course page search
// should rank. Not in the sitemap either.
export const metadata: Metadata = {
  title: 'Free Business Credit 101 Course',
  description:
    'Free four-part course on how business credit works: how profiles are created, what the bureaus track, how vendor reporting works, and how to monitor and strengthen your profile.',
  alternates: { canonical: '/business-credit-101' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Business Credit 101 | Credit Banc',
    description:
      "Your business has a credit profile. You should probably know what's in it.",
    type: 'website',
  },
};

const EMERALD_GRADIENT =
  'linear-gradient(135deg, #10402c 0%, #1f6b4e 55%, #2ea878 100%)';

export default function BusinessCredit101Page() {
  return (
    <>
      <header className="bg-surface border-b border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 sm:h-20 flex items-center">
          {/* Brand mark only, deliberately not a link back into the site. */}
          <Image
            src="/powered-by-shield.png"
            alt="Credit Banc, Powered by Shield Advisory Group"
            width={1128}
            height={191}
            priority
            unoptimized
            className="h-9 sm:h-11"
            style={{ width: 'auto' }}
          />
        </div>
      </header>

      <main className="bg-surface">
        {/* ---------- Cream hero: copy (left) beside the form (right) ---------- */}
        <section className="relative overflow-hidden px-6 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-3xl"
          />
          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_minmax(0,440px)] gap-10 lg:gap-14 items-start">
            <div className="max-w-2xl lg:pt-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3.5 py-1.5 font-label text-xs font-bold uppercase tracking-[0.2em] text-on-primary-container ring-1 ring-primary/30">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Free 4-Part Course
              </p>
              <h1 className="mt-5 font-headline text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tighter leading-[1.02] text-on-secondary-fixed">
                Your Business Has a Credit Profile.{' '}
                <span className="text-[#1f6b4e]">
                  You Should Probably Know What&rsquo;s In It.
                </span>
              </h1>

              <div className="mt-7 space-y-5 text-lg leading-relaxed text-on-surface-variant">
                <p>
                  Strong business credit can affect how your company is viewed
                  by vendors, suppliers, financial institutions, and other
                  businesses you work with.
                </p>
                <p>
                  The problem? A lot of business owners have no idea how
                  business credit works, what gets reported, or what may be
                  helping or hurting their profile.
                </p>
                <p className="font-semibold text-on-secondary-fixed">
                  This free four-part course breaks it down in plain English.
                </p>
              </div>
            </div>

            {/* Form card. Reads URL params for attribution, so it sits in its
                own Suspense child and the copy stays static. */}
            <div
              id="get-started"
              className="scroll-mt-6 lg:sticky lg:top-8"
            >
              <div
                className="rounded-3xl px-5 pt-6 pb-3 shadow-[0_24px_60px_-25px_rgba(16,64,44,0.55)]"
                style={{ background: EMERALD_GRADIENT }}
              >
                <p className="text-center font-headline text-xl font-extrabold text-white">
                  Get the Free Course
                </p>
                <p className="mt-1 text-center text-sm text-white/80">
                  Four parts. Plain English. No credit card.
                </p>
                <div className="mt-4 overflow-hidden rounded-2xl bg-surface-container-lowest">
                  <Suspense
                    fallback={
                      <div className="w-full min-h-[665px] flex items-center justify-center">
                        <span className="text-on-surface-variant text-sm">
                          Loading your form…
                        </span>
                      </div>
                    }
                  >
                    <CourseOptInForm form="optIn" />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- What You'll Learn: deep emerald band ---------- */}
        <section
          className="relative overflow-hidden px-6 sm:px-8 py-16 sm:py-24"
          style={{ background: EMERALD_GRADIENT }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            }}
          />
          <div className="relative max-w-6xl mx-auto">
            <p className="text-center font-label text-xs font-bold uppercase tracking-[0.2em] text-white/75">
              Inside the course
            </p>
            <h2 className="mt-3 text-center font-headline text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white">
              What You&rsquo;ll Learn
            </h2>

            <CourseStepper />
          </div>
        </section>

        {/* ---------- Closing nudge back to the form ---------- */}
        <section className="px-6 sm:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-on-secondary-fixed">
              Know what&rsquo;s on your profile before someone else checks it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-on-surface-variant">
              Four short parts, zero jargon, and it costs exactly nothing.
            </p>
            <a
              href="#get-started"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-on-secondary-fixed px-7 py-3.5 font-headline text-base font-bold text-white shadow-[0_12px_30px_-10px_rgba(32,37,54,0.5)] transition-transform hover:scale-[1.03]"
            >
              Get the Free Course
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-on-secondary-fixed px-6 sm:px-8 py-10 text-xs text-white/55">
        <div className="max-w-6xl mx-auto">
          <p className="max-w-3xl leading-relaxed text-white/70">
            Business Credit 101 is for educational purposes only. It does not
            constitute financial advice, credit repair services, or an offer of
            credit.
          </p>
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Credit Banc. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href={ROUTES.privacy} className="hover:text-white">
                Privacy Policy
              </Link>
              <a href={`mailto:${SITE.email}`} className="hover:text-white">
                {SITE.email}
              </a>
              <a href={SITE.phoneTel} className="hover:text-white">
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* GHL resize script: auto-fits the embedded form's height. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}
