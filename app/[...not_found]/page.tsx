import { permanentRedirect } from 'next/navigation';

// Catch-all for any URL that doesn't match a real page (old site links,
// typos, dead bookmarks). Sends visitors to the landing page instead of a
// 404, keeping query params (utm_source etc.) intact for marketing tracking.
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
  permanentRedirect(qs ? `/?${qs}` : '/');
}
