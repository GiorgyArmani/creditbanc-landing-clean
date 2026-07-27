'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { SPOTLIGHT_ITEMS, FORBES_AUTHOR_URL } from '@/lib/team';

// How many items show before the "Show all" toggle reveals the rest.
const PREVIEW_COUNT = 4;

export default function Spotlight() {
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const visibleItems = showAll
    ? SPOTLIGHT_ITEMS
    : SPOTLIGHT_ITEMS.slice(0, PREVIEW_COUNT);
  const hiddenCount = SPOTLIGHT_ITEMS.length - PREVIEW_COUNT;

  return (
    <section
      id="spotlight"
      className="relative overflow-hidden bg-surface px-6 sm:px-8 py-20 sm:py-28"
    >
      <motion.div
        aria-hidden
        className="absolute -top-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-primary/15 blur-3xl pointer-events-none"
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
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1f6b4e] mb-4">
            Press &amp; Features
          </p>
          <h2 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight text-on-secondary-fixed mb-4">
            In the Spotlight
          </h2>
          <p className="text-lg sm:text-xl text-on-surface-variant leading-relaxed">
            Press releases, Forbes articles, and the occasional moment in the
            limelight. Here&rsquo;s where Credit Banc shows up in the wild.
          </p>
        </motion.div>

        <div className="mt-12 space-y-3">
          {visibleItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.title + i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i, PREVIEW_COUNT) * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-xl border border-white/15 overflow-hidden text-white shadow-[0_18px_38px_-22px_rgba(16,64,44,0.7)]"
                style={{
                  background:
                    'linear-gradient(135deg, #1f6b4e 0%, #2ea878 50%, #34b07d 100%)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`spotlight-panel-${i}`}
                  className="w-full flex items-center gap-5 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-white/5"
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
                    <h3 className="font-headline text-lg sm:text-xl font-bold tracking-tight leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="shrink-0 text-white/80"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`spotlight-panel-${i}`}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5">
                        {item.excerpt && (
                          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                            {item.excerpt}
                          </p>
                        )}
                        <a
                          href={item.href}
                          target={item.href.startsWith('#') ? undefined : '_blank'}
                          rel={
                            item.href.startsWith('#')
                              ? undefined
                              : 'noopener noreferrer'
                          }
                          className="group mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-on-secondary-fixed transition-all hover:shadow-lg"
                        >
                          {item.outlet === 'Press Release'
                            ? 'Read the release'
                            : 'Read on Forbes'}
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {hiddenCount > 0 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-[#1f6b4e] border border-transparent font-bold text-sm uppercase tracking-widest text-white transition-all hover:bg-[#17563e]"
            >
              {showAll ? 'Show less' : `See More`}
              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.span>
            </button>
          </div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center text-base sm:text-lg text-on-surface-variant"
        >
          Want more?{' '}
          <a
            href={FORBES_AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#1f6b4e] underline decoration-[#1f6b4e]/40 underline-offset-4 transition-colors hover:decoration-[#1f6b4e]"
          >
            Check out the full list over on Forbes
            <ArrowUpRight className="inline h-4 w-4 ml-0.5 -translate-y-0.5" />
          </a>
        </motion.p>
      </div>
    </section>
  );
}
