import Script from 'next/script';
import { PIXEL_ID, PIXEL_DEBUG } from '@/lib/openai-pixel';

// Base snippet from https://developers.openai.com/ads/measurement-pixel, kept
// verbatim apart from the interpolated pixel ID. It defines the `oaiq` command
// queue synchronously and loads the SDK async, so it costs one inline function
// on first paint and nothing blocking.
const SNIPPET = (pixelId: string, debug: boolean) => `
(function (w, d, s, u) {
  if (w.oaiq) return;
  var q = function () { q.q.push(arguments); };
  q.q = [];
  w.oaiq = q;
  var js = d.createElement(s);
  js.async = true;
  js.src = u;
  var f = d.getElementsByTagName(s)[0];
  f.parentNode.insertBefore(js, f);
})(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
oaiq("init", { pixelId: ${JSON.stringify(pixelId)}${debug ? ', debug: true' : ''} });
`;

/**
 * The OpenAI pixel base tag, rendered in <head> on every page.
 *
 * Runs before hydration so it captures the ad click's `oppref` param while it
 * is still on the URL, then keeps it in a first-party cookie that survives the
 * rest of the funnel. Renders nothing at all until NEXT_PUBLIC_OPENAI_PIXEL_ID
 * is set, which is what keeps the install dark.
 */
export default function OpenAIPixel() {
  if (!PIXEL_ID) return null;
  return (
    <Script
      id="openai-pixel"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: SNIPPET(PIXEL_ID, PIXEL_DEBUG) }}
    />
  );
}
