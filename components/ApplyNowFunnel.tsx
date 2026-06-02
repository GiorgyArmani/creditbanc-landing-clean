'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useState } from 'react';

const FORM_ID = 'n4aCgud8X9ItLI36ZRch';
const FORM_BASE = `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`;

// GHL hidden source fields on the Master Form. Each key is the field's Query
// Key. `lead_source` is constant for the page; `appointment_source` defaults to
// `site` but a program card overrides it with its own slug (see Products.tsx),
// and any incoming URL param of the same key wins over these defaults.
const SOURCE_FIELD_DEFAULTS: Record<string, string> = {
  'lead_source_(dashboard_control)': 'site',
  appointment_source: 'site',
};

const METRICS: Array<{ value: string; label: string; valueClass?: string }> = [
  { value: '$2B+', label: 'Capital Deployed' },
  { value: '15k+', label: 'Businesses Funded' },
  {
    value: 'Advisor Support',
    label: 'Not lender roulette.',
    valueClass: 'text-xs sm:text-2xl xl:text-3xl',
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
  // Steps are collapsed on mobile so the form is reachable sooner; always
  // open on desktop (lg) regardless of this state via the `lg:block` override.
  const [stepsOpen, setStepsOpen] = useState(false);
  const params = useSearchParams();
  const firstName = params.get('firstName') || '';
  const lastName = params.get('lastName') || '';
  const email = params.get('email') || '';
  const phone = params.get('phone') || '';
  const businessName = params.get('businessName') || '';
  // Marketing interest tag handed off from a program card (Products.tsx).
  const interest = params.get('interest') || '';

  // The cash-flow handoff forms ("Book the call" section + results popup)
  // capture a single "Full name" string and pass it through as `firstName`.
  // The Master Form's name field is a single "Full Name", so prefill that —
  // and also split into first/last so prefill still works if the form is ever
  // switched to separate name fields.
  const fullName = [firstName, lastName]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(' ');
  const firstSpace = fullName.indexOf(' ');
  const splitFirst =
    firstSpace === -1 ? fullName : fullName.slice(0, firstSpace);
  const splitLast = firstSpace === -1 ? '' : fullName.slice(firstSpace + 1);

  // GoHighLevel / LeadConnector forms prefill from URL params whose key
  // matches each field's "Query Key" (configured per-field in the GHL form
  // builder). We send the common defaults plus a few aliases so the data
  // lands whether the form uses a single full-name field (full_name / name)
  // or split name fields (first_name / last_name).
  const iframeSrc = (() => {
    const url = new URL(FORM_BASE);
    if (fullName) {
      url.searchParams.set('full_name', fullName);
      url.searchParams.set('name', fullName);
      url.searchParams.set('first_name', splitFirst);
      if (splitLast) url.searchParams.set('last_name', splitLast);
    }
    if (email) url.searchParams.set('email', email);
    if (phone) url.searchParams.set('phone', phone);
    if (businessName) {
      url.searchParams.set('company_name', businessName);
      url.searchParams.set('business_name', businessName);
    }
    // Forward the program-card interest tag. The GHL Master Form needs a hidden
    // field whose Query Key is `interest`; its submitted value can then drive a
    // workflow that tags the contact (e.g. "interested: flexfund program").
    if (interest) url.searchParams.set('interest', interest);
    // Source attribution: default each hidden field to `ghl`, but let an
    // incoming URL param of the same key override it.
    for (const [key, fallback] of Object.entries(SOURCE_FIELD_DEFAULTS)) {
      url.searchParams.set(key, params.get(key) || fallback);
    }
    return url.toString();
  })();

  return (
    <section className="px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16 bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Centered hero: headline, subtext, metrics */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
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

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8">
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
                  className="rounded-lg sm:rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-2 py-3 sm:px-4 sm:py-6 shadow-[0_12px_30px_-20px_rgba(0,3,33,0.18)] flex flex-col items-center justify-center text-center gap-1 sm:gap-2 min-h-[84px] sm:min-h-[120px]"
                >
                  <p
                    className={`font-headline font-extrabold tracking-tight text-primary leading-[1.05] ${
                      m.valueClass ?? 'text-xl sm:text-4xl xl:text-5xl'
                    }`}
                  >
                    {m.value}
                  </p>
                  <p className="font-label text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.18em] text-on-surface-variant leading-tight">
                    {m.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider between hero and form */}
        <div className="max-w-6xl mx-auto mt-2 mb-10 sm:mb-14 flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/50" />
          <span className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            Start your application
          </span>
          <div className="flex-1 h-px bg-outline-variant/50" />
        </div>

        {/* Form (left) + "how this works" steps (right) on desktop.
            On mobile they stack — form first so it's reachable immediately,
            steps below it as a foldable card. */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start">
          {/* Form iframe */}
          <div>
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

          {/* How this works — beside the form on desktop (sticky), foldable on mobile */}
          <div className="relative rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8 shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)] lg:sticky lg:top-28">
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />
            {/* Single heading. On mobile it's a tap-to-expand toggle; on
                desktop the chevron hides and the list stays open (lg:block). */}
            <button
              type="button"
              onClick={() => setStepsOpen((v) => !v)}
              aria-expanded={stepsOpen}
              className="w-full flex items-center justify-between gap-3 mb-1 lg:mb-5 lg:cursor-default lg:pointer-events-none"
            >
              <span className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Here&rsquo;s how this works
              </span>
              <svg
                viewBox="0 0 24 24"
                className={`lg:hidden h-4 w-4 text-primary transition-transform duration-300 ${
                  stepsOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <ol
              className={`${
                stepsOpen ? 'block' : 'hidden'
              } lg:block space-y-5 mt-4 lg:mt-0`}
            >
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
      </div>

      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="lazyOnload"
      />
    </section>
  );
}
