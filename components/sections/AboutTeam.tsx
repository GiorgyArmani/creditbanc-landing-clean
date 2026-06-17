'use client';

import Image from 'next/image';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Linkedin, Instagram, Mail, Globe, X } from 'lucide-react';
import TextType from '../ui/TextType';
import { TEAM_MEMBERS, type Social, type TeamMember } from '@/lib/team';

// On-brand accent gradients for the photo blocks. Cycled by card index so the
// grid gets the colorful Atlassian pop while staying inside the brand palette
// (emerald → mint → muted green-gray). No full-width navy stripes here.
const ACCENTS = [
  'linear-gradient(135deg, #1f6b4e 0%, #2ea878 55%, #55cf9e 100%)',
  'linear-gradient(135deg, #2ea878 0%, #55cf9e 100%)',
  'linear-gradient(135deg, #4a5650 0%, #6d7a72 60%, #939598 100%)',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SOCIAL_META: Record<
  Social['type'],
  {
    Icon: React.ComponentType<{ className?: string }>;
    label: string;
    toHref: (h: string) => string;
  }
> = {
  linkedin: { Icon: Linkedin, label: 'LinkedIn', toHref: (h) => h },
  instagram: { Icon: Instagram, label: 'Instagram', toHref: (h) => h },
  twitter: { Icon: XLogo, label: 'X', toHref: (h) => h },
  email: { Icon: Mail, label: 'Email', toHref: (h) => `mailto:${h}` },
  web: { Icon: Globe, label: 'Website', toHref: (h) => h },
};

// lucide dropped a dedicated Twitter/X glyph; render the X wordmark ourselves.
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function SocialRow({
  socials,
  size = 'sm',
}: {
  socials: Social[];
  size?: 'sm' | 'lg';
}) {
  const dim = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const icon = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-2">
      {socials.map((s) => {
        const meta = SOCIAL_META[s.type];
        const SIcon = meta.Icon;
        return (
          <a
            key={s.type + s.href}
            href={meta.toHref(s.href)}
            target={s.type === 'email' ? undefined : '_blank'}
            rel={s.type === 'email' ? undefined : 'noopener noreferrer'}
            aria-label={meta.label}
            onClick={(e) => e.stopPropagation()}
            className={`${dim} rounded-full bg-on-secondary-fixed/5 text-on-secondary-fixed/70 hover:bg-primary hover:text-white flex items-center justify-center transition-colors`}
          >
            <SIcon className={icon} />
          </a>
        );
      })}
    </div>
  );
}

function PhotoBlock({
  member,
  accent,
  rounded = 'rounded-2xl',
}: {
  member: TeamMember;
  accent: string;
  rounded?: string;
}) {
  return (
    <div
      className={`relative w-full aspect-square ${rounded} overflow-hidden`}
      style={{ background: accent }}
    >
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-headline text-6xl sm:text-7xl font-black text-white/90 tracking-tight select-none">
            {initials(member.name)}
          </span>
        </div>
      )}
    </div>
  );
}

const gridItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AboutTeam() {
  const [active, setActive] = useState<TeamMember | null>(null);

  // Lock body scroll + close on Escape while the bio popup is open.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return (
    <section id="team" className="relative px-6 sm:px-8 py-20 sm:py-28 bg-surface">
      <div
        aria-hidden
        className="absolute -left-40 top-32 w-96 h-96 rounded-full bg-primary-container/15 blur-3xl pointer-events-none"
      />
      <div className="relative max-w-7xl mx-auto">
        {/* Intro — Section 1 copy (centered) */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-secondary-fixed leading-[1.02] mb-6">
            Meet the People
            <br />
            Behind the Funding!
          </h1>
          <div className="space-y-4 text-lg sm:text-xl text-on-surface-variant leading-relaxed">
            <p>
              Business funding can get complicated fast. Terms, timing,
              repayment, cash flow, use of funds, fine print…you get the picture.
            </p>
            <p>
              That&rsquo;s why Credit Banc is built around real Advisors who help
              business owners compare options, understand the structure, and
              choose capital that actually fits the move they are trying to make.
            </p>
          </div>
          {/* One-time writing effect on load. Two sequenced TextType spans so
              "Smart is better." keeps the mint highlight; the second starts as
              the first finishes (initialDelay ≈ first's char count × speed). */}
          <p className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-on-secondary-fixed mt-8 min-h-[2.25rem]">
            <TextType
              as="span"
              text="Fast is nice."
              typingSpeed={45}
              initialDelay={300}
              loop={false}
              showCursor={false}
            />{' '}
            <TextType
              as="span"
              className="text-primary"
              text="Smart is better."
              typingSpeed={45}
              initialDelay={920}
              loop={false}
              cursorClassName="text-primary font-normal"
            />
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {TEAM_MEMBERS.map((member, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const hasBio = !!member.bio?.length;
            return (
              <motion.div
                key={member.name + i}
                custom={i}
                variants={gridItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={`group relative ${
                    hasBio ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => hasBio && setActive(member)}
                  role={hasBio ? 'button' : undefined}
                  tabIndex={hasBio ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (hasBio && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      setActive(member);
                    }
                  }}
                  aria-label={hasBio ? `Read ${member.name}’s bio` : undefined}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-[0_18px_40px_-20px_rgba(32,37,54,0.35)] ring-1 ring-on-secondary-fixed/5">
                    <motion.div
                      className="will-change-transform"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <PhotoBlock
                        member={member}
                        accent={accent}
                        rounded="rounded-none"
                      />
                    </motion.div>
                    {hasBio && (
                      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span className="bg-white/95 backdrop-blur text-on-secondary-fixed text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                          Read bio
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <h3 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight text-on-secondary-fixed">
                      {member.name}
                    </h3>
                    <p className="font-label text-xs font-bold uppercase tracking-widest text-primary mt-1">
                      {member.role}
                    </p>
                    {member.socials?.length ? (
                      <div className="mt-3">
                        <SocialRow socials={member.socials} />
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bio popup — ready now; appears automatically for anyone with a bio. */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close bio"
              onClick={() => setActive(null)}
              className="absolute inset-0 bg-on-secondary-fixed/60 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${active.name} bio`}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_40px_90px_-30px_rgba(32,37,54,0.6)] overflow-hidden max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-surface-container text-on-secondary-fixed flex items-center justify-center transition-colors shadow"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="grid sm:grid-cols-[200px_1fr]">
                <div className="p-6 sm:p-8 sm:pr-0">
                  <div className="w-32 sm:w-full mx-auto">
                    <PhotoBlock
                      member={active}
                      accent={ACCENTS[TEAM_MEMBERS.indexOf(active) % ACCENTS.length]}
                    />
                  </div>
                </div>
                <div className="p-6 sm:p-8 sm:pl-6">
                  <h3 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-on-secondary-fixed">
                    {active.name}
                  </h3>
                  <p className="font-label text-xs font-bold uppercase tracking-widest text-primary mt-1.5">
                    {active.role}
                  </p>
                  <div className="mt-5 space-y-3 text-on-surface-variant leading-relaxed">
                    {active.bio?.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                  {active.socials?.length ? (
                    <div className="mt-6">
                      <SocialRow socials={active.socials} size="lg" />
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
