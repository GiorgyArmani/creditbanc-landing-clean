'use client';

import { motion } from 'framer-motion';
import Counter from '../ui/Counter';

interface Stat {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  fineprint?: string;
  sticker?: string;
}

const STATS: Stat[] = [
  {
    to: 2,
    prefix: '$',
    suffix: 'B+',
    label: 'Dollars Put to Work',
  },
  {
    to: 15,
    suffix: 'k+',
    label: 'Businesses Funded.',
    fineprint: "(Headaches Downgraded)",
  },
  {
    to: 5,
    from: 24,
    suffix: 'h',
    label: 'Average Time Spent Waiting For An Offer',
  },
  {
    to: 0,
    label: 'Funding Applications Reviewed by Robots',
    
  },
];

export default function TrustMetrics() {
  return (
    <section className="bg-on-secondary-fixed py-16 sm:py-24 px-6 sm:px-8 text-white relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-40 w-[24rem] h-[24rem] rounded-full bg-primary-container/20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="relative inline-block mb-3">
                <Counter
                  to={stat.to}
                  from={stat.from}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2.4}
                  delay={0.3 + i * 0.18}
                  className="block text-5xl sm:text-6xl md:text-7xl font-black text-primary-container tabular-nums tracking-tight"
                />
                {stat.sticker && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, rotate: -22 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: -10 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      delay: 0.6 + i * 0.18,
                      type: 'spring',
                      stiffness: 320,
                      damping: 14,
                    }}
                    className="absolute -top-6 -right-10 sm:-top-8 sm:-right-20 md:-top-10 md:-right-28 z-10 origin-bottom-left rotate-[-10deg] bg-primary text-on-secondary-fixed px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-extrabold uppercase tracking-wider whitespace-nowrap shadow-[0_6px_18px_-6px_rgba(85,207,158,0.55)] ring-1 ring-white/20"
                  >
                    {stat.sticker}
                  </motion.span>
                )}
              </div>
              <p className="font-label text-sm sm:text-base font-semibold uppercase tracking-wider leading-snug text-slate-300 max-w-[22ch] mx-auto">
                {stat.label}
              </p>
              {stat.fineprint && (
                <p className="text-sm sm:text-base italic leading-snug text-white/90 max-w-[22ch] mx-auto mt-2">
                  {stat.fineprint}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
