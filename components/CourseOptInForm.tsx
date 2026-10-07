'use client';

import { useSearchParams } from 'next/navigation';
import {
  COURSE_FORMS,
  CourseFormLoading,
} from '@/components/CourseFormLoading';

// GHL / LeadConnector opt-in form for the free Business Credit Builder 101
// course, shared by /business-credit-builder and /business-credit-101. Each
// page picks its GHL form via `form`. The page still has to load GHL's
// form_embed.js (the resize script) and wrap this in <Suspense>.
// Forwards every incoming URL param to the GHL form so campaign/attribution
// fields reach LeadConnector. Isolated so its useSearchParams() only pushes
// the form (not the whole page) behind a Suspense boundary at build time.
export default function CourseOptInForm({
  form = 'original',
}: {
  form?: keyof typeof COURSE_FORMS;
}) {
  const params = useSearchParams();
  const {
    id: FORM_ID,
    name: FORM_NAME,
    height: FORM_HEIGHT,
  } = COURSE_FORMS[form];
  const FORM_IFRAME_ID = `inline-${FORM_ID}`;

  const formSrc = (() => {
    const url = new URL(
      `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`
    );
    params.forEach((value, key) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  })();

  // form_embed.js pulls the iframe out of flow (position:absolute,
  // left:-9999px) while it re-loads the form, then reveals it ~3s later. The
  // wrapper holds the card's height and keeps a loader behind the iframe so
  // the card doesn't collapse or flash blank in the meantime.
  return (
    <div className="relative" style={{ minHeight: `${FORM_HEIGHT}px` }}>
      <div className="absolute inset-0">
        <CourseFormLoading height={FORM_HEIGHT} />
      </div>
      <iframe
        key={formSrc}
        src={formSrc}
        id={FORM_IFRAME_ID}
        title="Business Credit Builder 101 Opt-In Form"
        data-layout="{'id':'INLINE'}"
        data-form-id={FORM_ID}
        data-form-name={FORM_NAME}
        data-height={FORM_HEIGHT}
        data-layout-iframe-id={FORM_IFRAME_ID}
        data-trigger-type="alwaysShow"
        data-activation-type="alwaysActivated"
        data-deactivation-type="neverDeactivate"
        data-cookie-consent="true"
        data-cookie-consent-provider="auto"
        scrolling="no"
        // form_embed.js rewrites scrolling/style on this iframe, sometimes
        // before hydration finishes; that mismatch is expected.
        suppressHydrationWarning
        style={{
          width: '100%',
          minHeight: `${FORM_HEIGHT}px`,
          border: 'none',
          overflow: 'hidden',
          position: 'relative',
        }}
      />
    </div>
  );
}
