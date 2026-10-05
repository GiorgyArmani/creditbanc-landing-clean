'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Building2,
  Database,
  Truck,
  TriangleAlert,
  Eye,
  TrendingUp,
} from 'lucide-react';

// "What You'll Learn" stepper for /business-credit-101. When it scrolls into
// view, a mint fill runs along the track and each node lights up as the fill
// reaches it. Horizontal track on desktop, vertical rail on mobile. Reduced
// motion skips straight to the finished state.
const LEARN_ITEMS = [
  { icon: Building2, text: 'How business credit profiles are created' },
  { icon: Database, text: 'What business credit bureaus track' },
  { icon: Truck, text: 'How vendor and account reporting works' },
  { icon: TriangleAlert, text: 'Common mistakes that can weaken your profile' },
  { icon: Eye, text: 'How to monitor your business credit' },
  { icon: TrendingUp, text: 'Practical ways to build a stronger profile over time' },
];

const FILL_DURATION = 5.5; // seconds
const EASE = [0.22, 1, 0.36, 1] as const;

// The track runs node center to node center, so node i is reached at i/(n-1)
// of the fill.
const reachedAt = (i: number) =>
  (i / (LEARN_ITEMS.length - 1)) * FILL_DURATION;

export default function CourseStepper() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const on = inView || !!reduce;

  const fill = {
    duration: reduce ? 0 : FILL_DURATION,
    ease: 'linear' as const,
  };

  return (
    <ol
      ref={ref}
      className="relative mt-14 grid gap-10 lg:grid-cols-6 lg:gap-6"
    >
      {/* Mobile rail: base + fill */}
      <span
        aria-hidden
        className="absolute left-7 top-7 bottom-7 w-0.5 bg-white/20 lg:hidden"
      />
      <motion.span
        aria-hidden
        className="absolute left-7 top-7 bottom-7 w-0.5 origin-top bg-primary shadow-[0_0_12px_rgba(85,207,158,0.8)] lg:hidden"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: on ? 1 : 0 }}
        transition={fill}
      />
      {/* Desktop track: base + fill */}
      <span
        aria-hidden
        className="absolute top-7 left-[8.33%] right-[8.33%] hidden h-0.5 bg-white/20 lg:block"
      />
      <motion.span
        aria-hidden
        className="absolute top-7 left-[8.33%] right-[8.33%] hidden h-0.5 origin-left bg-primary shadow-[0_0_12px_rgba(85,207,158,0.8)] lg:block"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: on ? 1 : 0 }}
        transition={fill}
      />

      {LEARN_ITEMS.map(({ icon: Icon, text }, i) => {
        const delay = reduce ? 0 : reachedAt(i);
        return (
          <li
            key={text}
            className="relative flex items-start gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
          >
            <span className="relative z-10 shrink-0">
              {/* One-shot ripple as the fill arrives */}
              {!reduce && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={on ? { scale: [1, 1.9], opacity: [0.55, 0] } : {}}
                  transition={{ duration: 0.9, delay, ease: 'easeOut' }}
                />
              )}
              <motion.span
                className="relative inline-flex h-14 w-14 items-center justify-center rounded-full ring-[6px] ring-white/10 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.45)]"
                initial={{
                  backgroundColor: '#1d5e44',
                  color: 'rgba(255,255,255,0.55)',
                  scale: 0.85,
                }}
                animate={
                  on
                    ? {
                        backgroundColor: '#55cf9e',
                        color: '#202536',
                        scale: reduce ? 1 : [0.85, 1.12, 1],
                      }
                    : {}
                }
                transition={{ duration: reduce ? 0 : 0.5, delay, ease: EASE }}
              >
                <Icon className="h-6 w-6" />
              </motion.span>
            </span>

            <motion.div
              className="pt-1.5 lg:pt-5"
              initial={{ opacity: 0.35, y: reduce ? 0 : 10 }}
              animate={on ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: reduce ? 0 : 0.6, delay, ease: EASE }}
            >
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                Step {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-1.5 font-headline text-lg font-bold leading-snug text-white">
                {text}
              </p>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
