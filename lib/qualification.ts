// Disqualification routing — single source of truth for the funding minimums,
// the reasons an applicant misses them, and the GHL tags that route those
// applicants into their nurture workflows.
//
// The Master Form lives in GHL (see components/ApplyNowFunnel.tsx), so GHL is
// what decides a lead is out and redirects them to /thanks-for-applying. This
// module works out WHY from the values that ride along on that redirect, so the
// contact can be tagged and the "you're just early" page can name the actual
// gap instead of listing all three minimums at everyone.
//
// Pure data + parsing. Safe to import from server or client.

/** Funding minimums. These mirror the copy on /thanks-for-applying. */
export const MINIMUMS = {
  /** Personal FICO. */
  fico: 620,
  /** Monthly revenue, in dollars. */
  monthlyRevenue: 25_000,
  /** Time in business, in months. */
  timeInBusinessMonths: 6,
} as const;

export type DisqualReason = 'fico' | 'revenue' | 'tib';

/**
 * Tags written to the GHL contact, verbatim. Workflow triggers in GHL match on
 * these strings, so renaming one here means renaming its trigger there too.
 */
export const DISQUALIFIED_TAG: Record<DisqualReason, string> = {
  fico: 'disqualified - fico',
  revenue: 'disqualified - revenue',
  tib: 'disqualified - tib',
};

export const DISQUALIFIED_TAGS = Object.values(DISQUALIFIED_TAG);

/** Human labels for the page copy and the advisor note. */
export const REASON_LABEL: Record<DisqualReason, string> = {
  fico: 'FICO score',
  revenue: 'monthly revenue',
  tib: 'time in business',
};

// --- Parsing ----------------------------------------------------------------
// Answers arrive as whatever the GHL field is set to: a raw number ("580"), a
// dropdown bucket ("$10,000 - $25,000", "Less than 6 months", "650+"), or a
// phrase ("Not open yet"). Everything is normalized to the HIGHEST value the
// answer could represent, so a bucket only disqualifies when its entire range
// sits under the minimum.
//
// That asymmetry is deliberate: a wrongly-applied tag drops a fundable lead
// into a "come back later" workflow, while a missing tag just leaves them in
// the normal flow for an advisor to catch. When in doubt, don't tag.

interface Bound {
  /** Largest value the answer could mean. Infinity for open-ended ("650+"). */
  max: number;
  /** True when the answer means strictly-below max ("Under $10,000"). */
  exclusive: boolean;
}

const OPEN_ENDED = /\+|\bor more\b|\bor above\b|\bover\b|\babove\b|\bgreater\b|\bat least\b|\bplus\b/i;
const BELOW = /\bunder\b|\bless than\b|\bbelow\b|\bfewer\b|\bup to\b|\bunder\b|</i;

function parseBound(raw: string): Bound | null {
  const s = raw.trim();
  if (!s) return null;
  if (OPEN_ENDED.test(s)) return { max: Infinity, exclusive: false };

  // "$25,000", "25k", "1.5M", "600 - 649". The k/M suffix must not run into a
  // word, or the "m" in "3 months" reads as millions.
  const matches = s.match(/\d[\d,]*\.?\d*\s*(?:[kKmM](?![a-zA-Z]))?/g);
  if (!matches) return null;

  const values = matches
    .map((m) => {
      const unit = /[kK]$/.test(m.trim()) ? 1_000 : /[mM]$/.test(m.trim()) ? 1_000_000 : 1;
      const n = Number(m.replace(/[^\d.]/g, ''));
      return Number.isFinite(n) ? n * unit : NaN;
    })
    .filter((n) => Number.isFinite(n));
  if (!values.length) return null;

  return { max: Math.max(...values), exclusive: BELOW.test(s) };
}

/** True when every value the answer could mean falls short of `minimum`. */
function isBelow(bound: Bound | null, minimum: number): boolean {
  if (!bound) return false;
  return bound.exclusive ? bound.max <= minimum : bound.max < minimum;
}

// Time in business needs a unit before it can be compared: "2" means two of
// something, and the dropdowns mix months and years freely.
const YEARS = /\byears?\b|\byrs?\b/i;
const NO_BUSINESS_YET =
  /\bstart[- ]?up\b|\bnot (yet )?(open|started|operating|in business)\b|\bpre[- ]?revenue\b|\bidea stage\b|\bbrand new\b|\bnot open yet\b/i;
const NO_REVENUE = /\bno revenue\b|\bnone\b|\bpre[- ]?revenue\b|\bzero\b/i;

function parseMonths(raw: string): Bound | null {
  const bound = parseBound(raw);
  if (!bound || bound.max === Infinity) return bound;
  return YEARS.test(raw) ? { ...bound, max: bound.max * 12 } : bound;
}

export interface QualificationInput {
  /** FICO answer, raw or bucketed. */
  fico?: string | number | null;
  /** Monthly revenue answer, raw or bucketed. */
  monthlyRevenue?: string | number | null;
  /** Time in business answer, raw or bucketed. */
  timeInBusiness?: string | number | null;
}

export interface QualificationResult {
  /** Reasons the applicant is under the minimums, in FICO → revenue → TIB order. */
  reasons: DisqualReason[];
  /** GHL tags for those reasons. Empty when nothing could be determined. */
  tags: string[];
  /** What each answer was read as, for the advisor note. */
  answers: Partial<Record<DisqualReason, string>>;
}

/**
 * Work out which minimums an applicant misses. Answers that are missing or
 * unreadable ("I don't know") produce no reason at all.
 */
export function evaluateQualification(
  input: QualificationInput
): QualificationResult {
  const fico = str(input.fico);
  const revenue = str(input.monthlyRevenue);
  const tib = str(input.timeInBusiness);

  const reasons: DisqualReason[] = [];
  if (fico && isBelow(parseBound(fico), MINIMUMS.fico)) reasons.push('fico');
  if (
    revenue &&
    (NO_REVENUE.test(revenue) ||
      isBelow(parseBound(revenue), MINIMUMS.monthlyRevenue))
  ) {
    reasons.push('revenue');
  }
  if (
    tib &&
    (NO_BUSINESS_YET.test(tib) ||
      isBelow(parseMonths(tib), MINIMUMS.timeInBusinessMonths))
  ) {
    reasons.push('tib');
  }

  const answers: Partial<Record<DisqualReason, string>> = {};
  if (fico) answers.fico = fico;
  if (revenue) answers.revenue = revenue;
  if (tib) answers.tib = tib;

  return {
    reasons,
    tags: reasons.map((r) => DISQUALIFIED_TAG[r]),
    answers,
  };
}

function str(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/**
 * Read reasons GHL named outright, e.g. `?dq=fico,revenue`. Used when the
 * workflow already knows why and doesn't pass the underlying answers.
 */
export function parseReasonList(
  raw: string | string[] | null | undefined
): DisqualReason[] {
  const parts = Array.isArray(raw) ? raw : (raw || '').split(/[,|;\s]+/);
  const out: DisqualReason[] = [];
  for (const part of parts) {
    const key = part.trim().toLowerCase().replace(/^disqualified\s*-\s*/, '');
    const reason = REASON_ALIASES[key];
    if (reason && !out.includes(reason)) out.push(reason);
  }
  return out;
}

const REASON_ALIASES: Record<string, DisqualReason> = {
  fico: 'fico',
  credit: 'fico',
  'credit score': 'fico',
  creditscore: 'fico',
  revenue: 'revenue',
  'monthly revenue': 'revenue',
  monthlyrevenue: 'revenue',
  sales: 'revenue',
  tib: 'tib',
  'time in business': 'tib',
  timeinbusiness: 'tib',
  age: 'tib',
};

/**
 * Query-param names the /thanks-for-applying redirect may carry for each
 * answer. GHL field query keys vary by form, so accept the plausible spellings
 * rather than forcing one. First non-empty param wins, in listed order.
 */
export const ANSWER_PARAMS: Record<DisqualReason, string[]> = {
  fico: ['fico', 'credit_score', 'creditScore', 'credit', 'fico_score'],
  revenue: [
    'monthly_revenue',
    'monthlyRevenue',
    'revenue',
    'average_monthly_revenue',
    'monthly_sales',
  ],
  tib: [
    'time_in_business',
    'timeInBusiness',
    'tib',
    'business_age',
    'years_in_business',
  ],
};
