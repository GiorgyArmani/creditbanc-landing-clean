'use client';

import { motion } from 'framer-motion';
import Counter from '../ui/Counter';

interface Stat {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel?: string;
}

const STATS: Stat[] = [
  {
    to: 500,
    prefix: '$',
    suffix: 'K',
    label: 'Max Funding Available',
    sublabel: 'In as little as 24 hours',
  },
  {
    to: 24,
    suffix: 'H',
    label: 'Time to Funding',
    sublabel: 'For qualifying businesses',
  },
  {
    to: 10,
    suffix: 'YR',
    label: 'Term Length',
    sublabel: 'Long-term, monthly payments',
  },
  {
    to: 0,
    from: 100,
    suffix: '%',
    label: 'Collateral Required',
    sublabel: 'For qualifying businesses',
  },
];

export default function TrustMetrics() {
  return (
    <section className="bg-on-secondary-fixed py-24 px-8 text-white relative overflow-hidden">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center">
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
              className="relative"
            >
              <Counter
                to={stat.to}
                from={stat.from}
                prefix={stat.prefix}
                suffix={stat.suffix}
                duration={2}
                delay={0.2 + i * 0.1}
                className="block text-5xl md:text-6xl font-black text-primary-container tabular-nums tracking-tight mb-3"
              />
              <p className="font-headline text-base md:text-lg font-bold tracking-tight text-white mb-1">
                {stat.label}
              </p>
              {stat.sublabel && (
                <p className="font-label text-[11px] uppercase tracking-widest text-slate-400">
                  {stat.sublabel}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
