'use client';

// React Bits — ChromaGrid (https://reactbits.dev), adapted to TypeScript and
// the Credit Banc palette. Originally the grid desaturates to grey and the
// cursor "reveals" color; for a team page that reads as dull, so this variant
// keeps cards in FULL COLOR and uses the cursor only as a soft emerald glow
// plus a per-card sheen — interactive and fresh, never grey.

import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';

export type ChromaItem = {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
};

type ChromaGridProps = {
  items: ChromaItem[];
  className?: string;
  /** Radius of the cursor glow, px. */
  radius?: number;
  columns?: number;
  /**
   * Cards per row, e.g. [2, 3, 3, 2] for a tapered gallery. Each row is
   * centered and cards keep a consistent width. Falls back to `columns` when
   * omitted. On small screens rows wrap to 2-up regardless.
   */
  rows?: number[];
  damping?: number;
  ease?: string;
  onItemClick?: (item: ChromaItem, index: number) => void;
};

type SetterFn = (v: number | string) => void;

export default function ChromaGrid({
  items,
  className = '',
  radius = 360,
  columns = 4,
  rows,
  damping = 0.4,
  ease = 'power3.out',
  onItemClick,
}: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const ensureSetters = () => {
    if (setX.current || !rootRef.current) return;
    setX.current = gsap.quickSetter(rootRef.current, '--x', 'px') as SetterFn;
    setY.current = gsap.quickSetter(rootRef.current, '--y', 'px') as SetterFn;
  };

  const moveTo = (x: number, y: number) => {
    ensureSetters();
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(rootRef.current, { '--glow': 1, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(rootRef.current, { '--glow': 0, duration: 0.5, overwrite: true });
  };

  const handleCardClick = (item: ChromaItem, index: number) => {
    if (onItemClick) return onItemClick(item, index);
    if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full ${className}`}
      style={
        {
          '--x': '50%',
          '--y': '50%',
          '--glow': 0,
        } as CSSProperties
      }
    >
      {/* Soft emerald glow that trails the cursor — additive, full-color. */}
      <div
        aria-hidden
        className="absolute -inset-6 pointer-events-none z-0"
        style={{
          opacity: 'var(--glow)',
          background: `radial-gradient(${radius}px circle at var(--x) var(--y), rgba(85,207,158,0.22), transparent 70%)`,
          transition: 'opacity 0.3s ease',
        }}
      />

      {rows && rows.length ? (
        // Tapered layout: one centered flex row per `rows` entry. Cards keep a
        // fixed width so a 2-card row matches a 3-card row; wraps 2-up on phones.
        <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-6">
          {(() => {
            let cursor = 0;
            return rows.map((count, r) => {
              const slice = items.slice(cursor, cursor + count);
              const start = cursor;
              cursor += count;
              return (
                <div
                  key={`row-${r}`}
                  className="flex flex-wrap justify-center gap-5 sm:gap-6 w-full"
                >
                  {slice.map((c, j) => (
                    <div
                      key={c.title + (start + j)}
                      className="w-[calc(50%-0.625rem)] sm:w-[230px] lg:w-[270px]"
                    >
                      {renderCard(c, start + j, handleCardClick)}
                    </div>
                  ))}
                </div>
              );
            });
          })()}
        </div>
      ) : (
        <div
          className="relative z-10 grid gap-5 sm:gap-6"
          style={{
            gridTemplateColumns: `repeat(var(--cols, ${columns}), minmax(0, 1fr))`,
          }}
        >
          {items.map((c, i) => renderCard(c, i, handleCardClick))}
        </div>
      )}
    </div>
  );
}

function renderCard(
  c: ChromaItem,
  i: number,
  onClick: (item: ChromaItem, index: number) => void
) {
  return (
    <article
      key={c.title + i}
      onClick={() => onClick(c, i)}
      className="group relative flex h-full flex-col rounded-2xl overflow-hidden cursor-pointer bg-white shadow-[0_18px_40px_-20px_rgba(32,37,54,0.35)] ring-1 ring-on-secondary-fixed/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_55px_-22px_rgba(31,107,78,0.45)]"
    >
      <div className="relative z-10 p-2.5 sm:p-3">
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#e9e7e0]">
          {/* Black-and-white at rest; full color on hover — the reveal. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.image}
            alt={c.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-top grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
          />
        </div>
      </div>
      <footer className="relative z-10 px-4 pb-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-headline text-lg font-extrabold tracking-tight leading-tight text-on-secondary-fixed">
            {c.title}
          </h3>
          {c.handle ? (
            <span className="text-[0.7rem] font-medium text-on-surface-variant/60">
              {c.handle}
            </span>
          ) : null}
        </div>
        <p className="font-label text-[0.7rem] font-bold uppercase tracking-widest text-primary mt-0.5">
          {c.subtitle}
        </p>
      </footer>
    </article>
  );
}
