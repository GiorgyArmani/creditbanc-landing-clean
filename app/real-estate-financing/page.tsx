import { notFound } from 'next/navigation';
import CategoryPageShell, {
  categoryMetadata,
} from '@/components/sections/CategoryPageShell';
import { getCategory } from '@/lib/programs';

const category = getCategory('real-estate-financing');

export const metadata = category ? categoryMetadata(category) : {};

export default function RealEstateFinancingPage() {
  if (!category) notFound();
  return <CategoryPageShell category={category} />;
}
