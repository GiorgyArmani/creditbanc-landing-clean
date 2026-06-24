import Image from 'next/image';
import Icon from '../ui/Icon';
import {
  type ProgramCategory,
  programsForCategory,
  applyHref,
} from '@/lib/programs';

// Faint grid texture used on the dark hero (matches the cash-flow-gap page).
const GRID_OVERLAY: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
  maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
  WebkitMaskImage:
    'radial-gradient(ellipse at center, black 30%, transparent 75%)',
};

// Server-rendered, crawlable category page body (no 'use client') — this is the
// SEO/AI-search surface for each funding category. Styled to match the
// cash-flow-gap page: navy hero with mint glow + grid, then light surface cards.
export default function ProductCategory({
  category,
}: {
  category: ProgramCategory;
}) {
  const programs = programsForCategory(category);

  return (
    <>
      {/* ---------- Hero (navy, like the cash-flow-gap tool) ---------- */}
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-28 sm:pt-32 pb-20 sm:pb-24">
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        />
        <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={GRID_OVERLAY} />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
            {category.eyebrow}
          </p>
          <h1 className="font-headline text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tighter text-white leading-[0.98]">
            {category.title}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed max-w-3xl mx-auto">
            {category.intro}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/apply-now?appointment_source=category_hero"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-on-secondary-fixed transition-transform hover:scale-[1.03]"
            >
              Check Eligibility
              <Icon name="arrow_forward" className="text-base" />
            </a>
            <a
              href="/schedule-a-call"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
            >
              Talk to an Advisor
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Program cards ---------- */}
      <section className="bg-surface px-6 sm:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {programs.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={p.id}
                id={p.id}
                className="scroll-mt-28 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_1px_2px_rgba(0,3,33,0.04)]"
              >
                {/* Popup-style layout: a fixed-width image column that fills the
                    full card height (object-cover, so the art takes the whole
                    space), with the copy taking the wider remaining column. */}
                <div className="flex flex-col lg:flex-row">
                  <div
                    className={`relative shrink-0 aspect-[4/5] lg:aspect-auto lg:w-[360px] bg-[#e9e5dc] ${
                      flip ? 'lg:order-2' : ''
                    }`}
                  >
                    <Image
                      src={p.popupImage ?? p.image}
                      alt={p.imageAlt}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 360px"
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 p-7 sm:p-9 lg:p-10 ${flip ? 'lg:order-1' : ''}`}>
                    <div className="flex items-start gap-4 border-b border-outline-variant/40 pb-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-container/40 text-on-primary-container">
                        <Icon name={p.icon} className="text-xl" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-secondary-fixed leading-tight">
                          {p.title}
                        </h2>
                        <p className="mt-1.5 text-sm font-semibold text-primary leading-relaxed">
                          {p.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-on-surface-variant leading-relaxed">
                      {p.body}
                    </p>
                    <p className="mt-4 text-on-surface-variant leading-relaxed">
                      {p.expanded.intro}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {p.expanded.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-on-surface"
                        >
                          <Icon
                            name="check_circle"
                            className="text-primary text-lg shrink-0 mt-0.5"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 rounded-lg p-4 bg-primary-container/15 border border-primary/10">
                      <p className="font-label text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-1">
                        Best for
                      </p>
                      <p className="text-sm leading-relaxed text-on-surface">
                        {p.expanded.bestFor}
                      </p>
                    </div>

                    <a
                      href={applyHref(p.id)}
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-on-secondary-fixed transition-transform hover:scale-[1.03]"
                    >
                      Check Eligibility
                      <Icon name="arrow_forward" className="text-base" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
