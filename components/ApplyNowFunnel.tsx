'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';

const FORM_ID = 'n4aCgud8X9ItLI36ZRch';
const FORM_BASE = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`;

const METRICS: Array<{ value: string; label: string; valueClass?: string }> = [
  { value: '$2B+', label: 'Capital Deployed' },
  { value: '15k+', label: 'Businesses Funded' },
  {
    value: 'Advisor Support',
    label: 'Not lender roulette.',
    valueClass: 'text-xl sm:text-2xl xl:text-3xl',
  },
];

const STEPS = [
  {
    title: 'Have a chat with your Advisor.',
    body: "We'll look at your numbers, cash flow, debt, timing, and funding goal. Tiny details. Expensive if ignored.",
  },
  {
    title: 'Compare your options.',
    body: 'Term loan, SBA, line of credit, equipment financing, consolidation, or a very honest "not yet."',
  },
  {
    title: 'Move through the process.',
    body: 'Documents, lender questions, next steps, closing details. Your Advisor helps keep the paperwork circus contained.',
  },
  {
    title: 'Get funded. Then keep going.',
    body: 'Money in the account is the first win. Knowing what to do with it next is where we stay useful.',
  },
];

export default function ApplyNowFunnel() {
  const params = useSearchParams();
  const firstName = params.get('firstName') || '';
  const lastName = params.get('lastName') || '';
  const email = params.get('email') || '';
  const phone = params.get('phone') || '';

  // GoHighLevel / LeadConnector forms accept query-string prefill keyed on
  // each field's API name. Common defaults (first_name, last_name, email,
  // phone) match Credit Banc's Master Form. Adjust the keys here if the
  // form's field API names are renamed.
  const iframeSrc = (() => {
    const url = new URL(FORM_BASE);
    if (firstName) url.searchParams.set('first_name', firstName);
    if (lastName) url.searchParams.set('last_name', lastName);
    if (email) url.searchParams.set('email', email);
    if (phone) url.searchParams.set('phone', phone);
    return url.toString();
  })();

  return (
    <section className="px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Two-column hero: headline left, "how this works" card right */}
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center mb-12 sm:mb-16">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-on-secondary-fixed leading-[0.95] mb-6"
            >
              {firstName ? (
                <>
                  Almost there,{' '}
                  <span
                    className="relative inline-block px-3 pb-2 text-white"
                    style={{ isolation: 'isolate' }}
                  >
                    <motion.span
                      aria-hidden
                      className="absolute top-1 -bottom-0 left-0 right-0 bg-primary-container rounded-sm"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ originX: 0, zIndex: 0 }}
                    />
                    <span className="relative" style={{ zIndex: 1 }}>
                      {firstName.charAt(0).toUpperCase() + firstName.slice(1)}.
                    </span>
                  </span>
                </>
              ) : (
                <>
                  Lock in your{' '}
                  <span
                    className="relative inline-block px-3 text-white"
                    style={{ isolation: 'isolate' }}
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-1 left-0 right-0 bg-primary-container rounded-sm"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ originX: 0, zIndex: 0 }}
                    />
                    <span className="relative" style={{ zIndex: 1 }}>
                      15-min call.
                    </span>
                  </span>
                </>
              )}
            </motion.h1>
            <p className="font-headline text-xl md:text-2xl xl:text-3xl font-bold tracking-tight text-on-surface-variant leading-snug">
              You bring the business.{' '}
              <span className="text-primary">
                We&rsquo;ll bring the funding.
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-5 sm:py-6 shadow-[0_12px_30px_-20px_rgba(0,3,33,0.18)] flex flex-col items-center justify-center text-center gap-2 min-h-[120px]"
                >
                  <p
                    className={`font-headline font-extrabold tracking-tight text-primary leading-[1.05] ${
                      m.valueClass ?? 'text-3xl sm:text-4xl xl:text-5xl'
                    }`}
                  >
                    {m.value}
                  </p>
                  <p className="font-label text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                    {m.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8 shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)]">
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-5">
              Here&rsquo;s how this works
            </p>
            <ol className="space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-secondary-fixed font-headline text-sm font-extrabold tabular-nums shadow-[0_8px_18px_-6px_rgba(85,207,158,0.55)]"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-headline text-base sm:text-lg font-extrabold text-on-secondary-fixed leading-snug">
                      {s.title}
                    </p>
                    <p className="text-sm text-on-surface-variant leading-relaxed mt-1">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Divider between hero and form */}
        <div className="max-w-3xl mx-auto mt-4 mb-10 sm:mb-14 flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/50" />
          <span className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            Start your application
          </span>
          <div className="flex-1 h-px bg-outline-variant/50" />
        </div>

        {/* Form iframe */}
        <div className="max-w-3xl mx-auto">
          <iframe
            src={iframeSrc}
            style={{
              width: '100%',
              height: '1294px',
              border: 'none',
              borderRadius: '4px',
            }}
            id={`inline-${FORM_ID}`}
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Master Form - Credit Banc"
            data-height="1294"
            data-layout-iframe-id={`inline-${FORM_ID}`}
            data-form-id={FORM_ID}
            title="Master Form - Credit Banc"
          />
        </div>
      </div>

      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </section>
  );
}
