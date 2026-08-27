// Config for the SMS → landing A/B funnel at /daily-payments.
//
// The page itself does the selling: headline → 3 benefits → video → CTA →
// proof → CTA. Traffic arrives from SMS, so every knob a test needs to turn
// lives here rather than buried in the component.
//
// TESTING MODEL — three independent axes, each its own URL param:
//
//   ?v=a|b|c|d|e   the cell: headline, subheadline, and its video
//   ?vid=1|2       override the variant's video (for isolating that axis)
//   ?cta=1|2|3     the button label
//
// Send one link per cell and let GHL segment on the hidden fields below.
//
// Each copy variant carries its own video, so ?v=a and ?v=b differ in both
// headline and cut — the cell wins or loses as a whole. That is the intended
// design here, but it does mean a win can't be attributed to the copy or the
// video on its own. When you want that attribution, pin the video with ?vid=
// and vary only ?v=. The CTA label stays a separate axis for the same reason.

export type VariantKey = 'a' | 'b' | 'c' | 'd' | 'e';
export type VideoKey = '1' | '2';
export type CtaKey = '1' | '2' | '3';

export interface FunnelVariant {
  key: VariantKey;
  /** Internal name — this is the value that lands in GHL as `page_variant`. */
  name: string;
  eyebrow: string;
  /** Headline splits so the closing phrase can carry the mint marker sweep. */
  headline: string;
  headlineAccent: string;
  subheadline: string;
  /** The cut this cell ships with. Overridable per-link via ?vid=. */
  video: VideoKey;
}

export const FUNNEL_VARIANTS: Record<VariantKey, FunnelVariant> = {
  a: {
    key: 'a',
    name: 'control-still-making',
    eyebrow: 'For owners with an active merchant cash advance',
    headline: 'Still making daily or weekly',
    headlineAccent: 'MCA payments?',
    subheadline:
      'You may qualify to replace high-frequency payments with a better-structured financing option.',
    video: '1',
  },
  b: {
    key: 'b',
    name: 'getting-old-yet',
    eyebrow: 'For owners with an active merchant cash advance',
    headline: 'Daily or weekly payments',
    headlineAccent: 'getting old yet?',
    subheadline:
      'See if you may qualify to replace high-frequency MCA payments with a more manageable structure.',
    video: '2',
  },
  c: {
    key: 'c',
    name: 'one-monthly-payment',
    eyebrow: 'For owners with an active merchant cash advance',
    headline: 'What if those daily payments became',
    headlineAccent: 'one monthly payment?',
    subheadline:
      'See what options may be available to restructure existing MCA debt and give your business more breathing room.',
    video: '1',
  },
  d: {
    key: 'd',
    name: 'before-another-mca',
    eyebrow: 'Watch this before you sign anything',
    headline: 'Before you take another MCA,',
    headlineAccent: 'watch this.',
    subheadline:
      'If you already have daily or weekly payments, there may be a better way to handle what you have before adding more.',
    video: '1',
  },
  e: {
    key: 'e',
    name: 'capital-not-another-daily',
    eyebrow: 'For owners who need capital and already carry an advance',
    headline: 'Need capital, but',
    headlineAccent: 'not another daily payment?',
    subheadline:
      'Before adding another MCA, see what other financing options may make sense for your business.',
    video: '2',
  },
};

export const DEFAULT_VARIANT: VariantKey = 'a';

// CTA labels. #1 is the control — the brief's point stands: "Learn More" is
// not a call to action, it is a shrug.
export const CTA_LABELS: Record<CtaKey, string> = {
  '1': 'See If I Can Lower My Payments',
  '2': 'See What You Qualify For',
  '3': 'Show Me My Options',
};

export const DEFAULT_CTA: CtaKey = '1';

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------
// The two cuts are DIFFERENT SHAPES, so each carries its own orientation and
// the hero lays itself out around whichever one the variant ships:
//
//   '1' is a 9:16 vertical Short  → portrait frame beside the copy on desktop
//   '2' is a 16:9 horizontal cut  → full-width frame under the copy
//
// This matters beyond taste. Video 2's thumbnail is a designed 16:9 composition
// whose text runs edge to edge; cropping it into a portrait frame would cut off
// both ends of the headline and throw away the hook.
//
// Unlisted YouTube works fine here. "Unlisted" only means YouTube won't
// surface the video in search or on the channel page — anyone with the ID can
// watch, and it embeds normally, which is all an embed needs. (A *private*
// video would not embed.) The ID is the last path segment of a youtu.be or
// youtube.com/shorts link.
//
// `duration` is the chip printed on the poster frame, so it is a promise to
// the viewer — leave it undefined rather than guess, and the chip is omitted.
export const FUNNEL_VIDEOS: Record<
  VideoKey,
  {
    youtubeId: string;
    name: string;
    title: string;
    orientation: 'horizontal' | 'vertical';
    duration?: string;
  }
> = {
  '1': {
    youtubeId: '9ra1ywW-QfE',
    name: 'short-before-another-mca',
    title: 'Before you take another MCA, watch this!',
    orientation: 'vertical',
    duration: '60 sec',
  },
  // TODO — confirm the runtime and set `duration`, or leave it off.
  '2': {
    youtubeId: 'z_oLi7h7bQo',
    name: 'stop-stacking-debt',
    title: 'Before You Take Another MCA… Watch This',
    orientation: 'horizontal',
  },
};

export const DEFAULT_VIDEO: VideoKey = '1';

// ---------------------------------------------------------------------------
// Prequalification form
// ---------------------------------------------------------------------------
// TODO — swap for the short prequalification form's ID once it exists in GHL.
// This points at the Master Form (the same one /apply-now embeds) so the page
// is usable today; PREQUAL_FORM_HEIGHT should shrink along with it.
export const PREQUAL_FORM_ID = 'n4aCgud8X9ItLI36ZRch';
export const PREQUAL_FORM_NAME = 'Master Form - Credit Banc';
export const PREQUAL_FORM_HEIGHT = 1294;

// Values pushed into the embedded form's payload on every submission.
//
// HOW GHL TAGGING ACTUALLY WORKS: the embed can only prefill form FIELDS via
// query string, and only when the key here exactly matches a field's Query Key
// on form PREQUAL_FORM_ID. There is no `?tag=` param GHL honors on its own. So
// each key below needs (1) a hidden field with that Query Key, and (2) a
// "Form Submitted" workflow that reads it. Keys with no matching field are
// ignored — harmless, so this is safe to ship before the GHL side is built.
export function funnelFormFields(opts: {
  variant: FunnelVariant;
  videoKey: VideoKey;
  ctaKey: CtaKey;
}): Record<string, string> {
  return {
    'lead_source_(dashboard_control)': 'sms-daily-payments',
    appointment_source: 'daily-payments',
    interest: 'mca-restructure',
    page_variant: opts.variant.name,
    video_variant: FUNNEL_VIDEOS[opts.videoKey].name,
    cta_variant: CTA_LABELS[opts.ctaKey],
  };
}

// ---------------------------------------------------------------------------
// Param resolution
// ---------------------------------------------------------------------------
// Params arrive from the server's `searchParams`, so a value can be a string,
// an array (repeated key), or missing. Anything unrecognized falls back to the
// control rather than erroring — a mistyped SMS link should still sell.
function first(raw: string | string[] | undefined): string {
  return (Array.isArray(raw) ? raw[0] : raw)?.trim().toLowerCase() ?? '';
}

// Accepts a|b|c|d|e and 1|2|3|4|5, so links can read either way.
export function resolveVariant(
  raw: string | string[] | undefined
): FunnelVariant {
  const value = first(raw);
  const byIndex = ['a', 'b', 'c', 'd', 'e'][Number(value) - 1];
  const key = (value in FUNNEL_VARIANTS ? value : byIndex) as VariantKey;
  return FUNNEL_VARIANTS[key] ?? FUNNEL_VARIANTS[DEFAULT_VARIANT];
}

// The variant's own cut unless the link names one explicitly.
export function resolveVideo(
  raw: string | string[] | undefined,
  variant: FunnelVariant
): VideoKey {
  const value = first(raw);
  return (value in FUNNEL_VIDEOS ? value : variant.video) as VideoKey;
}

export function resolveCta(raw: string | string[] | undefined): CtaKey {
  const value = first(raw);
  return (value in CTA_LABELS ? value : DEFAULT_CTA) as CtaKey;
}

// Everything the server read off the URL, flattened for the client component.
// Campaign links carry their own lead_source / prefill params and those must
// survive into the form embed, so the whole bag travels rather than a subset.
export function flattenParams(
  params: Record<string, string | string[] | undefined>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    const v = Array.isArray(value) ? value[0] : value;
    if (typeof v === 'string' && v) out[key] = v;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Video engagement
// ---------------------------------------------------------------------------
// Watch depth reaches GHL as a bucketed tag rather than a raw percentage:
// workflows and smart lists trigger on tags, so `video-watched-75` is something
// the CRM can act on where `78` is just a number sitting on a record.
//
// Shared by the client (which measures) and app/api/video-engagement (which
// writes), so there is exactly one definition of where each boundary sits.
export const WATCH_TAGS = [
  'video-not-played',
  'video-watched-25',
  'video-watched-50',
  'video-watched-75',
  'video-watched-complete',
] as const;

export type WatchTag = (typeof WATCH_TAGS)[number];

/** Milestones the player reports at. 95 counts as complete — almost nobody
 *  sits through trailing silence, and waiting for 100 would undercount. */
export const WATCH_MILESTONES = [25, 50, 75, 95] as const;

export function watchBucket(pct: number): WatchTag {
  if (!Number.isFinite(pct) || pct <= 0) return 'video-not-played';
  if (pct >= 95) return 'video-watched-complete';
  if (pct >= 75) return 'video-watched-75';
  if (pct >= 50) return 'video-watched-50';
  if (pct >= 25) return 'video-watched-25';
  // Played, but barely — still meaningfully different from never pressing play.
  return 'video-not-played';
}
