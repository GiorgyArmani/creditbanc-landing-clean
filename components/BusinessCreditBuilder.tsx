'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Check, ArrowRight } from 'lucide-react';

// GHL / LeadConnector opt-in form for the free Business Credit Builder 101
// course. Same embed pattern as the referral-partner page: the iframe reads
// incoming URL params (utm/campaign) so GHL can attribute the lead.
const FORM_ID = 'AT5ZqbMvaRSJDU0yHWsb';
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

const LEARN_ITEMS = [
  'Set up your business the right way',
  'Build credit profiles that matter',
  'Fix errors holding you back',
  'Grow your score and get approved',
];

const TESTIMONIALS = [
  {
    name: 'Jose L.',
    label: 'General Contractor',
    quote:
      'Honestly, I thought business credit was just something for big companies. This course made it simple, and now I’ve got three vendors reporting under my EIN.',
  },
  {
    name: 'Bill G.',
    label: 'Pressure Washing',
    quote:
      'After months of watching random videos, this was the first time it actually clicked. I followed the steps and finally built my first real business credit profile.',
  },
  {
    name: 'Janelle B.',
    label: 'Online Boutique',
    quote:
      'I cleaned up my reports, got a DUNS number, and opened two new accounts in less than 30 days. I finally feel like my business looks legit to lenders.',
  },
];

const FAQS = [
  {
    q: 'Is this course really free?',
    a: 'Yep. No fees, no credit card required. Just real info and tools to help you build your business credit the right way.',
  },
  {
    q: 'Who is this course for?',
    a: 'It’s built for small business owners (new, growing, or even struggling) who want to stop using personal credit and start getting approved under their business name.',
  },
  {
    q: 'Do I need good personal credit to use this?',
    a: 'Not at all. This course is focused on helping you build business credit, which means getting approvals without relying on your personal score or guarantees.',
  },
  {
    q: 'What if I already started building business credit?',
    a: 'Perfect. This course can help you clean up mistakes, fix your reports, and get to the next level faster.',
  },
  {
    q: 'How long does it take to see results?',
    a: 'Some of our users see accounts reporting in 30 to 60 days. But it depends on your setup and consistency. This isn’t an overnight thing, but it works.',
  },
  {
    q: 'Will someone help me if I get stuck?',
    a: 'Yep. You can book a free 15-minute call with a Credit Banc advisor anytime for one-on-one help. We also offer business credit repair services if things are messy and you need extra support.',
  },
];

export default function BusinessCreditBuilder() {
  return (
    <div className="bg-surface">
      {/* ---------- Dark hero ---------- */}
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-8 sm:pt-10 pb-16 sm:pb-24">
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

        <div className="relative max-w-6xl mx-auto pt-10 sm:pt-14">
          {/* Full-width headline above the columns */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4"
            >
              Free Business Credit Builder 101 Course
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-headline text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[0.98]"
            >
              You Built the Business.{' '}
              <span className="text-primary">
                We&rsquo;ll Help You Build the Credit.
              </span>
            </motion.h1>
          </motion.div>

          {/* Columns: copy + button (left), image (right) */}
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-8 items-center mt-8 lg:mt-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.p
                variants={fadeUp}
                className="mx-auto lg:mx-0 max-w-2xl text-xl sm:text-2xl leading-relaxed text-white/80"
              >
                Want bigger approvals, better terms, and no personal guarantees?
                Our free course shows you how to fix it, build it, and get
                approved, fast. And if you need extra help, our team is ready
                with expert support and credit repair when you need it most.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8">
                <a
                  href="#get-started"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-headline text-base font-bold text-on-secondary-fixed shadow-[0_12px_30px_-10px_rgba(85,207,158,0.6)] transition-transform hover:scale-[1.03]"
                >
                  Get Instant Access
                  <ArrowRight className="h-5 w-5" />
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
              className="relative flex items-center justify-center lg:justify-start lg:self-end lg:-mb-24 lg:overflow-visible"
            >
              <Image
                src="/no%20circle.png"
                alt="Credit Banc FICO Gym — flexing your business credit score"
                width={830}
                height={555}
                priority
                className="w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-[130%] xl:w-[148%] h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- What makes it different (left) beside the form (right) ---------- */}
      <section
        id="get-started"
        className="relative px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24 scroll-mt-6"
      >
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_minmax(0,440px)] gap-10 lg:gap-14 items-start">
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
              There are a million credit building courses out there. What makes
              this one different?
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="mt-8 space-y-5 text-base text-on-surface-variant leading-relaxed"
            >
              <p>
                Glad you asked! We took all the complicated, jargon-filled crap
                about business credit and broke it down into 4 short,
                easy-to-follow videos. No MBA required. No robot narrators. Just
                straight talk, real steps, and the occasional dad joke.
              </p>
              <p>
                You&rsquo;ll also get checklists, downloads, and tools to keep
                you on track, because building business credit shouldn&rsquo;t
                feel like a guessing game.
              </p>
              <p>
                And if you need help along the way, our advisors (and credit
                repair team) are ready when you are.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 rounded-2xl bg-surface-container-low/60 ring-1 ring-outline-variant/40 p-6"
            >
              <p className="font-headline text-lg font-bold text-on-secondary-fixed">
                You&rsquo;ll learn how to:
              </p>
              <ul className="mt-4 space-y-3">
                {LEARN_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base text-on-surface-variant leading-relaxed"
                  >
                    <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Right column — GHL opt-in form. Reads URL params for attribution,
              so it lives in its own Suspense child (keeps the copy static). */}
          <div className="lg:sticky lg:top-8">
            <div className="rounded-2xl bg-on-secondary-fixed px-5 pt-5 pb-3 shadow-[0_24px_60px_-25px_rgba(0,3,33,0.35)]">
              <p className="text-center font-headline text-xl font-extrabold text-white">
                Get Instant Access
              </p>
              <p className="mt-1 text-center text-sm text-white/70">
                Free course. No credit card required.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl bg-surface-container-lowest">
                <Suspense
                  fallback={
                    <div className="w-full min-h-[666px] flex items-center justify-center">
                      <span className="text-on-surface-variant text-sm">
                        Loading your form…
                      </span>
                    </div>
                  }
                >
                  <OptInForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Testimonials — deep emerald band ---------- */}
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
            What Others Are Saying
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {TESTIMONIALS.map((t) => (
              <motion.figure
                key={t.name}
                variants={fadeUp}
                className="relative rounded-2xl bg-white/[0.07] backdrop-blur-sm ring-1 ring-white/15 p-7 flex flex-col"
              >
                <blockquote className="text-base leading-relaxed text-white/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary font-headline text-sm font-black text-on-secondary-fixed">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                  <span>
                    <span className="block font-headline text-sm font-bold text-white">
                      {t.name}
                    </span>
                    <span className="block text-xs text-white/70">
                      {t.label}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="relative px-6 sm:px-8 py-16 sm:py-24">
        <div className="relative max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-on-secondary-fixed"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="mt-10 space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-surface-container-low/60 ring-1 ring-outline-variant/40 px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-headline text-lg font-bold text-on-secondary-fixed">
                  {faq.q}
                  <span className="shrink-0 text-primary transition-transform duration-200 group-open:rotate-45">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final CTA — deep emerald band ---------- */}
      <section
        className="relative overflow-hidden px-6 sm:px-8 py-16 sm:py-20"
        style={{
          background:
            'linear-gradient(135deg, #10402c 0%, #1f6b4e 55%, #2ea878 100%)',
        }}
      >
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-headline text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white"
          >
            Ready to Build Credit That Works for Your Business?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-white/85"
          >
            Grab the free Business Credit Builder 101 Course and start getting
            approved under your business name.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mt-8"
          >
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-headline text-base font-bold text-on-secondary-fixed shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.03]"
            >
              Sign Me Up
              <ArrowRight className="h-5 w-5" />
            </a>
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
// to the GHL form so campaign/attribution fields reach LeadConnector.
function OptInForm() {
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
    <iframe
      key={formSrc}
      src={formSrc}
      id={FORM_IFRAME_ID}
      title="Business Credit Builder 101 Opt-In Form"
      data-layout="{'id':'INLINE'}"
      data-form-id={FORM_ID}
      data-form-name="Credit Builder Course - NEW FORM"
      data-height="555"
      data-layout-iframe-id={FORM_IFRAME_ID}
      data-trigger-type="alwaysShow"
      data-activation-type="alwaysActivated"
      data-deactivation-type="neverDeactivate"
      scrolling="no"
      style={{
        width: '100%',
        minHeight: '555px',
        border: 'none',
        overflow: 'hidden',
      }}
    />
  );
}
