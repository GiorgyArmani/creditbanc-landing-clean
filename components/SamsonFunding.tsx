'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Check, ArrowRight, Compass, MessageSquare, Route } from 'lucide-react';

// Co-branded referral landing page for Samson Funding, an MCA shop that sends
// us the deals it doesn't write itself (long-term, SBA, real estate, refis).
// Structurally a clone of components/ReferralPartner.tsx — same GHL form, same
// section rhythm — with Samson's amber as the partner accent and copy aimed at
// a business owner who already knows Samson.
const FORM_ID = '464V3O5j0asb8JR3uqbL';
const FORM_IFRAME_ID = `inline-samson-${FORM_ID}`;

// Baked into the form URL so every lead off this page is attributed to Samson
// without the link needing a query string. An explicit ?referral_partner= in
// the URL still wins, which is how a Samson rep gets their own sub-attribution.
const PARTNER_SLUG = 'samson_funding';

// Values pushed into the embedded form's payload on every submission.
//
// IMPORTANT — how tagging actually works in GHL: the embed can only prefill
// form FIELDS via query string, and only when the key here exactly matches a
// field on form FORM_ID (a standard field name, or a custom field's unique
// key). There is no `?tag=` param that GHL honors on its own. So to get a tag
// onto the contact record, two things must exist on the GHL side:
//
//   1. A hidden field on the form whose unique key matches a key below, and
//   2. A workflow triggered by "Form Submitted" that reads that field and
//      applies the tag (Add Contact Tag).
//
// Keys that don't match a field are simply ignored by GHL — harmless, so these
// are safe to ship before the GHL side is built. Rename a key here once the
// real field key is known; nothing else in this file needs to change.
const FORM_PAYLOAD: Record<string, string> = {
  referral_partner: PARTNER_SLUG,
  partner_tag: 'samson-funding',
  lead_source: 'samson-funding-landing',
};

const AMBER = '#fca702';

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
  'Working capital',
  'Equipment and inventory financing',
  'Business lines of credit',
  'Long-term business loans',
  'SBA financing',
  'Commercial real estate financing',
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

export default function SamsonFunding() {
  return (
    <div className="bg-surface">
      {/* ---------- Dark hero ---------- */}
      {/* Page has no Navbar, so the hero starts at the very top of the viewport
          and carries the extra top padding the nav spacer used to provide. */}
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20 lg:pb-0">
        {/* Amber blob nods to the partner, mint blob keeps it ours. */}
        <motion.div
          aria-hidden
          className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: 'rgba(252,167,2,0.22)' }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl pointer-events-none"
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

        {/* Co-brand lockup. The Samson mark is amber-on-black artwork, so it
            sits on a light chip to stay legible against the navy hero. */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative max-w-6xl mx-auto flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3"
        >
          <span className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]">
            <Image
              src="/samson-logo.png"
              alt="Samson Funding"
              width={496}
              height={62}
              priority
              className="h-7 sm:h-9 w-auto"
            />
          </span>
          <span
            aria-hidden
            className="h-6 w-px bg-white/25"
          />
          <span className="font-headline text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-white/70">
            Referral Partner of{' '}
            <span style={{ color: AMBER }}>Credit Banc</span>
          </span>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-6xl mx-auto pt-6 sm:pt-10 grid lg:grid-cols-[minmax(0,420px)_1fr] gap-6 lg:gap-14 items-center"
        >
          {/* Image — left */}
          <motion.div
            variants={fadeUp}
            className="relative flex justify-center lg:justify-start lg:self-end"
          >
            <Image
              src="/referral-partner.png"
              alt="A business owner reviewing funding options on their phone"
              width={560}
              height={840}
              priority
              className="w-44 sm:w-56 lg:w-full max-w-[420px] h-auto block align-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.45)]"
            />
          </motion.div>

          {/* Copy — right */}
          <motion.div variants={stagger} className="text-center lg:text-left">
            <motion.h1
              variants={fadeUp}
              className="font-headline text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tighter text-white leading-[1.02]"
            >
              Business Funding With Up to{' '}
              <span style={{ color: AMBER }}>10-Year Terms</span> and Monthly
              Payments
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto lg:mx-0 mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/80"
            >
              Samson Funding has partnered with Credit Banc to provide access to
              a nationwide lender network and a broader range of financing
              options, including lines of credit, equipment financing, A/R
              factoring, term loans, and more.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <a
                href="#get-started"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-headline text-base font-bold text-on-secondary-fixed shadow-[0_12px_30px_-10px_rgba(252,167,2,0.55)] transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: AMBER }}
              >
                Show Me My Options
                <ArrowRight className="h-5 w-5" />
              </a>
            </motion.div>
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
              More Ways to Fund Your Business
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-4 text-base sm:text-lg leading-relaxed text-on-surface-variant"
            >
              Through its partnership with Credit Banc, Samson Funding can now
              help business owners explore options beyond traditional short-term
              financing, including:
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-6 space-y-3">
              {HELP_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base sm:text-lg text-on-surface-variant leading-relaxed"
                >
                  <Check
                    className="h-5 w-5 shrink-0 mt-1"
                    style={{ color: AMBER }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.blockquote
              variants={fadeUp}
              className="mt-8 border-l-4 pl-5"
              style={{ borderColor: AMBER }}
            >
              <p className="font-headline text-xl sm:text-2xl font-bold text-on-secondary-fixed leading-snug">
                A fast yes is great. A smart yes is better.
              </p>
            </motion.blockquote>
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
            <SamsonForm />
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
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-on-secondary-fixed"
                      style={{ backgroundColor: AMBER }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className="font-headline text-sm font-black tracking-wider"
                      style={{ color: AMBER }}
                    >
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

          {/* Attribution line so the partnership reads clearly at the bottom of
              the flow, not just in the hero lockup. */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-12 text-center text-sm text-white/60"
          >
            Referred to you by{' '}
            <a
              href="https://www.samsonfunding.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
            >
              Samson Funding
            </a>
            . Funding programs are arranged by Credit Banc.
          </motion.p>
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
// behind a Suspense boundary at build time. Seeds the form with FORM_PAYLOAD,
// then lets any incoming URL params overwrite it — so a bare /samson-funding
// link still tags and attributes, and a rep-specific link still wins.
function SamsonForm() {
  const params = useSearchParams();

  const formSrc = (() => {
    const url = new URL(
      `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`
    );
    for (const [key, value] of Object.entries(FORM_PAYLOAD)) {
      url.searchParams.set(key, value);
    }
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
      className="w-full overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)] pt-6 sm:pt-8"
    >
      <iframe
        key={formSrc}
        src={formSrc}
        id={FORM_IFRAME_ID}
        title="Samson Funding Referral Form"
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
