// app/resources/page.tsx
import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";
import ResourcesGrid from "@/components/ResourcesGrid";
import { FloatingSupport } from "@/components/floating-support";
import { SITE } from "@/lib/site";
import { RESOURCES } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources | Free Tools & Guides for Business Owners",
  description:
    "Courses, calculators, a podcast, a newsletter, a bestselling book, and a blog. Tools and freebies for business owners who would rather learn from us than from a six-figure mistake.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Resources | Credit Banc",
    description:
      "Tools and resources and freebies for business owners who would rather learn from us than from a six-figure mistake.",
    type: "website",
  },
};

// Deep-emerald gradient used across the site's green sections (see ValueProp /
// blog), so this page reads as part of the same surface.
const EMERALD_GRADIENT =
  "linear-gradient(135deg, #1f6b4e 0%, #2ea878 45%, #55cf9e 100%)";

// ItemList JSON-LD so AI search / rich results can enumerate the resource hub
// (in step with the site's AEO/GEO work).
const RESOURCES_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Credit Banc Resources",
  itemListElement: RESOURCES.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: r.title,
    description: r.description,
    url: r.external ? r.href : `${SITE.baseUrl}${r.href}`,
  })),
};

export default function ResourcesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(RESOURCES_LD) }}
      />
      <Navbar />
      <main className="pt-24">
        {/* Green block: the headline + subhead on one emerald surface, opening
            the page in the site's cream↔green rhythm. */}
        <section
          className="relative overflow-hidden px-6 sm:px-8 pt-16 sm:pt-20 pb-20 sm:pb-24"
          style={{ background: EMERALD_GRADIENT }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-on-secondary-fixed/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              Resources
            </p>
            <h1 className="mt-3 font-headline text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Learn. Grow. Scale.
              <br className="hidden sm:block" /> Bullshit Not Included.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">
              Tools and resources and freebies for business owners who would
              rather learn from us than from a six-figure mistake.
            </p>
          </div>
        </section>

        {/* Cream block: the resource cards (client component owns the v1/v2
            testing toggle). */}
        <section className="bg-surface px-6 sm:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <ResourcesGrid />
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
