# Creditbanc Landing Page

Production-ready Next.js 14 landing page for Creditbanc, built with TypeScript, Tailwind CSS, and the App Router.

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript** (strict mode)
- **Tailwind CSS 3.4** with full Material Design token palette
- **Manrope + Inter** fonts via Google Fonts
- **Material Symbols** icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── globals.css         # Tailwind directives + custom utilities
│   ├── layout.tsx          # Root layout, fonts, metadata
│   └── page.tsx            # Home page composition
├── components/
│   ├── sections/           # Page sections (Hero, Products, etc.)
│   └── ui/                 # Reusable primitives (Icon)
├── tailwind.config.ts      # Full design token system
├── tsconfig.json
└── next.config.js
```

## Design System

The Tailwind config defines the full Material 3 token palette used across the site. Key tokens:

- `primary` / `primary-container` — brand greens (#006c4c, #55cf9e)
- `on-secondary-fixed` — deep navy text (#131937)
- `surface` family — backgrounds, cards
- `signature-gradient` utility class — primary green diagonal gradient

## Customization

- **Replace images**: Hero and product images currently load from `lh3.googleusercontent.com`. Drop your own assets in `public/` and swap the `src` values.
- **Update copy**: Each section is its own component — edit in `components/sections/`.
- **Add routes**: Drop new folders into `app/` (e.g. `app/sba/page.tsx`).

## Notes for Matt

- Apply Now and Get Started buttons are wired as `<button>` elements with no `onClick` yet — connect to your GHL form or onboarding flow when ready.
- The metadata in `app/layout.tsx` is set up for SEO; update Open Graph image when you have one.
- Image domains are whitelisted in `next.config.js` — add yours if you swap hosts.

## ChatGPT Ads measurement (OpenAI pixel)

Installed but **dark until the pixel ID is set**. With no
`NEXT_PUBLIC_OPENAI_PIXEL_ID` the base snippet never renders, `window.oaiq`
never exists, and every call no-ops — verified against a production build.

### Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_OPENAI_PIXEL_ID` | yes, to go live | unset (dark) | Pixel ID from the Ads Manager data source. |
| `NEXT_PUBLIC_OPENAI_LEAD_EVENT_AT` | no | `booking` | `booking` counts qualified leads only; `submit` counts every application. |
| `NEXT_PUBLIC_OPENAI_PIXEL_DEBUG` | no | on outside production | `true` forces the SDK's debug logging on, `false` forces it off. Turn it on temporarily when the ad team wants to watch events land on the live site. |

Both are `NEXT_PUBLIC_*`, so they are **inlined at build time** — changing
either in Vercel requires a redeploy, not just a restart.

### What fires where

| Page | Event | Meaning |
| --- | --- | --- |
| every page | `page_viewed` | Fires on first load and on each client-side navigation. |
| `/book-with-creditbanc` | `lead_created` | Qualified application. GHL only redirects here when the applicant clears our funding minimums. |
| `/thanks-for-applying` | custom `lead_below_minimums` | A real submission, but deliberately not `lead_created` — optimizing toward it would buy more of the leads we just turned away. |
| `/appointment-confirmation-received` | `appointment_scheduled` | A booked call. The event worth optimizing toward once volume supports it. |

### The event shape gotcha

The SDK validates each event against a shape chosen by event name and
**silently drops** anything that does not match, logging
`validation failed; event dropped` once per distinct problem — so a mismatch is
easy to miss entirely. The mapping is not in the published docs and is not
uniform:

| Event | Required `data.type` |
| --- | --- |
| `page_viewed` | `contents` |
| `lead_created` | `customer_action` |
| `appointment_scheduled` | `customer_action` |
| `custom` | `custom` (plus `custom_event_name` in the options argument) |

Each shape also has a closed field list, and an undocumented field fails the
same way:

- `contents` → `type`, `amount`, `currency`, `contents`
- `customer_action` → `type`, `amount`, `currency`
- `custom` → `type`, `plan_id`, `amount`, `currency`, `contents`
- options → `event_id`, `eventId`, `custom_event_name`, `opt_out`

These come from the SDK's own table (`oaiq.min.js` 0.1.41) and are verified
against the live pixel. `DATA_TYPE` in `lib/openai-pixel.ts` encodes them, so
add events there rather than passing a type by hand. If you ever need to check
a new event, run the site with debug on and watch the console — a dropped
event is otherwise invisible.

With `NEXT_PUBLIC_OPENAI_LEAD_EVENT_AT=submit`, `lead_created` moves off the
booking page and fires on `/apply-now` the moment the form is submitted.

### How it works around the GHL iframe

The Master Form runs in a `leadconnectorhq.com` iframe, which a pixel on the
parent page cannot see into. It does not need to: the form broadcasts the
submitted contact to the parent via `postMessage`, and we already listen for it
with an origin check (`lib/sticky-contact.ts`). `lib/openai-pixel.ts` hashes
that contact (SHA-256, in the browser — raw values are never sent) and stashes
it so the conversion on the redirect destination is matched to a person.

Attribution needs no plumbing: every hop is creditbanc.io, so the pixel's own
first-party `__oppref` cookie carries the ad click across the funnel.

### Not yet done

Server-side Conversions API. Event IDs are already seeded from the contact's
email hash, so a GHL webhook hashing the same email arrives at the same ID and
the two sides deduplicate without sharing state.
