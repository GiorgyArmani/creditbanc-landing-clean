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
    fineprint: "(and that's never going to change)",
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
              <Counter
                to={stat.to}
                from={stat.from}
                prefix={stat.prefix}
                suffix={stat.suffix}
                duration={2.4}
                delay={0.3 + i * 0.18}
                className="block text-4xl sm:text-5xl md:text-6xl font-black text-primary-container tabular-nums tracking-tight mb-3"
              />
              <p className="font-label text-[11px] uppercase tracking-wider leading-snug text-slate-400 max-w-[24ch] mx-auto">
                {stat.label}
              </p>
              {stat.fineprint && (
                <p className="text-[11px] italic leading-snug text-white/80 max-w-[24ch] mx-auto mt-1.5">
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
