'use client';

import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

// All the candid photos of Matt & Lou (from /public/bento). Every tile cycles
// through its own slice of these, so the whole set gets used over time.
const PHOTOS = [
  '/bento/LuigiandMatthew_BriarRosePhotoCo_050423_KAT_1128.jpg',
  '/bento/20220908-IMG_5124.jpg',
  '/bento/LuigiandMatthew_BriarRosePhotoCo_050423_KAT_1155.jpg',
  '/bento/20220908-IMG_4996.jpg',
  '/bento/DSC_9252.jpg',
  '/bento/20220908-IMG_5163.jpg',
  '/bento/20220908-IMG_5076.jpg',
  '/bento/20220908-IMG_5142.jpg',
  '/bento/DSC_9331.jpg',
  '/bento/DSC00545.jpg',
  '/bento/DSC00551.jpg',
  '/bento/DSC00553.jpg',
];

// On-brand accent gradients behind each tile (shown until/if a photo loads).
const ACCENTS = [
  'linear-gradient(135deg, #1f6b4e 0%, #2ea878 55%, #55cf9e 100%)',
  'linear-gradient(135deg, #2ea878 0%, #55cf9e 100%)',
  'linear-gradient(135deg, #4a5650 0%, #6d7a72 60%, #939598 100%)',
];

// Tiles laid out to match the bento: a 3-column grid over 6 rows.
//   col 1 → two stacked tiles · col 2 → one tall tile · col 3 → three tiles
// `photos` lists the indices (into PHOTOS) this tile rotates through; spread so
// adjacent tiles never show the same shot at the same time.
const TILES = [
  { className: 'col-start-1 row-start-1 row-span-3', photos: [0, 6] },
  { className: 'col-start-1 row-start-4 row-span-3', photos: [1, 7] },
  { className: 'col-start-2 row-start-1 row-span-6', photos: [2, 8] },
  { className: 'col-start-3 row-start-1 row-span-2', photos: [3, 9] },
  { className: 'col-start-3 row-start-3 row-span-2', photos: [4, 10] },
  { className: 'col-start-3 row-start-5 row-span-2', photos: [5, 11] },
];

// Crossfade through a tile's photos, advancing every few seconds. The stagger
// (delay) keeps the tiles from all flipping in unison.
function RotatingTile({ photos, delay }: { photos: number[]; delay: number }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      interval = setInterval(
        () => setIdx((i) => (i + 1) % photos.length),
        6000,
      );
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [photos.length, delay]);

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={photos[idx]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <Image
          src={PHOTOS[photos[idx]]}
          alt="Matthew R. Meehan and Luigi Rosabianca"
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center"
        />
      </motion.div>
    </AnimatePresence>
  );
}

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
          {TILES.map((tile, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={tileVariant}
              className={`relative overflow-hidden rounded-2xl shadow-[0_18px_40px_-22px_rgba(32,37,54,0.45)] ${tile.className}`}
              style={{ background: ACCENTS[i % ACCENTS.length] }}
            >
              <RotatingTile photos={tile.photos} delay={i * 1000} />
            </motion.div>
          ))}
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
              <strong className="font-semibold text-on-secondary-fixed">
                Credit Banc
              </strong>{' '}
              was built from the work{' '}
              <strong className="font-semibold text-on-secondary-fixed">
                Shield Advisory Group
              </strong>{' '}
              was already doing with business owners.
            </p>
            <p>
              After years of helping companies think through growth, strategy,
              acquisitions, real estate, cash flow, and expansion,{' '}
              <strong className="font-semibold text-on-secondary-fixed">
                Matthew R. Meehan
              </strong>{' '}
              and{' '}
              <strong className="font-semibold text-on-secondary-fixed">
                Luigi Rosabianca
              </strong>{' '}
              kept seeing the same problem: business owners didn&rsquo;t just
              need funding. They needed a better way to understand their options
              and choose capital that actually fit their business.
            </p>
            <p>
              So they created{' '}
              <strong className="font-semibold text-on-secondary-fixed">
                Credit Banc
              </strong>{' '}
              as the funding arm of{' '}
              <strong className="font-semibold text-on-secondary-fixed">
                Shield Advisory Group
              </strong>
              , giving Main Street business owners access to smarter funding
              options with a Wall Street-level approach, without the financial
              theater no one asked for.
            </p>
            <p>
              That is the point of{' '}
              <strong className="font-semibold text-on-secondary-fixed">
                Credit Banc
              </strong>
              : capital with context, structure, and a little less nonsense.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
