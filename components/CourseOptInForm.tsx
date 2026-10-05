'use client';

import { useSearchParams } from 'next/navigation';

// GHL / LeadConnector opt-in form for the free Business Credit Builder 101
// course, shared by /business-credit-builder and /business-credit-101 so both
// pages feed the same GHL workflow. The page still has to load GHL's
// form_embed.js (the resize script) and wrap this in <Suspense>.
const FORM_ID = 'AT5ZqbMvaRSJDU0yHWsb';
const FORM_IFRAME_ID = `inline-${FORM_ID}`;

// Forwards every incoming URL param to the GHL form so campaign/attribution
// fields reach LeadConnector. Isolated so its useSearchParams() only pushes
// the form (not the whole page) behind a Suspense boundary at build time.
export default function CourseOptInForm() {
  const params = useSearchParams();

  const formSrc = (() => {
    const url = new URL(
      `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`
    );
    params.forEach((value, key) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  })();

  return (
    <iframe
      key={formSrc}
      src={formSrc}
      id={FORM_IFRAME_ID}
      title="Business Credit Builder 101 Opt-In Form"
      data-layout="{'id':'INLINE'}"
      data-form-id={FORM_ID}
      data-form-name="Credit Builder Course - NEW FORM"
      data-height="555"
      data-layout-iframe-id={FORM_IFRAME_ID}
      data-trigger-type="alwaysShow"
      data-activation-type="alwaysActivated"
      data-deactivation-type="neverDeactivate"
      scrolling="no"
      // form_embed.js rewrites scrolling/style on this iframe, sometimes
      // before hydration finishes; that mismatch is expected.
      suppressHydrationWarning
      style={{
        width: '100%',
        minHeight: '555px',
        border: 'none',
        overflow: 'hidden',
      }}
    />
  );
}
