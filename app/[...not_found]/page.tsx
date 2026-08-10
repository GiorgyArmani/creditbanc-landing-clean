import { redirect } from 'next/navigation';

// Catch-all for any URL that doesn't match a real page (old site links,
// typos, dead bookmarks). Sends visitors to the landing page instead of a
// 404, keeping query params (utm_source etc.) intact for marketing tracking.
//
// Deliberately a TEMPORARY redirect. A permanent one gets cached by browsers
// and the CDN, so any funnel URL that briefly 404s here (e.g. a GHL redirect
// pointing at a page we hadn't built yet) would keep bouncing to the home page
// for that visitor even after the real page ships.
export default async function NotFoundRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === 'string') params.set(key, value);
    else if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
  }
  const qs = params.toString();
  redirect(qs ? `/?${qs}` : '/');
}
