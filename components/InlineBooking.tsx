'use client';

import Script from 'next/script';
import { SITE } from '@/lib/site';
import { BOOKING_BASE, IFRAME_ID } from '@/components/BookWithCreditBanc';

// The same GHL calendar /book-with-creditbanc embeds, dropped straight into a
// page instead of behind a navigation. Used where sending the visitor to the
// booking page would pull them into the site nav and apply funnel.

interface Props {
  /** The contact already captured on the page. `firstName` may hold a full name. */
  contact: { firstName: string; email: string; phone: string };
}

export default function InlineBooking({ contact }: Props) {
  const src = (() => {
    const url = new URL(BOOKING_BASE);
    const full = contact.firstName.trim().replace(/\s+/g, ' ');
    const space = full.indexOf(' ');
    const first = space === -1 ? full : full.slice(0, space);
    const last = space === -1 ? '' : full.slice(space + 1);
    if (first) url.searchParams.set('first_name', first);
    if (last) url.searchParams.set('last_name', last);
    if (contact.email) url.searchParams.set('email', contact.email.trim());
    if (contact.phone) url.searchParams.set('phone', contact.phone.trim());
    return url.toString();
  })();

  return (
    <div>
      <div className="w-full overflow-hidden rounded-2xl bg-surface-container-lowest">
        <iframe
          src={src}
          id={IFRAME_ID}
          title="Book a call with Credit Banc"
          scrolling="no"
          style={{
            width: '100%',
            minHeight: '700px',
            border: 'none',
            overflow: 'hidden',
          }}
        />
      </div>
      <p className="mt-4 text-center text-sm text-on-surface-variant">
        Calendar not loading? Call us at{' '}
        <a
          href={SITE.phoneTel}
          className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
        >
          {SITE.phone}
        </a>
        .
      </p>
      {/* Auto-fits the iframe height to the calendar. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
