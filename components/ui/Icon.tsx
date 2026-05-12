import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Brain,
  Briefcase,
  Building,
  Building2,
  CheckCircle2,
  Clock,
  Cog,
  CreditCard,
  FileText,
  Gauge,
  Handshake,
  HardHat,
  Headphones,
  Landmark,
  LayoutGrid,
  Lightbulb,
  Mail,
  MessagesSquare,
  Move,
  PiggyBank,
  Pointer,
  ReceiptText,
  RefreshCw,
  Rocket,
  ShoppingCart,
  Store,
  TrendingUp,
  Unlock,
  Users,
  UserCheck,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  account_balance: Landmark,
  apartment: Building,
  apps: LayoutGrid,
  arrow_forward: ArrowRight,
  bolt: Zap,
  business: Briefcase,
  check_circle: CheckCircle2,
  close: X,
  compare_arrows: ArrowLeftRight,
  construction: HardHat,
  credit_card: CreditCard,
  domain: Building2,
  edit_document: FileText,
  engineering: Wrench,
  forum: MessagesSquare,
  groups: Users,
  handshake: Handshake,
  lightbulb: Lightbulb,
  lock_open: Unlock,
  mail: Mail,
  open_with: Move,
  person_check: UserCheck,
  precision_manufacturing: Cog,
  psychology: Brain,
  receipt_long: ReceiptText,
  rocket_launch: Rocket,
  savings: PiggyBank,
  schedule: Clock,
  shopping_cart: ShoppingCart,
  speed: Gauge,
  storefront: Store,
  support_agent: Headphones,
  sync: RefreshCw,
  touch_app: Pointer,
  trending_up: TrendingUp,
  verified: BadgeCheck,
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
