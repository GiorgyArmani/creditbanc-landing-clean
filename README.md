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
