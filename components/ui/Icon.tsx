import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Landmark,
  Mail,
  Store,
  TrendingUp,
  Unlock,
  UserCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  account_balance: Landmark,
  domain: Building2,
  storefront: Store,
  person_check: UserCheck,
  edit_document: FileText,
  compare_arrows: ArrowLeftRight,
  trending_up: TrendingUp,
  bolt: Zap,
  check_circle: CheckCircle2,
  arrow_forward: ArrowRight,
  mail: Mail,
  lock_open: Unlock,
};

interface IconProps {
  name: string;
  className?: string;
}

export default function Icon({ name, className = '' }: IconProps) {
  const Component = ICON_MAP[name];
  if (!Component) return null;
  return (
    <Component
      aria-hidden="true"
      className={`inline-block align-middle shrink-0 ${className}`}
      style={{ width: '1em', height: '1em' }}
    />
  );
}
