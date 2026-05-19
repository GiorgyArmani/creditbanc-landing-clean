"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  Clock,
  Gauge,
} from "lucide-react";
import { ROUTES } from "@/lib/site";

// ---------- Types ----------

type Urgency = "Within 30 days" | "30–60 days" | "60–90 days" | "Just planning";
type Pressure = "None" | "Low" | "Medium" | "High";
type RiskLevel = "Low" | "Moderate" | "Elevated" | "High";

interface CalculatorInputs {
  businessName: string;
  preparedBy: string;
  // Step 1
  cashOnHand: number;
  cushion: number;
  ar30: number;
  ar60: number;
  ar90: number;
  otherCashIn: number;
  // Step 2
  payroll: number;
  inventory: number;
  equipment: number;
  marketing: number;
  overhead: number;
  debt: number;
  taxes: number;
  otherCosts: number;
  // Step 3
  collectionDays: number;
  urgency: Urgency;
  pressure: Pressure;
}

interface CalculatorResults {
  totalCashIn: number;
  totalCashNeeded: number;
  gap: number;
  surplus: number;
  fundingTarget: number;
  risk: RiskLevel;
  meaning: string;
  readinessScore: number;
  gapPct: number;
  cushionShortfall: number;
  debtPressure: number;
  timingPressure: number;
}

// ---------- Default state ----------

const defaultInputs: CalculatorInputs = {
  businessName: "",
  preparedBy: "",
  cashOnHand: 0,
  cushion: 0,
  ar30: 0,
  ar60: 0,
  ar90: 0,
  otherCashIn: 0,
  payroll: 0,
  inventory: 0,
  equipment: 0,
  marketing: 0,
  overhead: 0,
  debt: 0,
  taxes: 0,
  otherCosts: 0,
  collectionDays: 30,
  urgency: "Within 30 days",
  pressure: "Medium",
};

// ---------- Pure calculation logic ----------

function calculate(inputs: CalculatorInputs): CalculatorResults {
  const totalCashIn =
    inputs.cashOnHand +
    inputs.ar30 +
    inputs.ar60 +
    inputs.ar90 +
    inputs.otherCashIn;

  const totalOperatingCosts =
    inputs.payroll +
    inputs.inventory +
    inputs.equipment +
    inputs.marketing +
    inputs.overhead +
    inputs.debt +
    inputs.taxes +
    inputs.otherCosts;

  const totalCashNeeded = totalOperatingCosts + inputs.cushion;

  const rawGap = totalCashNeeded - totalCashIn;
  const gap = Math.max(0, rawGap);
  const surplus = Math.max(0, -rawGap);

  const fundingTarget = gap > 0 ? Math.ceil((gap * 1.1) / 1000) * 1000 : 0;

  const gapPct =
    totalOperatingCosts > 0 ? (gap / totalOperatingCosts) * 100 : 0;

  let gapPenalty = 0;
  if (gapPct > 0 && gapPct <= 10) gapPenalty = 5;
  else if (gapPct > 10 && gapPct <= 25) gapPenalty = 15;
  else if (gapPct > 25 && gapPct <= 50) gapPenalty = 30;
  else if (gapPct > 50) gapPenalty = 45;

  const cushionShortfall =
    inputs.cushion > 0 && inputs.cashOnHand < inputs.cushion
      ? Math.min(15, ((inputs.cushion - inputs.cashOnHand) / inputs.cushion) * 15)
      : 0;

  const debtRatio =
    totalOperatingCosts > 0 ? inputs.debt / totalOperatingCosts : 0;
  let debtPressure = 0;
  if (debtRatio > 0.2 && debtRatio <= 0.35) debtPressure = 10;
  else if (debtRatio > 0.35) debtPressure = 20;

  let timingPressure = 0;
  if (inputs.collectionDays > 60) timingPressure += 8;
  else if (inputs.collectionDays > 45) timingPressure += 5;
  else if (inputs.collectionDays > 30) timingPressure += 3;

  if (inputs.urgency === "Within 30 days") timingPressure += 5;
  else if (inputs.urgency === "30–60 days") timingPressure += 2;

  if (inputs.pressure === "High") timingPressure += 8;
  else if (inputs.pressure === "Medium") timingPressure += 3;

  const totalPenalty =
    gapPenalty + cushionShortfall + debtPressure + timingPressure;
  const readinessScore = Math.max(0, Math.min(100, 100 - totalPenalty));

  let risk: RiskLevel = "Low";
  if (readinessScore < 50) risk = "High";
  else if (readinessScore < 70) risk = "Elevated";
  else if (readinessScore < 85) risk = "Moderate";

  let meaning = "No obvious short-term gap. Review timing before borrowing.";
  if (gap > 0 && gapPct < 15) {
    meaning =
      "Small timing gap. Bridge financing or a line of credit may make sense — not a heavy MCA.";
  } else if (gap > 0 && gapPct < 40) {
    meaning =
      "Meaningful gap. Worth comparing structure carefully before grabbing the first offer.";
  } else if (gap > 0) {
    meaning =
      "Significant gap. The structure of the capital matters as much as the amount. Talk to a human before signing.";
  } else if (surplus > 0 && inputs.cashOnHand >= inputs.cushion) {
    meaning =
      "You may not need outside capital right now. Watch timing and revisit if costs front-load.";
  }

  return {
    totalCashIn,
    totalCashNeeded,
    gap,
    surplus,
    fundingTarget,
    risk,
    meaning,
    readinessScore: Math.round(readinessScore),
    gapPct: Math.round(gapPct),
    cushionShortfall: Math.round(cushionShortfall),
    debtPressure,
    timingPressure,
  };
}

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const APPLY_URL = `${ROUTES.apply}?utm_source=cashflow_gap_tool&utm_medium=web&utm_campaign=cashflow_gap`;

// ---------- Number input subcomponent ----------

interface NumberFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
}

function NumberField({ label, hint, value, onChange }: NumberFieldProps) {
  const [focused, setFocused] = useState(false);
  const display = focused
    ? value === 0
      ? ""
      : String(value)
    : value === 0
    ? ""
    : new Intl.NumberFormat("en-US").format(value);

  return (
    <label className="group block">
      <span className="font-label text-[13px] font-semibold tracking-tight text-on-secondary-fixed">
        {label}
      </span>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
          $
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, "");
            const num = parseFloat(raw);
            onChange(isNaN(num) ? 0 : num);
          }}
          placeholder="0"
          className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-7 pr-3 text-on-surface outline-none transition placeholder:text-on-surface-variant/40 hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {hint && (
        <p className="mt-1 text-[11px] leading-snug text-on-surface-variant">
          {hint}
        </p>
      )}
    </label>
  );
}

// ---------- Section header ----------

function SectionHeader({
  step,
  title,
  subtitle,
  icon: Icon,
}: {
  step: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-outline-variant/40 pb-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-container/40 text-on-primary-container">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          {step}
        </div>
        <h3 className="mt-1 font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-secondary-fixed leading-tight">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-on-surface-variant leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ---------- Main component ----------

export default function CashFlowGapCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => calculate(inputs), [inputs]);

  const update = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  const loadExample = () => {
    setInputs({
      businessName: "Sample HVAC Co.",
      preparedBy: "Owner",
      cashOnHand: 45000,
      cushion: 30000,
      ar30: 25000,
      ar60: 65000,
      ar90: 40000,
      otherCashIn: 0,
      payroll: 42000,
      inventory: 55000,
      equipment: 15000,
      marketing: 8000,
      overhead: 12000,
      debt: 9000,
      taxes: 5000,
      otherCosts: 4000,
      collectionDays: 45,
      urgency: "Within 30 days",
      pressure: "Medium",
    });
    setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
      150
    );
  };

  const reset = () => setInputs(defaultInputs);

  const riskColors: Record<
    RiskLevel,
    { bg: string; text: string; ring: string }
  > = {
    Low: {
      bg: "bg-primary-container/30",
      text: "text-on-primary-container",
      ring: "ring-primary/30",
    },
    Moderate: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      ring: "ring-amber-300/40",
    },
    Elevated: {
      bg: "bg-orange-50",
      text: "text-orange-800",
      ring: "ring-orange-300/40",
    },
    High: {
      bg: "bg-rose-50",
      text: "text-rose-800",
      ring: "ring-rose-300/40",
    },
  };

  return (
    <div className="bg-surface font-body text-on-surface">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 py-16 sm:py-20 md:py-24">
        <motion.div
          aria-hidden
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4"
          >
            Credit Banc · Free Planning Tool
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[0.95] mb-6 max-w-4xl"
          >
            Find the{" "}
            <span className="relative inline-block px-3 text-white">
              <motion.span
                aria-hidden
                className="absolute inset-y-1 left-0 right-0 bg-primary-container rounded-sm -z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ originX: 0 }}
              />
              <span className="relative text-on-secondary-fixed">Gap.</span>
            </span>{" "}
            Then Fund It Right.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-base md:text-lg text-primary-fixed-dim max-w-2xl leading-relaxed mb-8"
          >
            Busy isn&rsquo;t the same as paid. Plug in your numbers and see how
            much cash you&rsquo;ll actually need before the revenue catches up —
            and whether the next move is a line of credit, a bridge, or doing
            absolutely nothing.{" "}
            <em className="text-white not-italic font-semibold">
              (Yes, &ldquo;nothing&rdquo; is sometimes the right answer.)
            </em>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <motion.button
              type="button"
              onClick={loadExample}
              className="bg-primary text-on-secondary-fixed px-6 py-3 rounded-lg font-bold text-sm"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 18px 30px -12px rgba(85, 207, 158, 0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
            >
              Load example scenario
            </motion.button>
            <button
              type="button"
              onClick={reset}
              className="text-primary-fixed-dim hover:text-white px-3 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              Reset
            </button>
          </motion.div>
        </div>
      </section>

      {/* ---------- Form + Results ---------- */}
      <div className="max-w-7xl mx-auto grid gap-8 px-6 sm:px-8 py-12 sm:py-16 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          {/* Identity */}
          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,3,33,0.04)]">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="font-label text-[13px] font-semibold tracking-tight text-on-secondary-fixed">
                  Business name
                </span>
                <input
                  type="text"
                  value={inputs.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  placeholder="Acme Roofing LLC"
                  className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-on-surface outline-none transition placeholder:text-on-surface-variant/40 hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="font-label text-[13px] font-semibold tracking-tight text-on-secondary-fixed">
                  Prepared by
                </span>
                <input
                  type="text"
                  value={inputs.preparedBy}
                  onChange={(e) => update("preparedBy", e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-on-surface outline-none transition placeholder:text-on-surface-variant/40 hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
          </section>

          {/* Step 1 */}
          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,3,33,0.04)]">
            <SectionHeader
              step="Step 01"
              title="Cash on hand + money expected in"
              subtitle="Only count what you reasonably expect to collect."
              icon={DollarSign}
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Cash available today"
                hint="Your current operating cash"
                value={inputs.cashOnHand}
                onChange={(v) => update("cashOnHand", v)}
              />
              <NumberField
                label="Minimum cash cushion you want to keep"
                hint="The cash you do NOT want to touch"
                value={inputs.cushion}
                onChange={(v) => update("cushion", v)}
              />
              <NumberField
                label="Expected receivables — next 30 days"
                value={inputs.ar30}
                onChange={(v) => update("ar30", v)}
              />
              <NumberField
                label="Expected receivables — days 31–60"
                value={inputs.ar60}
                onChange={(v) => update("ar60", v)}
              />
              <NumberField
                label="Expected receivables — days 61–90"
                value={inputs.ar90}
                onChange={(v) => update("ar90", v)}
              />
              <NumberField
                label="Other expected cash in"
                hint="Deposits, refunds, owner contribution, etc."
                value={inputs.otherCashIn}
                onChange={(v) => update("otherCashIn", v)}
              />
            </div>
          </section>

          {/* Step 2 */}
          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,3,33,0.04)]">
            <SectionHeader
              step="Step 02"
              title="Cash needed before revenue catches up"
              subtitle="Everything that must be paid in the same window."
              icon={TrendingDown}
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Payroll and contractor labor"
                hint="Wages, payroll taxes, subcontractors"
                value={inputs.payroll}
                onChange={(v) => update("payroll", v)}
              />
              <NumberField
                label="Inventory / materials"
                hint="Product, raw materials, job supplies"
                value={inputs.inventory}
                onChange={(v) => update("inventory", v)}
              />
              <NumberField
                label="Equipment purchase / repair / rental"
                value={inputs.equipment}
                onChange={(v) => update("equipment", v)}
              />
              <NumberField
                label="Marketing / sales spend"
                value={inputs.marketing}
                onChange={(v) => update("marketing", v)}
              />
              <NumberField
                label="Rent, utilities, insurance"
                hint="Fixed overhead"
                value={inputs.overhead}
                onChange={(v) => update("overhead", v)}
              />
              <NumberField
                label="Debt payments due"
                hint="Loans, advances, credit cards, leases"
                value={inputs.debt}
                onChange={(v) => update("debt", v)}
              />
              <NumberField
                label="Taxes / permits / professional fees"
                value={inputs.taxes}
                onChange={(v) => update("taxes", v)}
              />
              <NumberField
                label="Other operating costs"
                value={inputs.otherCosts}
                onChange={(v) => update("otherCosts", v)}
              />
            </div>
          </section>

          {/* Step 3 */}
          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-7 shadow-[0_1px_2px_rgba(0,3,33,0.04)]">
            <SectionHeader
              step="Step 03"
              title="Timing reality check"
              subtitle="Late collections can make profitable work painful."
              icon={Clock}
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <label className="block">
                <span className="font-label text-[13px] font-semibold tracking-tight text-on-secondary-fixed">
                  Avg. days until revenue is collected
                </span>
                <input
                  type="number"
                  value={inputs.collectionDays || ""}
                  onChange={(e) =>
                    update(
                      "collectionDays",
                      parseInt(e.target.value || "0", 10)
                    )
                  }
                  placeholder="30"
                  className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-on-surface outline-none transition placeholder:text-on-surface-variant/40 hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1 text-[11px] text-on-surface-variant">
                  Example: 15, 30, 45, 60, 90
                </p>
              </label>

              <label className="block">
                <span className="font-label text-[13px] font-semibold tracking-tight text-on-secondary-fixed">
                  How soon do you need the cash?
                </span>
                <select
                  value={inputs.urgency}
                  onChange={(e) =>
                    update("urgency", e.target.value as Urgency)
                  }
                  className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-on-surface outline-none transition hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option>Within 30 days</option>
                  <option>30–60 days</option>
                  <option>60–90 days</option>
                  <option>Just planning</option>
                </select>
              </label>

              <label className="block">
                <span className="font-label text-[13px] font-semibold tracking-tight text-on-secondary-fixed">
                  Existing lender / payment pressure
                </span>
                <select
                  value={inputs.pressure}
                  onChange={(e) =>
                    update("pressure", e.target.value as Pressure)
                  }
                  className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-on-surface outline-none transition hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option>None</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>
          </section>
        </div>

        {/* ---------- Right: sticky results panel ---------- */}
        <div ref={resultsRef} className="lg:sticky lg:top-28 lg:self-start">
          <ResultsPanel results={results} riskColors={riskColors} />
        </div>
      </div>

      {/* ---------- Advisor note ---------- */}
      <div className="border-t border-outline-variant/30 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="hidden h-px w-10 shrink-0 translate-y-4 bg-outline-variant sm:block" />
            <p className="font-headline text-lg md:text-xl italic leading-relaxed text-on-surface-variant">
              This calculator is designed to start the conversation, not replace
              one. If the gap is meaningful, the next step is comparing
              structure, timing, payment schedule, and use of funds —{" "}
              <span className="text-on-secondary-fixed not-italic font-semibold">
                before
              </span>{" "}
              taking the first offer that lands in your inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Results panel ----------

function ResultsPanel({
  results,
  riskColors,
}: {
  results: CalculatorResults;
  riskColors: Record<RiskLevel, { bg: string; text: string; ring: string }>;
}) {
  const hasData = results.totalCashIn > 0 || results.totalCashNeeded > 0;
  const color = riskColors[results.risk];

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_24px_48px_-20px_rgba(0,3,33,0.18)]">
      {/* Top: headline number */}
      <div className="relative overflow-hidden border-b border-outline-variant/30 bg-on-secondary-fixed p-7 text-white">
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-2xl"
        />
        <div className="relative">
          <div className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {results.gap > 0 ? "Suggested funding target" : "Estimated position"}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={results.fundingTarget}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mt-2 font-headline text-5xl font-extrabold tracking-tighter leading-none tabular-nums"
            >
              {results.gap > 0
                ? fmtUSD(results.fundingTarget)
                : results.surplus > 0
                ? "Surplus"
                : fmtUSD(0)}
            </motion.div>
          </AnimatePresence>
          <p className="mt-3 text-sm leading-relaxed text-primary-fixed-dim">
            {hasData
              ? results.meaning
              : "Enter your numbers on the left to see your cash flow gap, suggested funding target, and a planning readiness score."}
          </p>
        </div>
      </div>

      {/* Middle: stat grid */}
      <div className="grid grid-cols-2 divide-x divide-outline-variant/40 border-b border-outline-variant/30">
        <Stat
          label="Cash expected / available"
          value={fmtUSD(results.totalCashIn)}
        />
        <Stat label="Cash needed" value={fmtUSD(results.totalCashNeeded)} />
        <Stat
          label="Estimated gap"
          value={fmtUSD(results.gap)}
          tone={results.gap > 0 ? "down" : "neutral"}
        />
        <Stat
          label="Cushion surplus"
          value={fmtUSD(results.surplus)}
          tone={results.surplus > 0 ? "up" : "neutral"}
        />
      </div>

      {/* Readiness score */}
      <div className="border-b border-outline-variant/30 p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-label text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            <Gauge className="h-3.5 w-3.5" />
            Funding readiness score
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ${color.bg} ${color.text} ${color.ring}`}
          >
            {results.risk} risk
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-headline text-4xl font-extrabold tracking-tight text-on-secondary-fixed tabular-nums">
            {results.readinessScore}
          </span>
          <span className="text-sm text-on-surface-variant">/ 100</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${results.readinessScore}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`h-full rounded-full ${
              results.readinessScore >= 85
                ? "bg-primary"
                : results.readinessScore >= 70
                ? "bg-amber-400"
                : results.readinessScore >= 50
                ? "bg-orange-400"
                : "bg-rose-500"
            }`}
          />
        </div>
        <p className="mt-3 text-[11px] leading-snug text-on-surface-variant">
          A planning score, not an approval. Use it to decide whether the
          conversation is &ldquo;if&rdquo; or &ldquo;how.&rdquo;
        </p>
      </div>

      {/* CTA */}
      <div className="p-7">
        <motion.a
          href={APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-between gap-3 rounded-lg bg-on-secondary-fixed px-5 py-4 text-primary-fixed"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 18px 32px -14px rgba(0, 3, 33, 0.45)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <span className="text-left">
            <span className="block text-sm font-bold">Get Pre-Qualified</span>
            <span className="block text-xs text-primary-fixed-dim">
              Match the gap to the right capital structure
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-0.5" />
        </motion.a>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant">
          <CheckCircle2 className="h-3 w-3 text-primary" />
          No obligation · Honest read of your numbers
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
}) {
  return (
    <div className="p-5">
      <div className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
        {label}
      </div>
      <div
        className={`mt-1.5 font-headline text-xl font-extrabold tracking-tight tabular-nums ${
          tone === "down"
            ? "text-rose-700"
            : tone === "up"
            ? "text-primary"
            : "text-on-secondary-fixed"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
