'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, Mail, MessageSquare, Phone, X } from 'lucide-react';
import { SITE } from '@/lib/site';

export function FloatingSupport() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Support options"
            className="absolute bottom-20 right-0 w-72 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl ring-1 ring-on-surface/10"
          >
            <div className="bg-primary p-5 text-white">
              <h3 className="font-headline text-lg font-bold tracking-tight">
                Need Help?
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                Credit Banc Support Team
              </p>
            </div>

            <div className="space-y-2 p-4">
              <SupportLink
                href={`mailto:${SITE.email}?subject=Support%20Request`}
                eyebrow="Create Ticket"
                label="Send us a message"
                icon={<MessageSquare className="h-5 w-5" />}
              />
              <SupportLink
                href={SITE.phoneTel}
                eyebrow="Call Us"
                label={SITE.phone}
                icon={<Phone className="h-5 w-5" />}
              />
              <SupportLink
                href={`mailto:${SITE.email}`}
                eyebrow="Email Us"
                label={SITE.email}
                icon={<Mail className="h-5 w-5" />}
              />
            </div>

            <div className="border-t border-on-surface/5 bg-surface-container-low/60 p-2.5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                Credit Banc
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close support menu' : 'Open support menu'}
        aria-expanded={open}
        className="signature-gradient relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <X className="h-7 w-7" />
            </motion.span>
          ) : (
            <motion.span
              key="help"
              initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <HelpCircle className="h-7 w-7" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="sr-only">Support</span>
      </motion.button>
    </div>
  );
}

interface SupportLinkProps {
  href: string;
  eyebrow: string;
  label: string;
  icon: React.ReactNode;
}

function SupportLink({ href, eyebrow, label, icon }: SupportLinkProps) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-on-surface/5 hover:bg-surface-container-low"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {eyebrow}
        </span>
        <span className="font-bold text-on-surface transition-colors group-hover:text-primary">
          {label}
        </span>
      </div>
    </a>
  );
}
