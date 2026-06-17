'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SPOTLIGHT_ITEMS } from '@/lib/team';

export default function Spotlight() {
  return (
    <section
      id="spotlight"
      className="relative overflow-hidden px-6 sm:px-8 py-20 sm:py-28 text-white"
      style={{
        background:
          'linear-gradient(135deg, #1f6b4e 0%, #2ea878 50%, #34b07d 100%)',
      }}
    >
      <motion.div
        aria-hidden
        className="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-white/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-white/80 mb-4">
            Press &amp; Features
          </p>
          <h2 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            In the Spotlight
          </h2>
          <p className="text-lg sm:text-xl text-white/85 leading-relaxed">
            Press releases, Forbes articles, and the occasional moment in the
            limelight. Here&rsquo;s where Credit Banc shows up in the wild.
          </p>
        </motion.div>

        <div className="mt-12 divide-y divide-white/15 border-t border-white/15">
          {SPOTLIGHT_ITEMS.map((item, i) => (
            <motion.a
              key={item.title + i}
              href={item.href}
              target={item.href.startsWith('#') ? undefined : '_blank'}
              rel={
                item.href.startsWith('#') ? undefined : 'noopener noreferrer'
              }
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex items-center gap-5 sm:gap-8 py-6 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block bg-white/15 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {item.outlet}
                  </span>
                  {item.date && (
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                      {item.date}
                    </span>
                  )}
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold tracking-tight leading-snug group-hover:text-primary-fixed transition-colors">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-sm sm:text-base text-white/75 mt-1.5 leading-relaxed">
                    {item.excerpt}
                  </p>
                )}
              </div>
              <span className="shrink-0 w-11 h-11 rounded-full bg-white/10 group-hover:bg-white group-hover:text-on-secondary-fixed text-white flex items-center justify-center transition-all group-hover:rotate-0">
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
