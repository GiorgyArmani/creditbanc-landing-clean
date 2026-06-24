import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import CTA from '@/components/sections/CTA';
import ProductCategory from '@/components/sections/ProductCategory';
import { FloatingSupport } from '@/components/floating-support';
import { type ProgramCategory } from '@/lib/programs';
import { categoryServiceLd } from '@/lib/schema';

/** Page <metadata> for a category route — keeps the route files one-liners. */
export function categoryMetadata(category: ProgramCategory): Metadata {
  return {
    title: category.metaTitle,
    description: category.metaDescription,
    alternates: { canonical: `/${category.slug}` },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: `/${category.slug}`,
      type: 'website',
    },
  };
}

/** Full category page: chrome + Service schema + crawlable program sections. */
export default function CategoryPageShell({
  category,
}: {
  category: ProgramCategory;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categoryServiceLd(category)),
        }}
      />
      <Navbar solid />
      <main>
        <ProductCategory category={category} />
        <CTA />
      </main>
      <Footer />
      <FloatingSupport />
    </>
  );
}
