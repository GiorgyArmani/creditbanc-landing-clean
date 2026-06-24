import { notFound } from 'next/navigation';
import CategoryPageShell, {
  categoryMetadata,
} from '@/components/sections/CategoryPageShell';
import { getCategory } from '@/lib/programs';

const category = getCategory('sba-loans');

export const metadata = category ? categoryMetadata(category) : {};

export default function SbaLoansPage() {
  if (!category) notFound();
  return <CategoryPageShell category={category} />;
}
