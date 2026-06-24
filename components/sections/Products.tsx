'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '../ui/Icon';
import CircularGallery from '../ui/CircularGallery';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { PROGRAMS, applyHref } from '@/lib/programs';

const CATEGORY_ANCHORS = ['sba', 'real-estate', 'small-business'] as const;

export default function Products() {
  const [openId, setOpenId] = useState<string | null>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const match = PROGRAMS.find((p) => p.id === hash);
      if (match) setOpenId(match.id);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (openId) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openId]);

  // Filter video and animated-GIF sources out of the ring — each tile spawns
  // its own <video> request or runs its own decode pass for a GIF, which
  // multiplies network and CPU cost. Animated assets still play in the
  // program modal when the user opens that program's card.
  // Memoized so the reference stays stable across renders. CircularGallery
  // rebuilds its WebGL app whenever `items`/`onItemClick` change identity, and a
  // rebuild resets the ring to scroll position 0 — which is what made
  // opening/closing a card snap the spin back to the beginning.
  const galleryItems = useMemo(
    () =>
      PROGRAMS.filter(
        (p) =>
          p.image.startsWith('/program%20cards/') &&
          !/\.(mp4|webm|mov|m4v|gif)(\?|$)/i.test(p.image)
      ).map((p) => ({
        image: p.image,
        text: '',
        id: p.id,
      })),
    []
  );

  const handleItemClick = useCallback((id: string) => setOpenId(id), []);

  // Close the modal AND clear the URL hash. The navbar dropdown items are
  // anchors to /#<id>; if we leave the hash in place after closing, clicking
  // the same item again navigates to an unchanged hash, so no `hashchange`
  // fires and the modal never reopens. Use replaceState to avoid an extra
  // history entry and the scroll jump a bare `location.hash = ''` would cause.
  const closeModal = useCallback(() => {
    setOpenId(null);
    if (window.location.hash) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const openProgram = openId
    ? PROGRAMS.find((p) => p.id === openId) ?? null
    : null;

  return (
    <section
      id="solutions"
      className="relative bg-on-secondary-fixed overflow-hidden"
    >
      {CATEGORY_ANCHORS.map((id) => (
        <span
          key={`cat-${id}`}
          id={id}
          aria-hidden
          className="block absolute -top-24"
        />
      ))}
      {PROGRAMS.map((p) => (
        <span
          key={p.id}
          id={p.id}
          aria-hidden
          className="block absolute -top-24"
        />
      ))}

      {/* Brand glow anchored to the top of the section, behind the heading. */}
      <motion.div
        aria-hidden
        className="absolute -top-40 right-[12%] h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl pointer-events-none z-0"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 sm:pt-28 md:pt-32 pb-12 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-label text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">
            Financial Solutions
          </p>
          <h2 className="font-headline font-extrabold tracking-tight text-white mb-6 mx-auto px-2">
            <span className="block text-4xl leading-[1.05] md:whitespace-nowrap md:text-[clamp(1.6rem,3.8vw,3rem)]">
              Different Needs Require Different Funding.
            </span>
            <motion.span
              className="text-primary inline-block origin-bottom mt-3 text-[clamp(1.6rem,3.2vw,2.75rem)]"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: [-8, 5, -3, 1, 0],
              }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                opacity: { delay: 0.55, duration: 0.35 },
                scale: {
                  delay: 0.55,
                  duration: 0.55,
                  type: 'spring',
                  stiffness: 320,
                  damping: 14,
                },
                rotate: {
                  delay: 0.55,
                  duration: 0.85,
                  times: [0, 0.3, 0.6, 0.85, 1],
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              Shocking, We Know.
            </motion.span>
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <Icon name="open_with" className="text-primary text-lg" />
              <span className="md:hidden">Swipe to spin.</span>
              <span className="hidden md:inline">Drag to spin.</span>
            </span>
            <span className="hidden md:inline text-white/25">
              |
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="touch_app" className="text-primary text-lg" />
              Tap any program to see how it works, what it&rsquo;s for, and who
              it fits.
            </span>
          </p>
          <p className="text-white/60 text-sm md:text-base leading-relaxed mt-3">
            (Not sure which one fits? That&rsquo;s normal.{' '}
            <a
              href="/apply-now?appointment_source=products_advisor_link"
              className="text-primary font-semibold underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
            >
              Click here
            </a>{' '}
            to speak with an Advisor.)
          </p>
        </motion.div>
      </div>

      <div className="relative w-screen h-[560px] md:h-[680px] lg:h-[800px] xl:h-[900px] bg-on-secondary-fixed overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
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
        <CircularGallery
          items={galleryItems}
          bend={1}
          textColor="#ffffff"
          borderRadius={0.06}
          font={`900 ${isDesktop ? '48px' : '38px'} Manrope, system-ui, sans-serif`}
          scrollSpeed={2}
          scrollEase={0.05}
          autoScrollSpeed={0.08}
          paused={openId !== null}
          onItemClick={handleItemClick}
        />
      </div>

      <AnimatePresence>
        {openProgram && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="absolute inset-0 bg-on-secondary-fixed/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="program-title"
              className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-surface-container-lowest rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-on-secondary-fixed/60 hover:bg-on-secondary-fixed/80 text-white backdrop-blur-sm flex items-center justify-center transition-colors shadow-md"
              >
                <Icon name="close" />
              </button>
              <div className="relative shrink-0 w-full md:w-[240px] lg:w-[260px] aspect-[3/2] md:aspect-auto md:h-auto bg-on-secondary-fixed flex items-center justify-center overflow-hidden">
                {(() => {
                  const desktopSrc =
                    openProgram.popupImage ?? openProgram.image;
                  const mobileSrc =
                    openProgram.popupImageMobile ??
                    '/program%20pop%20up%20image/pop%20up%20cards%20(mobile).png';
                  const modalSrc = isDesktop ? desktopSrc : mobileSrc;
                  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(modalSrc) ? (
                    <video
                      src={modalSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={modalSrc}
                      alt={openProgram.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 260px"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  );
                })()}
                <div className="absolute inset-0 bg-on-secondary-fixed/15 pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <Icon
                      name={openProgram.icon}
                      className="text-on-primary-container text-2xl"
                    />
                  </div>
                  <div className="font-label text-xs font-bold uppercase tracking-[0.2em] text-white">
                    Credit Banc Program
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0 overflow-y-auto overscroll-contain p-6 sm:p-8 md:p-10">
                <h3
                  id="program-title"
                  className="font-headline text-3xl font-extrabold text-on-surface mb-2 pr-12"
                >
                  {openProgram.title}
                </h3>
                <p className="text-base font-semibold text-primary mb-5">
                  {openProgram.tagline}
                </p>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  {openProgram.body}
                </p>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  {openProgram.expanded.intro}
                </p>
                <ul className="space-y-3 mb-6">
                  {openProgram.expanded.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm leading-relaxed text-on-surface"
                    >
                      <Icon
                        name="check_circle"
                        className="text-primary text-lg shrink-0 mt-0.5"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg p-4 bg-primary-container/15 border border-primary/10 mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                    Best for
                  </p>
                  <p className="text-sm leading-relaxed text-on-surface">
                    {openProgram.expanded.bestFor}
                  </p>
                </div>
                <a
                  href={applyHref(openProgram.id)}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold"
                >
                  Check Eligibility
                  <Icon name="arrow_forward" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
