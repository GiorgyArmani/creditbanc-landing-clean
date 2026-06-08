// app/blog/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { FloatingSupport } from "@/components/floating-support";
import { getPosts, getPost } from "@/lib/blog";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

// Next.js 15+ style, where `params` is a Promise (Next 16 in this app too).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Credit Banc`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
      type: "article",
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="bg-surface pt-24">
        <article className="mx-auto max-w-3xl px-6 sm:px-8 py-16">
          <Link
            href="/blog"
            className="text-sm font-semibold text-[#1f6b4e] transition hover:text-on-secondary-fixed"
          >
            &larr; Back to all posts
          </Link>

          <div className="mt-6 mb-3 flex flex-wrap gap-2">
            {post.categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-on-primary-container"
              >
                {c}
              </span>
            ))}
          </div>

          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-secondary-fixed">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-cb-gray">{post.publishedLabel}</p>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="mt-8 w-full rounded-2xl object-cover"
            />
          )}

          {post.content ? (
            // Full post HTML, already stripped of GHL's inline styles in
            // lib/blog.ts. The `prose` classes own typography; the brand tokens
            // below (navy headings, emerald links) match the rest of the site.
            // prose-img:* forces inline images to scale instead of using GHL's
            // fixed pixel widths.
            <div
              className="prose prose-slate mt-10 max-w-none font-body prose-headings:font-headline prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-on-secondary-fixed prose-a:font-semibold prose-a:text-[#1f6b4e] prose-strong:text-on-secondary-fixed prose-img:mx-auto prose-img:h-auto prose-img:w-full prose-img:max-w-full prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            // Fallback if a post ever comes back without full content.
            <div className="mt-10">
              <p className="text-lg leading-relaxed text-on-surface-variant">
                {post.excerpt}
              </p>
              <a
                href={post.link}
                className="mt-8 inline-block rounded-lg bg-primary px-5 py-3 font-bold text-on-secondary-fixed transition hover:brightness-95"
              >
                Read the full article
              </a>
            </div>
          )}
        </article>

        {/* On-brand closing CTA so every post funnels toward applying. */}
        <section
          className="px-6 sm:px-8 py-16 sm:py-20"
          style={{
            background:
              "linear-gradient(135deg, #1f6b4e 0%, #2ea878 45%, #55cf9e 100%)",
          }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to put the money to work?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Tell us what you need the funding to do and we&rsquo;ll help match
              the need to the right solution.
            </p>
            <Link
              href="/apply-now"
              className="mt-8 inline-block rounded-lg bg-on-secondary-fixed px-8 py-4 font-bold text-primary-fixed transition hover:scale-[1.03]"
            >
              Get Pre-Qualified Today
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
