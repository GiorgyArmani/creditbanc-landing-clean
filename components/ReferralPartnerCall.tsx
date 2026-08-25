
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { CheckCircle2, CalendarClock } from 'lucide-react';

// GHL / LeadConnector booking calendar for the post-referral scheduling step
// (the calendar embedded on the live /referral-partner-call page). SAME calendar
// on every referral link — only the `referral_partner` URL param changes, which
// we forward into the iframe for attribution.
const BOOKING_ID = 'EmxnhSGwilS1s0MXYOIQ';
const IFRAME_ID = `cb_referral_booking_${BOOKING_ID}`;

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function ReferralPartnerCall() {
  return (
    <div className="bg-surface">
      {/* ---------- Dark hero — confirmation ---------- */}
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

        {/* Logo-only header, deliberately not a link home — this page is the
            booking step, so we don't give visitors a way to wander off. */}
        <header className="relative max-w-5xl mx-auto flex items-center justify-center sm:justify-start py-2 sm:py-3">
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
        </header>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto text-center pt-10 sm:pt-14"
        >
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center justify-center"
          >
            <CheckCircle2 className="h-14 w-14 text-primary" />
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4"
          >
            Application Received
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[0.95]"
          >
            We&rsquo;ve Got Your <span className="text-primary">Info!</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/80"
          >
            We will be in touch soon to walk you through your funding options.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl font-headline text-lg sm:text-xl font-bold text-white"
          >
            Want to skip the wait? Pick a time on the calendar below that works
            best for you.
          </motion.p>
        </motion.div>
      </section>

      {/* ---------- Calendar ---------- */}
      <section className="relative px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
        {/* Wide enough (>~992px) that GHL renders its side-by-side
            advisor-info + calendar layout instead of the stacked mobile view. */}
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8 flex items-center justify-center gap-2 text-on-secondary-fixed"
          >
            <CalendarClock className="h-5 w-5 text-primary" />
            <span className="font-headline text-lg font-bold">
              Book your 15-minute strategy call
            </span>
          </motion.div>

          <Suspense
            fallback={
              <div className="w-full min-h-[700px] rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)] flex items-center justify-center">
                <span className="text-on-surface-variant text-sm">
                  Loading your calendar…
                </span>
              </div>
            }
          >
            <BookingCalendar />
          </Suspense>
        </div>
      </section>

      {/* GHL resize script — auto-fits the booking iframe height. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

// Reads campaign + referral URL params to prefill the GHL booking form and
// preserve partner attribution. Isolated behind Suspense so only the calendar
// hydrates on the client while the copy above stays prerendered.
function BookingCalendar() {
  const params = useSearchParams();

  const rawFirst = params.get('firstName') || params.get('first_name') || '';
  const rawLast = params.get('lastName') || params.get('last_name') || '';
  const rawFull = params.get('full_name') || params.get('name') || '';
  const email = params.get('email') || '';
  const phone = params.get('phone') || '';

  const fullName =
    rawFull.trim() ||
    [rawFirst, rawLast]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(' ');
  const firstSpace = fullName.indexOf(' ');
  const firstName = (
    rawFirst.trim() ||
    (firstSpace === -1 ? fullName : fullName.slice(0, firstSpace))
  ).trim();
  const lastName = (
    rawLast.trim() || (firstSpace === -1 ? '' : fullName.slice(firstSpace + 1))
  ).trim();

  const bookingSrc = (() => {
    const url = new URL(
      `https://api.leadconnectorhq.com/widget/booking/${BOOKING_ID}`
    );
    // Preserve every incoming param (referral_partner + any attribution).
    params.forEach((value, key) => {
      if (value) url.searchParams.set(key, value);
    });
    if (firstName) url.searchParams.set('first_name', firstName);
    if (lastName) url.searchParams.set('last_name', lastName);
    if (email) url.searchParams.set('email', email);
    if (phone) url.searchParams.set('phone', phone);
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
        key={bookingSrc}
        src={bookingSrc}
        id={IFRAME_ID}
        title="Schedule a call with Credit Banc"
        scrolling="no"
        style={{
          width: '100%',
          minHeight: '700px',
          border: 'none',
          overflow: 'hidden',
        }}
      />
    </motion.div>
  );
}
