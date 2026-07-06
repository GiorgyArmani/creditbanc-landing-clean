'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Check, ArrowRight, Compass, MessageSquare, Route } from 'lucide-react';

// GHL / LeadConnector form powering the referral-partner flow. This is the
// SAME form on every referral link — the only thing that changes between links
// is the `referral_partner` URL param (e.g. ?referral_partner=ali_ghamlouch),
// which we forward into the iframe so GHL attributes the lead to that partner.
const FORM_ID = '464V3O5j0asb8JR3uqbL';
const FORM_IFRAME_ID = `inline-${FORM_ID}`;

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const HELP_ITEMS = [
  'Access working capital',
  'Improve cash flow',
  'Explore financing options that fit the business',
  'Consolidate existing debt',
  'Compare SBA, term loans, lines of credit, and more',
];

const STEPS = [
  {
    icon: Compass,
    title: 'Send Us the Basics',
    body: 'Start by sharing a little information about your business and what you need. From there, you can schedule a call with a Credit Banc Advisor.',
  },
  {
    icon: MessageSquare,
    title: 'Get One-on-One Guidance',
    body: 'You’ll talk with a dedicated Advisor who looks at your situation, walks you through the options, and helps you sort out what actually makes sense. No one-size-fits-all script.',
  },
  {
    icon: Route,
    title: 'Build the Right Next Step',
    body: 'If there’s a fit, your Advisor will help you move forward with a plan that works for your business. And the support does not stop at funding. We stay involved to help you think through repayment, future needs, and what comes next.',
  },
];

export default function ReferralPartner() {
  return (
    <div className="bg-surface">
      {/* ---------- Dark hero ---------- */}
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-8 sm:pt-10 pb-16 sm:pb-20">
        <motion.div
          aria-hidden
          className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
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
          <a href="/" aria-label="Credit Banc home" className="inline-flex">
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
          </a>
        </header>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto text-center pt-10 sm:pt-14"
        >
          <motion.p
            variants={fadeUp}
            className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4"
          >
            Referral Partner Portal
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[0.95]"
          >
            You Were Sent Here for a{' '}
            <span className="text-primary">Reason.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/80"
          >
            If a CPA, banker, consultant, or another trusted contact sent you our
            way, you&rsquo;re in the right place. Credit Banc helps business
            owners sort through funding options, cut through the noise, and
            figure out what actually makes sense.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-headline text-base font-bold text-on-secondary-fixed shadow-[0_12px_30px_-10px_rgba(85,207,158,0.6)] transition-transform hover:scale-[1.03]"
            >
              Show Me My Options
              <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------- Help copy (left) beside the form (right) ---------- */}
      <section
        id="get-started"
        className="relative px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24 scroll-mt-6"
      >
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-14 items-start">
          {/* Left column — supporting copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-xl lg:pt-4"
          >
            <motion.h2
              variants={fadeUp}
              className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-on-secondary-fixed"
            >
              Here&rsquo;s How We Can Help
            </motion.h2>

            <motion.ul variants={fadeUp} className="mt-6 space-y-3">
              {HELP_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base sm:text-lg text-on-surface-variant leading-relaxed"
                >
                  <Check className="h-5 w-5 shrink-0 text-primary mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.blockquote
              variants={fadeUp}
              className="mt-8 border-l-4 border-primary pl-5"
            >
              <p className="font-headline text-xl sm:text-2xl font-bold text-on-secondary-fixed leading-snug">
                A fast yes is great. A smart yes is better.
              </p>
            </motion.blockquote>

            <motion.p
              variants={fadeUp}
              className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface-variant"
            >
              Start by sharing a little information about your business and what
              you need. From there, you can schedule a call with a Credit Banc
              Advisor.
            </motion.p>
          </motion.div>

          {/* Right column — GHL referral form. It reads URL params (referral
              partner + any campaign fields) for attribution/prefill, so it
              lives in its own Suspense child. That keeps the copy above it
              prerendered as static HTML while only the form hydrates. */}
          <Suspense
            fallback={
              <div className="w-full min-h-[1036px] rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)] flex items-center justify-center">
                <span className="text-on-surface-variant text-sm">
                  Loading your form…
                </span>
              </div>
            }
          >
            <ReferralForm />
          </Suspense>
        </div>
      </section>

      {/* ---------- How it works — deep emerald band ---------- */}
      <section
        className="relative overflow-hidden px-6 sm:px-8 py-16 sm:py-24"
        style={{
          background:
            'linear-gradient(135deg, #10402c 0%, #1f6b4e 55%, #2ea878 100%)',
        }}
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
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center font-headline text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white"
          >
            Here&rsquo;s How It Works
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  className="relative rounded-2xl bg-white/[0.07] backdrop-blur-sm ring-1 ring-white/15 p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-secondary-fixed">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-headline text-sm font-black text-primary tracking-wider">
                      STEP {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-headline text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-white/80">
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* GHL resize script — auto-fits the embedded form's height. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

// Isolated so its useSearchParams() only pushes the form (not the whole page)
// behind a Suspense boundary at build time. Forwards every incoming URL param
// to the GHL form so the referral_partner slug (and any campaign/prefill
// fields) reach LeadConnector for attribution.
function ReferralForm() {
  const params = useSearchParams();

  const formSrc = (() => {
    const url = new URL(
      `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`
    );
    params.forEach((value, key) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      className="w-full overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)]"
    >
      <iframe
        key={formSrc}
        src={formSrc}
        id={FORM_IFRAME_ID}
        title="Referral Partner Form"
        data-layout="{'id':'INLINE'}"
        data-form-id={FORM_ID}
        data-form-name="Referral Partner Form"
        data-height="1036"
        data-layout-iframe-id={FORM_IFRAME_ID}
        data-trigger-type="alwaysShow"
        data-activation-type="alwaysActivated"
        data-deactivation-type="neverDeactivate"
        scrolling="no"
        style={{
          width: '100%',
          minHeight: '1036px',
          border: 'none',
          overflow: 'hidden',
        }}
      />
    </motion.div>
  );
}
