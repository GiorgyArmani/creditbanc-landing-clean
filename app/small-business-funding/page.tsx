import { notFound } from 'next/navigation';
import CategoryPageShell, {
  categoryMetadata,
} from '@/components/sections/CategoryPageShell';
import { getCategory } from '@/lib/programs';

const category = getCategory('small-business-funding');

export const metadata = category ? categoryMetadata(category) : {};

export default function SmallBusinessFundingPage() {
  if (!category) notFound();
  return <CategoryPageShell category={category} />;
}
