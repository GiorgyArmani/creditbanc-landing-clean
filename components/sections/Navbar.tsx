'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SITE, ROUTES } from '@/lib/site';

type Program = { id: string; label: string };
type NavLink = {
  label: string;
  href: string;
  programs?: Program[];
};

// Program ids MUST match the ids in components/sections/Products.tsx
// PROGRAMS — clicking a dropdown item navigates to /#<id>, which fires
// the hashchange handler in Products.tsx and opens that program's modal.
const NAV_LINKS: NavLink[] = [
  {
    label: 'SBA Financing',
    href: '/#sba',
    programs: [
      { id: 'sba-flexfund', label: 'FlexFund Program' },
      { id: 'sba-refinance', label: 'SBA Loan Refinance' },
      { id: 'sba-commercial-real-estate', label: 'SBA Commercial Real Estate' },
      { id: 'sba-business-acquisition', label: 'SBA Business Acquisition' },
      { id: 'sba-startup', label: 'SBA Startup Loans' },
      
    ],
  },
  {
    label: 'Real Estate Financing',
    href: '/#real-estate',
    programs: [
      { id: 'rental-property', label: 'Rental Property Loans' },
      { id: 'commercial-mortgage', label: 'Commercial Mortgage Loans' },
      { id: 'hard-money', label: 'Hard Money Loans' },
      { id: 'fix-and-flip', label: 'Fix-and-Flip Loans' },
      { id: 'ground-up-construction', label: 'Ground-Up Construction' },
    ],
  },
  {
    label: 'Small Business Funding',
    href: '/#small-business',
    programs: [
      { id: 'term-loans', label: 'Term Loans' },
      { id: 'equipment', label: 'Equipment Financing' },
      { id: 'lines-of-credit', label: 'Lines of Credit' },
      { id: 'accounts-receivable', label: 'Accounts Receivable Factoring' },
      { id: 'ecommerce-funding', label: 'eCommerce Funding' },
      { id: 'merchant-cash-advance', label: 'Merchant Cash Advance' },
      { id: 'project-financing', label: 'Project Financing' },
      { id: 'inventory-financing', label: 'Inventory Financing' }
    ],
  },
  { label: 'Our Process', href: '/#process' },
  // About page not ready yet — re-enable once /about is finished.
  // { label: 'About', href: '/about' },
  { label: 'Blog', href: ROUTES.blog },
];

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(
    null
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setHovered(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setExpandedMobileGroup(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 backdrop-blur-2xl transition-shadow duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-[0_20px_50px_-10px_rgba(0,3,33,0.12)]'
          : 'bg-white/70 shadow-[0_20px_50px_-10px_rgba(0,3,33,0.04)]'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`flex justify-between items-center max-w-screen-2xl mx-auto px-6 sm:px-8 transition-[padding] duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <a
          href="/"
          className="flex items-center"
          aria-label="Credit Banc home"
        >
          <Image
            src="/dark%20logo.svg"
            alt="Credit Banc — Credit & capital to grow"
            width={400}
            height={100}
            priority
            unoptimized
            className="h-10 sm:h-12"
            style={{ width: 'auto' }}
          />
        </a>
        <div
          className="hidden md:flex items-center gap-1"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => {
            const isHovered = hovered === link.label;
            const hasDropdown = !!link.programs?.length;
            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setHovered(link.label)}
              >
                <a
                  href={link.href}
                  className="relative inline-flex items-center gap-1 px-4 py-2 font-headline tracking-tight text-sm uppercase font-bold text-slate-700 transition-colors hover:text-primary"
                  aria-haspopup={hasDropdown || undefined}
                  aria-expanded={hasDropdown ? isHovered : undefined}
                >
                  {isHovered && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary-container/30"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                  {hasDropdown && (
                    <svg
                      aria-hidden
                      viewBox="0 0 12 12"
                      className={`relative w-2.5 h-2.5 opacity-60 transition-transform duration-200 ${
                        isHovered ? 'rotate-180' : ''
                      }`}
                    >
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </a>
                {hasDropdown && (
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="absolute top-full left-0 pt-2 min-w-[280px] z-50"
                        role="menu"
                      >
                        <ul className="bg-white rounded-xl shadow-[0_24px_60px_-15px_rgba(0,3,33,0.18)] border border-outline-variant/10 py-2 overflow-hidden">
                          {link.programs!.map((p) => (
                            <li key={p.id} role="none">
                              <a
                                role="menuitem"
                                href={`/#${p.id}`}
                                onClick={() => setHovered(null)}
                                className="block px-5 py-2.5 font-headline tracking-tight text-sm font-bold text-slate-700 hover:text-primary hover:bg-primary-container/20 transition-colors"
                              >
                                {p.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <motion.a
            href={SITE.loginUrl}
            className="hidden sm:block text-sm font-bold uppercase tracking-wider text-deep-navy hover:text-primary transition-colors"
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
          >
            Login
          </motion.a>
          <motion.a
            href="/apply-now"
            className="hidden md:inline-block signature-gradient text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg"
            whileHover={{
              scale: 1.04,
              boxShadow: '0 18px 35px -10px rgba(0, 108, 76, 0.45)',
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
          >
            Apply Now
          </motion.a>
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-deep-navy hover:bg-primary-container/20 transition-colors"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative w-6 h-5 flex items-center justify-center">
              <span
                aria-hidden
                className="absolute h-0.5 w-6 bg-current rounded transition-transform duration-200"
                style={{
                  transform: menuOpen
                    ? 'rotate(45deg) translateY(0)'
                    : 'rotate(0) translateY(-7px)',
                }}
              />
              <span
                aria-hidden
                className="absolute h-0.5 w-6 bg-current rounded transition-opacity duration-150"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                aria-hidden
                className="absolute h-0.5 w-6 bg-current rounded transition-transform duration-200"
                style={{
                  transform: menuOpen
                    ? 'rotate(-45deg) translateY(0)'
                    : 'rotate(0) translateY(7px)',
                }}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-[var(--nav-h,72px)] bg-on-secondary-fixed/40 backdrop-blur-sm md:hidden z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              className="md:hidden absolute top-full left-0 right-0 bg-white shadow-[0_24px_60px_-15px_rgba(0,3,33,0.18)] border-t border-outline-variant/10 z-50 max-h-[calc(100vh-var(--nav-h,72px))] overflow-y-auto"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="flex flex-col py-4">
                {NAV_LINKS.map((link, i) => {
                  const hasDropdown = !!link.programs?.length;
                  const isExpanded = expandedMobileGroup === link.label;
                  return (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.05,
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {hasDropdown ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedMobileGroup(
                                isExpanded ? null : link.label
                              )
                            }
                            aria-expanded={isExpanded}
                            className="w-full flex items-center justify-between px-8 py-3 font-headline tracking-tight text-base uppercase font-bold text-slate-700 hover:text-primary hover:bg-primary-container/15 transition-colors"
                          >
                            <span>{link.label}</span>
                            <svg
                              aria-hidden
                              viewBox="0 0 12 12"
                              className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            >
                              <path
                                d="M2 4l4 4 4-4"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.25,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="overflow-hidden bg-primary-container/10"
                              >
                                <ul className="py-1">
                                  {link.programs!.map((p) => (
                                    <li key={p.id}>
                                      <a
                                        href={`/#${p.id}`}
                                        onClick={() => setMenuOpen(false)}
                                        className="block pl-12 pr-8 py-2.5 font-headline tracking-tight text-sm font-bold text-slate-600 hover:text-primary hover:bg-primary-container/20 transition-colors"
                                      >
                                        {p.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className="block px-8 py-3 font-headline tracking-tight text-base uppercase font-bold text-slate-700 hover:text-primary hover:bg-primary-container/15 transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </motion.li>
                  );
                })}
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 + NAV_LINKS.length * 0.05,
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="border-t border-outline-variant/10 mt-2 pt-2 sm:hidden"
                >
                  <a
                    href={SITE.loginUrl}
                    onClick={() => setMenuOpen(false)}
                    className="block px-8 py-3 font-headline tracking-tight text-base uppercase font-bold text-slate-700 hover:text-primary hover:bg-primary-container/15 transition-colors"
                  >
                    Login
                  </a>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 + (NAV_LINKS.length + 1) * 0.05,
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="px-6 pt-3 pb-2"
                >
                  <a
                    href="/apply-now"
                    onClick={() => setMenuOpen(false)}
                    className="signature-gradient block text-center text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest shadow-lg"
                  >
                    Apply Now
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
