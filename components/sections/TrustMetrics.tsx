'use client';

import { motion } from 'framer-motion';
import Counter from '../ui/Counter';

interface Stat {
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { to: 2, prefix: '$', suffix: 'B+', label: 'Capital Deployed' },
  { to: 15, suffix: 'k+', label: 'Businesses Funded' },
  { to: 24, suffix: 'h', label: 'Average Funding Time' },
  { to: 94, suffix: '%', label: 'Approval Rate' },
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
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
                prefix={stat.prefix}
                suffix={stat.suffix}
                duration={2.4}
                delay={0.3 + i * 0.18}
                className="block text-5xl md:text-6xl font-black text-primary-container tabular-nums tracking-tight mb-3"
              />
              <p className="font-label text-xs uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
