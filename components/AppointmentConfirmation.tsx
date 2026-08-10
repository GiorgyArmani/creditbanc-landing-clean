'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  CalendarCheck,
  CalendarClock,
  Check,
  Mail,
  PhoneCall,
  FileText,
} from 'lucide-react';
import { SITE } from '@/lib/site';

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const STEPS = [
  {
    icon: Mail,
    title: 'Check your email',
    body: 'Your calendar invite and call link are already on the way. If it is not in the inbox, check spam or promotions.',
  },
  {
    icon: PhoneCall,
    title: 'Answer when we ring',
    body: `Your Advisor calls from ${SITE.phone}. Save it now so it does not land in the "unknown number, ignore it" pile.`,
  },
  {
    icon: FileText,
    title: 'Have your numbers handy',
    body: 'Rough monthly revenue, time in business, and what you want the capital to do. Nothing formal, just honest.',
  },
];

export default function AppointmentConfirmation({
  greetingName = '',
  startRaw = '',
}: {
  /** Booker's first name from the GHL redirect, already capitalized. */
  greetingName?: string;
  /** Raw appointment start from the GHL redirect (ISO with UTC offset). */
  startRaw?: string;
}) {
  // Format after mount only. The string carries its own UTC offset, so the
  // server and the visitor's browser would render different local times and
  // trip a hydration mismatch.
  const [startLabel, setStartLabel] = useState('');
  useEffect(() => {
    if (!startRaw) return;
    const d = new Date(startRaw);
    if (Number.isNaN(d.getTime())) return;
    setStartLabel(
      d.toLocaleString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    );
  }, [startRaw]);

  return (
    <div className="bg-surface">
      {/* ---------- Navy hero: booked ---------- */}
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-8 sm:pt-10 pb-24 sm:pb-32">
        <motion.div
          aria-hidden
          className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
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
              alt="Credit Banc, credit & capital to grow"
              width={400}
              height={100}
              priority
              unoptimized
              className="h-10 sm:h-12"
              style={{ width: 'auto' }}
            />
          </Link>
        </header>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-3xl mx-auto text-center pt-10 sm:pt-14"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-secondary-fixed shadow-[0_12px_30px_-8px_rgba(85,207,158,0.7)]"
          >
            <Check className="h-8 w-8" strokeWidth={3} />
          </motion.span>

          <motion.p
            variants={fadeUp}
            className="mt-6 font-label text-xs font-bold uppercase tracking-[0.2em] text-primary"
          >
            Appointment Confirmed
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-headline text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tighter text-white leading-[0.98]"
          >
            {greetingName ? (
              <>
                You&rsquo;re Booked, {greetingName}.
              </>
            ) : (
              <>You&rsquo;re Booked.</>
            )}{' '}
            <span className="text-primary whitespace-nowrap">
              Nice Work.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/80"
          >
            Your 15-minute call with a Credit Banc Advisor is on the calendar.
            No pitch deck, no script, just an honest read on your numbers and
            the capital that actually fits.
          </motion.p>

          {startLabel && (
            <motion.div
              variants={fadeUp}
              className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full bg-white/10 ring-1 ring-white/20 px-5 py-3"
            >
              <CalendarCheck className="h-5 w-5 shrink-0 text-primary" />
              <span className="font-headline text-sm sm:text-base font-bold text-white">
                {startLabel}
              </span>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ---------- Next steps card, pulled up over the navy band ---------- */}
      <section className="relative px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="relative max-w-2xl mx-auto -mt-16 sm:-mt-20">
          <div className="rounded-2xl bg-surface-container-lowest ring-1 ring-outline-variant/40 shadow-[0_24px_60px_-25px_rgba(0,3,33,0.25)] p-6 sm:p-9">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Before we talk
            </p>

            <ul className="mt-6 space-y-6">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
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

            <div className="mt-8 rounded-xl bg-on-secondary-fixed/[0.04] ring-1 ring-outline-variant/40 p-5 text-center">
              <div className="inline-flex items-center gap-2 text-on-secondary-fixed">
                <CalendarClock className="h-5 w-5 text-primary" />
                <span className="font-headline text-base font-bold">
                  Something come up?
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                Use the reschedule link in your confirmation email, or call an
                Advisor at{' '}
                <a
                  href={SITE.phoneTel}
                  className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
                >
                  {SITE.phone}
                </a>{' '}
                and we&rsquo;ll move it by hand. Life happens, we get it.
              </p>
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
    </div>
  );
}
