import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Mail, Search, ArrowRight, Rocket } from 'lucide-react';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'You’re In! — Business Credit Builder 101 | Credit Banc',
  description:
    'Your free Business Credit Builder 101 Course is on its way. Check your email for instant access.',
  alternates: { canonical: '/business-credit-builder/confirmation' },
  // Post-conversion funnel page — keep it out of search results.
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    icon: Mail,
    title: 'Check your email',
    body: 'Your instant access to the course is waiting in your inbox right now.',
  },
  {
    icon: Search,
    title: 'Don’t see it? Check spam & promotions',
    body: 'If it’s not there in a few minutes, dig through your spam or promotions folder. Trust us, it’s worth digging for.',
  },
];

export default function BusinessCreditBuilderConfirmationPage() {
  return (
    <>
      <main className="bg-surface">
        {/* Navy header band with logo + green success badge */}
        <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-8 sm:pt-10 pb-24 sm:pb-32">
          <div
            aria-hidden
            className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            }}
          />

          <header className="relative max-w-5xl mx-auto flex items-center justify-center sm:justify-start py-2 sm:py-3">
            <Link href="/" aria-label="Credit Banc home" className="inline-flex">
              <Image
                src="/cb%20logo%20white.svg"
                alt="Credit Banc — Credit & capital to grow"
                width={400}
                height={100}
                priority
                unoptimized
                className="h-10 sm:h-12"
                style={{ width: 'auto' }}
              />
            </Link>
          </header>

          <div className="relative max-w-3xl mx-auto text-center pt-10 sm:pt-14">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-secondary-fixed shadow-[0_12px_30px_-8px_rgba(85,207,158,0.7)]">
              <Check className="h-8 w-8" strokeWidth={3} />
            </span>
            <p className="mt-6 font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">
              You’re In
            </p>
            <h1 className="mt-3 font-headline text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tighter text-white leading-[0.98]">
              Congrats! You’re officially on your way to{' '}
              <span className="text-primary">rock-solid business credit.</span>
            </h1>
          </div>
        </section>

        {/* Next-step card, pulled up over the navy band */}
        <section className="relative px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="relative max-w-2xl mx-auto -mt-16 sm:-mt-20">
            <div className="rounded-2xl bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-[0_24px_60px_-25px_rgba(0,3,33,0.25)] p-6 sm:p-9">
              <ul className="space-y-6">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.title} className="flex items-start gap-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-headline text-lg font-bold text-on-secondary-fixed">
                          {step.title}
                        </h2>
                        <p className="mt-1 text-base leading-relaxed text-on-surface-variant">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Funnel continuation — if they're ready to grow, send them to apply */}
              <div className="mt-8 rounded-xl bg-on-secondary-fixed/[0.04] ring-1 ring-outline-variant/40 p-5 text-center">
                <div className="inline-flex items-center gap-2 text-on-secondary-fixed">
                  <Rocket className="h-5 w-5 text-primary" />
                  <span className="font-headline text-base font-bold">
                    Already ready to grow?
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  If you need capital now, skip the wait and start your
                  application. It only takes a few minutes.
                </p>
                <Link
                  href="/apply-now"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-headline text-sm font-bold text-on-secondary-fixed shadow-[0_12px_30px_-10px_rgba(85,207,158,0.6)] transition-transform hover:scale-[1.03]"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-on-surface-variant">
              <Link
                href="/"
                className="font-medium text-on-secondary-fixed underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                Back to Credit Banc home
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
