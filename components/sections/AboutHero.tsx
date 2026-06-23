'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

// The two founders, alternated across the bento collage so the grid reads as a
// photo wall of Matt & Lou rather than a roster.
const FOUNDERS = [
  { name: 'Matthew R. Meehan', photo: '/cbteam/Matt.png' },
  { name: 'Luigi Rosabianca', photo: '/cbteam/Lou.png' },
];

// On-brand accent gradients behind each tile (shown until/if a photo loads).
const ACCENTS = [
  'linear-gradient(135deg, #1f6b4e 0%, #2ea878 55%, #55cf9e 100%)',
  'linear-gradient(135deg, #2ea878 0%, #55cf9e 100%)',
  'linear-gradient(135deg, #4a5650 0%, #6d7a72 60%, #939598 100%)',
];

// Tiles laid out to match the bento: a 3-column grid over 6 rows.
//   col 1 → two stacked tiles · col 2 → one tall tile · col 3 → three tiles
const TILES = [
  { className: 'col-start-1 row-start-1 row-span-3', founder: 0 },
  { className: 'col-start-1 row-start-4 row-span-3', founder: 1 },
  { className: 'col-start-2 row-start-1 row-span-6', founder: 0 },
  { className: 'col-start-3 row-start-1 row-span-2', founder: 1 },
  { className: 'col-start-3 row-start-3 row-span-2', founder: 0 },
  { className: 'col-start-3 row-start-5 row-span-2', founder: 1 },
];

const tileVariant: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AboutHero() {
  return (
    <section
      id="origin"
      className="relative overflow-hidden px-6 sm:px-8 py-20 sm:py-28"
      style={{
        background:
          'linear-gradient(160deg, #d8f4e7 0%, #c4edda 55%, #d8f4e7 100%)',
      }}
    >
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Bento collage */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-3 grid-rows-6 gap-3 sm:gap-4 h-[420px] sm:h-[500px] lg:h-[560px]"
        >
          {TILES.map((tile, i) => {
            const founder = FOUNDERS[tile.founder];
            return (
              <motion.div
                key={i}
                custom={i}
                variants={tileVariant}
                className={`relative overflow-hidden rounded-2xl shadow-[0_18px_40px_-22px_rgba(32,37,54,0.45)] ${tile.className}`}
                style={{ background: ACCENTS[i % ACCENTS.length] }}
              >
                <Image
                  src={founder.photo}
                  alt={founder.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-on-primary-container mb-4">
            Our Story
          </p>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-secondary-fixed leading-[1.04] mb-6">
            Built From the Work
            <br className="hidden sm:block" /> We Were Already Doing
          </h1>
          <div className="space-y-4 text-base sm:text-lg text-on-secondary-fixed/80 leading-relaxed">
            <p>
              Credit Banc didn&rsquo;t come out of nowhere. It came from years of
              sitting across from business owners who had big plans, real
              opportunities, and funding options that somehow made everything
              more confusing.
            </p>
            <p>
              Matthew R. Meehan and Luigi Rosabianca are two former Wall Street
              guys who built Shield Advisory Group around a simple idea: bring
              Wall Street-level strategy to Main Street business owners without
              burying them in gatekeeping, financial theater, or unnecessary
              complexity.
            </p>
            <p>
              Through that work, they saw the same gap again and again. Business
              owners did not just need access to capital. They needed a better
              way to understand their options, compare structures, and choose
              funding that actually fit the business.
            </p>
            <p>
              So they created Credit Banc as the funding arm of Shield Advisory
              Group. And the rest, as they say, is history.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
