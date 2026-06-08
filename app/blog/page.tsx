// app/blog/page.tsx
import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { FloatingSupport } from "@/components/floating-support";
import { getPosts } from "@/lib/blog";

export const revalidate = 3600;

export const metadata = {
  title: "Blog | Credit Banc",
  description:
    "Straight talk on business funding, cash flow, and growth from Credit Banc.",
};

// Deep-emerald gradient used across the site's green sections (see ValueProp),
// so the blog reads as part of the same surface, not a bolted-on page.
const EMERALD_GRADIENT =
  "linear-gradient(135deg, #1f6b4e 0%, #2ea878 45%, #55cf9e 100%)";

export default async function BlogIndex() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Green block: header + featured post share one emerald surface so the
            page opens with the cream↔green rhythm instead of a flat header. */}
        <section
          className="relative overflow-hidden px-6 sm:px-8 pt-16 sm:pt-20 pb-20 sm:pb-24"
          style={{ background: EMERALD_GRADIENT }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl">
            <header className="max-w-2xl">
              <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                Credit Banc
              </p>
              <h1 className="mt-3 font-headline text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Blog
              </h1>
              <p className="mt-4 text-lg text-white/90">
                Straight talk on funding, cash flow, and building a business
                that lasts.
              </p>
            </header>

            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group mt-12 grid gap-6 md:grid-cols-2 md:items-center"
              >
                {featured.image && (
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/20">
                    {/* Plain <img> avoids next.config remote-image setup. To switch
                        to next/image, add the CDN hosts to images.remotePatterns. */}
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {featured.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-headline text-2xl font-extrabold tracking-tight text-white transition group-hover:text-primary-fixed sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-white/90">{featured.excerpt}</p>
                  <div className="mt-5 flex items-center gap-3 text-sm text-white/70">
                    <span>{featured.publishedLabel}</span>
                    <span aria-hidden>·</span>
                    <span className="font-semibold text-white transition group-hover:text-primary-fixed">
                      Read article &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Cream block: the rest of the posts. */}
        <section className="bg-surface px-6 sm:px-8 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#1f6b4e]">
              Latest
            </p>
            <h2 className="mt-2 font-headline text-2xl font-extrabold tracking-tight text-on-secondary-fixed sm:text-3xl">
              More from the team
            </h2>

            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col"
                >
                  {post.image && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="mb-2 flex flex-wrap gap-2">
                    {post.categories.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-xs font-semibold text-on-primary-container"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-headline text-lg font-bold tracking-tight text-on-secondary-fixed transition group-hover:text-[#1f6b4e]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-on-surface-variant">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-cb-gray">
                    {post.publishedLabel}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
