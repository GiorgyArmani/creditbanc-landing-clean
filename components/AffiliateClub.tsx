'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import {
  Share2,
  Handshake,
  Gift,
  Check,
  ArrowRight,
  Infinity as InfinityIcon,
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
    icon: Share2,
    title: 'Share Your Link',
    body: 'Send your personal link to any small business owner you know. You don’t need their revenue, credit score, or cash flow. (Please don’t interrogate your dentist about repayment terms mid-cleaning.) You just need to know they own a business.',
  },
  {
    icon: Handshake,
    title: 'We Take It From There',
    body: 'If they want to take a look, we’ll talk with them, learn what’s going on, and see if Credit Banc can help with the money side of running and growing a business. Real people. Yes, actual humans.',
  },
  {
    icon: Gift,
    title: 'You Get $500',
    body: 'If their deal funds, you get a $500 gift card of your choice. They get the money they need. You get a thank-you. (Just try not to let the hero thing go to your head.)',
  },
];

const KNOW_SOMEONE = [
  'A friend',
  'A cousin',
  'A neighbor',
  'The guy who fixed your roof',
  'Your kid’s martial arts instructor',
  'The woman who runs your favorite coffee shop',
  'Your dentist',
];

const FINE_PRINT = [
  'To receive a $500 gift card, the business owner you refer must apply through your personal “I Know Someone” Club link, and their deal must be successfully funded through Credit Banc. A tiny but very important little detail.',
  'Rewards are issued after the referred deal funds and all required closing conditions are complete. One reward is available per funded referred business, unless otherwise approved by Credit Banc.',
  'There is no limit to the number of business owners you can refer. One link. As many eligible introductions as you can make. Your contact list finally has a job.',
  'Self-referrals, duplicate referrals, fake applications, incomplete applications, or referrals already in Credit Banc’s system may not qualify. Credit Banc reserves the right to determine referral eligibility, because someone, somewhere, will absolutely try to get creative and ruin a nice thing.',
  'Gift cards are subject to availability and may be selected from approved options provided by Credit Banc. Rewards may be subject to tax reporting requirements, and recipients are responsible for any applicable taxes. The IRS, as usual, has entered the chat.',
  'Funding is not guaranteed. All funding requests are subject to review, approval, underwriting, and program availability. We would love to help everyone, but underwriting does occasionally insist on being involved.',
  'Please do not represent yourself as an employee, lender, broker, or advisor of Credit Banc unless you have a separate written agreement with us. Your job is simple: share your link with business owners who may want to talk with Credit Banc. We’ll handle the money side.',
];

export default function AffiliateClub() {
  return (
    <div className="bg-surface">
      {/* ---------- Dark hero ---------- */}
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-8 sm:pt-10 pb-20 sm:pb-28">
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

        <header className="relative max-w-6xl mx-auto flex items-center justify-center sm:justify-start py-2 sm:py-3">
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
          className="relative max-w-6xl mx-auto pt-10 sm:pt-14 grid lg:grid-cols-[1fr_minmax(0,360px)] gap-12 lg:gap-10 items-center"
        >
          {/* Copy — center-aligned */}
          <motion.div
            variants={stagger}
            className="flex flex-col items-center text-center"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25"
            >
              <Gift className="h-3.5 w-3.5" />
              Affiliate Program
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-headline text-4xl sm:text-5xl xl:text-[4rem] font-extrabold tracking-tighter text-white leading-[0.95]"
            >
              <span className="block">Join the</span>
              {/* Keep the quoted phrase + "Club." unbroken on one line at desktop
                  widths; on small screens it wraps naturally to avoid overflow. */}
              <span className="block sm:whitespace-nowrap">
                &ldquo;I Know Someone&rdquo;{' '}
                <span className="text-primary">Club.</span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/80"
            >
              Everyone knows a small business owner. Share your link, and if we
              can help them out, we&rsquo;ll send you a{' '}
              <span className="font-bold text-white">
                $500 gift card of your choice.
              </span>{' '}
              They get the money they need. You get a thank-you.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <a
                href={SITE.affiliateUrl}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-headline text-base font-bold text-on-secondary-fixed shadow-[0_12px_30px_-10px_rgba(85,207,158,0.6)] transition-transform hover:scale-[1.03]"
              >
                Get My Link
                <ArrowRight className="h-5 w-5" />
              </a>
              <p className="text-sm text-white/60">
                Free to join. No limit on referrals.
              </p>
            </motion.div>
          </motion.div>

          {/* $500 gift card — side */}
          <motion.div
            variants={fadeUp}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full max-w-[360px] aspect-[16/10] rounded-2xl p-6 flex flex-col justify-between shadow-[0_35px_60px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/15"
              style={{
                background:
                  'linear-gradient(135deg, #10402c 0%, #1f6b4e 55%, #2ea878 100%)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline text-sm font-bold uppercase tracking-widest text-white/80">
                  Thank-You Reward
                </span>
                <Gift className="h-6 w-6 text-white/90" />
              </div>
              <div>
                <p className="font-headline text-6xl font-extrabold tracking-tighter text-white">
                  $500
                </p>
                <p className="mt-1 text-sm font-semibold text-white/80">
                  Gift card of your choice
                </p>
              </div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                Per funded referral
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------- Who do you know? (cream) ---------- */}
      <section className="relative px-6 sm:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-headline text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-on-secondary-fixed"
          >
            You Definitely Know Someone
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-on-surface-variant"
          >
            A friend. A cousin. A neighbor. That&rsquo;s all it takes. Connect
            the business owners you know with a team of real, actual humans who
            help them sort through the money side of running and growing a
            business.
          </motion.p>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {KNOW_SOMEONE.map((person) => (
              <motion.li
                key={person}
                variants={fadeUp}
                className="rounded-full bg-surface-container px-5 py-2.5 text-sm sm:text-base font-semibold text-on-surface ring-1 ring-outline-variant/50"
              >
                {person}
              </motion.li>
            ))}
          </motion.ul>
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

      {/* ---------- Why we created it (cream) ---------- */}
      <section className="relative px-6 sm:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              variants={fadeUp}
              className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-on-secondary-fixed"
            >
              Why We Created the Club
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-base sm:text-lg leading-relaxed text-on-surface-variant"
            >
              Credit Banc was built because small business owners deserve better
              than confusing loan offers, mystery terms, one-size-fits-all
              funding, and financial advice that sounds like it was written by a
              printer jam.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base sm:text-lg leading-relaxed text-on-surface-variant"
            >
              Most business owners aren&rsquo;t studying loan structures for fun.
              They&rsquo;re trying to make payroll, buy equipment, cover
              inventory, deal with slow-paying customers, and keep the business
              moving without guessing their way through every financial
              decision. We help them look at the money side in a way that is
              clear, practical, and actually tied to what they&rsquo;re trying to
              do. What a concept.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-2xl bg-surface-container p-8 ring-1 ring-outline-variant/40"
          >
            <motion.h3
              variants={fadeUp}
              className="font-headline text-xl font-bold text-on-secondary-fixed"
            >
              You just need to know they own a business.
            </motion.h3>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-base leading-relaxed text-on-surface-variant"
            >
              No, you don&rsquo;t need their revenue, credit score, or cash flow.
              Share your link. If they want to take a look, we&rsquo;ll learn
              what&rsquo;s going on and see if Credit Banc can help. If their deal
              funds, you get $500. Not a bad thank-you for knowing a person.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex items-start gap-4 rounded-xl bg-primary/10 p-5 ring-1 ring-primary/20"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-on-secondary-fixed">
                <InfinityIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-headline text-base font-bold text-on-secondary-fixed">
                  There&rsquo;s no limit.
                </p>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  Know one business owner? Great. Know ten? Even better. Know
                  half the town? Excellent. Share the link.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---------- CTA band (emerald) ---------- */}
      <section
        className="relative overflow-hidden px-6 sm:px-8 py-20 sm:py-28"
        style={{
          background:
            'linear-gradient(135deg, #10402c 0%, #1f6b4e 55%, #2ea878 100%)',
        }}
      >
        <motion.div
          aria-hidden
          className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter text-white"
          >
            Your contact list finally has a job.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            className="mx-auto mt-5 max-w-xl text-lg sm:text-xl leading-relaxed text-white/85"
          >
            Grab your personal link, share it with the business owners you know,
            and let us handle the money side.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
            className="mt-9"
          >
            <a
              href={SITE.affiliateUrl}
              className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 font-headline text-base font-bold text-on-secondary-fixed shadow-[0_18px_40px_-12px_rgba(0,0,0,0.4)] transition-transform hover:scale-[1.03]"
            >
              Join the Club
              <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------- Fine print (cream) ---------- */}
      <section className="relative px-6 sm:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-on-secondary-fixed"
          >
            Fine Print, Because Apparently We Need Some
          </motion.h2>

          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-8 space-y-4"
          >
            {FINE_PRINT.map((item, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="flex items-start gap-4 rounded-xl bg-surface-container-lowest p-5 ring-1 ring-outline-variant/40"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-headline text-sm font-bold text-on-primary-container">
                  {i + 1}
                </span>
                <p className="text-sm sm:text-base leading-relaxed text-on-surface-variant">
                  {item}
                </p>
              </motion.li>
            ))}
          </motion.ol>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-8 flex items-center gap-2 text-sm text-on-surface-variant"
          >
            <Check className="h-4 w-4 shrink-0 text-primary" />
            One link. As many eligible introductions as you can make.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
