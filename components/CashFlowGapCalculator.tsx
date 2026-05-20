"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  Clock,
  Gauge,
  Phone,
  Check,
  Lock,
  Sparkles,
  Pencil,
} from "lucide-react";
import { SITE } from "@/lib/site";

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

  let meaning =
    "Nothing is on fire. Lovely. There’s no obvious short-term funding gap right now, but keep an eye on timing, bills, and receivables before borrowing money your business may not need.";
  if (gap > 0 && gapPct < 15) {
    meaning =
      "A little tight, not a five-alarm funding fire. A line of credit or bridge option may help, but a heavy MCA is probably overkill.";
  } else if (gap > 0 && gapPct < 40) {
    meaning =
      "This deserves a closer look. Compare the timing, payments, and actual cost before a “quick approval” starts looking a little too friendly.";
  } else if (gap > 0) {
    meaning =
      "This is not the time to wing it. When the gap gets this big, the money matters, but the payments matter more. Talk to an Advisor before signing something that wrecks the next six months.";
  } else if (surplus > 0 && inputs.cashOnHand >= inputs.cushion) {
    meaning =
      "Look at you, financially hydrated. You may not need outside capital right now, but keep an eye on upcoming costs, slow-paying customers, and anything that could shrink the cushion faster than expected.";
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

interface ApplyHandoffData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  gap?: number;
  target?: number;
  risk?: string;
  score?: number;
}

function buildApplyUrl(data: ApplyHandoffData = {}): string {
  const params = new URLSearchParams({
    utm_source: "cashflow_gap_tool",
    utm_medium: "web",
    utm_campaign: "cashflow_gap",
  });
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    const str = String(value).trim();
    if (!str || str === "0") continue;
    params.set(key, str);
  }
  return `/apply-now?${params.toString()}`;
}

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

// ---------- Lead-capture input (dark hero card) ----------

interface LeadInputProps {
  type: "text" | "email" | "tel";
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}

function LeadInput({
  type,
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
}: LeadInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      required={required}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 hover:border-white/25 focus:border-primary focus:ring-2 focus:ring-primary/25"
    />
  );
}

// ---------- Section header ----------

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
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
        <h3 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-secondary-fixed leading-tight">
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

type StepNum = 1 | 2 | 3;

const stepVariants = {
  enter: (d: number) => ({ opacity: 0, x: 24 * d }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: -24 * d }),
};

const STEPS: Array<{
  num: StepNum;
  label: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    num: 1,
    label: "Cash in",
    title: "Cash on hand + money expected in",
    subtitle: "Only count what you reasonably expect to collect.",
    icon: DollarSign,
  },
  {
    num: 2,
    label: "Cash out",
    title: "Cash needed before revenue catches up",
    subtitle: "Everything that must be paid in the same window.",
    icon: TrendingDown,
  },
  {
    num: 3,
    label: "Timing",
    title: "Timing reality check",
    subtitle: "Late collections can make profitable work painful.",
    icon: Clock,
  },
];

export default function CashFlowGapCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const resultsRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const [lead, setLead] = useState({ firstName: "", email: "", phone: "" });
  const [step, setStep] = useState<StepNum>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [revealed, setRevealed] = useState(false);
  const [maxStepReached, setMaxStepReached] = useState<StepNum>(1);
  const revealRef = useRef<HTMLDivElement>(null);
  const [showLeadGate, setShowLeadGate] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const goToStep = (next: StepNum) => {
    if (next === step) return;
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setMaxStepReached((prev) => (next > prev ? next : prev));
    // Keep the active step in view on small viewports without yanking the page.
    if (typeof window !== "undefined" && formCardRef.current) {
      const rect = formCardRef.current.getBoundingClientRect();
      if (rect.top < 80 || rect.top > window.innerHeight * 0.4) {
        window.scrollTo({
          top: window.scrollY + rect.top - 100,
          behavior: "smooth",
        });
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) goToStep((step - 1) as StepNum);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "lead_submit",
        source: "cashflow_gap_hero",
        ...lead,
      });
      // Funnel into the apply-now page with prefilled contact info.
      window.location.href = buildApplyUrl({
        firstName: lead.firstName,
        email: lead.email,
        phone: lead.phone,
      });
    }
  };

  const results = useMemo(() => calculate(inputs), [inputs]);

  const goToBooking = () => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: "calculator_complete",
      source: "cashflow_gap_tool",
      gap: results.gap,
      target: results.fundingTarget,
      risk: results.risk,
      score: results.readinessScore,
    });
    window.location.href = buildApplyUrl({
      firstName: lead.firstName,
      email: lead.email,
      phone: lead.phone,
      businessName: inputs.businessName,
      gap: results.gap,
      target: results.fundingTarget,
      risk: results.risk,
      score: results.readinessScore,
    });
  };

  const doReveal = () => {
    setRevealed(true);
    if (typeof window !== "undefined") {
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: "calculator_revealed",
        source: "cashflow_gap_tool",
        gap: results.gap,
        target: results.fundingTarget,
        risk: results.risk,
        score: results.readinessScore,
      });
      // Scroll the reveal into view shortly after state updates.
      setTimeout(() => {
        revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const reveal = () => {
    // Gate the results behind contact capture. If the user already entered
    // their info (e.g. via the hero "Skip ahead" form), skip the modal.
    if (lead.firstName && lead.email && lead.phone) {
      doReveal();
      return;
    }
    setShowLeadGate(true);
  };

  const handleLeadGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadSubmitting) return;
    setLeadError(null);
    setLeadSubmitting(true);
    try {
      const res = await fetch("/api/cash-flow-gap-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: lead.firstName,
          email: lead.email,
          phone: lead.phone,
          businessName: inputs.businessName || undefined,
          gap: results.gap || undefined,
          target: results.fundingTarget || undefined,
          risk: results.risk,
          score: results.readinessScore,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error || "We couldn’t save your info. Please try again."
        );
      }
      if (typeof window !== "undefined") {
        const w = window as unknown as { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
          event: "lead_submit",
          source: "cashflow_gap_results_gate",
          ...lead,
        });
      }
      setShowLeadGate(false);
      doReveal();
    } catch (err) {
      setLeadError(
        err instanceof Error
          ? err.message
          : "We couldn’t save your info. Please try again."
      );
    } finally {
      setLeadSubmitting(false);
    }
  };

  const editNumbers = () => {
    setRevealed(false);
    setStep(3);
    setTimeout(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleNext = () => {
    if (step < 3) {
      goToStep((step + 1) as StepNum);
    } else {
      reveal();
    }
  };

  // Step completion signals (have they entered data, or at least visited?)
  const step1HasData =
    inputs.cashOnHand > 0 ||
    inputs.cushion > 0 ||
    inputs.ar30 > 0 ||
    inputs.ar60 > 0 ||
    inputs.ar90 > 0 ||
    inputs.otherCashIn > 0;
  const step2HasData =
    inputs.payroll > 0 ||
    inputs.inventory > 0 ||
    inputs.equipment > 0 ||
    inputs.marketing > 0 ||
    inputs.overhead > 0 ||
    inputs.debt > 0 ||
    inputs.taxes > 0 ||
    inputs.otherCosts > 0;
  const step3HasData = maxStepReached >= 3;

  const update = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setInputs(defaultInputs);
    setStep(1);
    setMaxStepReached(1);
    setRevealed(false);
  };

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
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 pt-16 sm:pt-20 md:pt-24 pb-20 sm:pb-24 md:pb-28">
        <motion.div
          aria-hidden
          className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto">
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
            className="font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[0.95] mb-6"
          >
            Find the{" "}
            <motion.span
              className="text-primary inline-block origin-bottom-left"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: [-8, 5, -3, 1, 0],
              }}
              transition={{
                opacity: { delay: 0.7, duration: 0.35 },
                scale: {
                  delay: 0.7,
                  duration: 0.55,
                  type: "spring",
                  stiffness: 320,
                  damping: 14,
                },
                rotate: {
                  delay: 0.7,
                  duration: 0.85,
                  times: [0, 0.3, 0.6, 0.85, 1],
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              Gap.
            </motion.span>{" "}
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
            className="text-base md:text-lg text-white/85 max-w-2xl leading-relaxed"
          >
            You can be booked, busy, and still short on cash. Use the
            calculator to find the gap before it starts calling the shots.
          </motion.p>
        </div>
      </section>

      {/* ---------- Form + Results ---------- */}
      <div
        className={`max-w-7xl mx-auto grid gap-8 px-6 sm:px-8 py-12 sm:py-16 ${
          revealed ? "" : "lg:grid-cols-[1fr_400px]"
        }`}
      >
        <div className={`space-y-10 ${revealed ? "hidden" : ""}`}>
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

          {/* Stepper form card */}
          <section
            ref={formCardRef}
            className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_1px_2px_rgba(0,3,33,0.04)] overflow-hidden"
          >
            <StepperBar step={step} onJump={goToStep} />

            <div className="relative px-6 sm:px-8 py-7 sm:py-8 min-h-[440px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SectionHeader
                    title={STEPS[step - 1].title}
                    subtitle={STEPS[step - 1].subtitle}
                    icon={STEPS[step - 1].icon}
                  />

                  {step === 1 && (
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
                  )}

                  {step === 2 && (
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
                  )}

                  {step === 3 && (
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
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step nav */}
            <div className="border-t border-outline-variant/30 bg-surface-container-low/60 px-6 sm:px-8 py-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-secondary-fixed disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <motion.button
                type="button"
                onClick={handleNext}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold ${
                  step === 3
                    ? "bg-primary text-on-secondary-fixed"
                    : "bg-on-secondary-fixed text-white"
                }`}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    step === 3
                      ? "0 18px 32px -10px rgba(85, 207, 158, 0.55)"
                      : "0 14px 28px -10px rgba(0, 3, 33, 0.45)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                {step === 3 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Reveal my results
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </section>
        </div>

        {/* ---------- Right: teaser sidebar (pre-reveal) ---------- */}
        {!revealed && (
          <div
            ref={resultsRef}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <TeaserPanel
              step={step}
              totalCashIn={results.totalCashIn}
              totalCashNeeded={results.totalCashNeeded}
              step1HasData={step1HasData}
              step2HasData={step2HasData}
              step3HasData={step3HasData}
              canReveal={maxStepReached >= 3}
            />
          </div>
        )}

        {/* ---------- Full-width reveal (post-reveal) ---------- */}
        {revealed && (
          <div ref={revealRef}>
            <RevealedResults
              results={results}
              inputs={inputs}
              riskColors={riskColors}
              applyUrl={buildApplyUrl({
                firstName: lead.firstName,
                email: lead.email,
                phone: lead.phone,
                businessName: inputs.businessName,
                gap: results.gap,
                target: results.fundingTarget,
                risk: results.risk,
                score: results.readinessScore,
              })}
              onEdit={editNumbers}
              onReset={reset}
            />
          </div>
        )}
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

      {/* ---------- Skip ahead lead capture (moved out of hero) ---------- */}
      <section className="relative overflow-hidden bg-on-secondary-fixed px-6 sm:px-8 py-16 sm:py-20 md:py-24">
        <motion.div
          aria-hidden
          className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-xl mx-auto"
        >
          <div
            aria-hidden
            className="absolute -inset-4 bg-primary/10 rounded-[28px] blur-2xl"
          />
          <div className="relative rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl p-7 sm:p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] overflow-hidden">
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />

            <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-2">
              Talk to a real human
            </p>
            <h3 className="font-headline text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight leading-tight">
              Skip ahead. Book the call.
            </h3>
            <p className="text-white/65 text-sm leading-relaxed mb-6">
              Drop your info and we&rsquo;ll book a 15-min call. No pitch
              deck, no script — just an honest read on your numbers.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-3">
              <LeadInput
                type="text"
                placeholder="First name"
                value={lead.firstName}
                autoComplete="given-name"
                required
                onChange={(v) => setLead({ ...lead, firstName: v })}
              />
              <LeadInput
                type="email"
                placeholder="Work email"
                value={lead.email}
                autoComplete="email"
                required
                onChange={(v) => setLead({ ...lead, email: v })}
              />
              <LeadInput
                type="tel"
                placeholder="Phone (optional)"
                value={lead.phone}
                autoComplete="tel"
                onChange={(v) => setLead({ ...lead, phone: v })}
              />

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 36px -12px rgba(85, 207, 158, 0.55)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 360,
                  damping: 22,
                }}
                className="w-full bg-primary text-on-secondary-fixed font-bold text-sm py-3.5 rounded-lg flex items-center justify-center gap-2 group"
              >
                Book My 15-Min Call
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </motion.button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/45">
              <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
              No spam · Response within a business day
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-white/50">
              <Phone className="h-3.5 w-3.5 text-primary" />
              Prefer to talk now?{" "}
              <a
                href={SITE.phoneTel}
                className="text-primary font-bold hover:underline"
              >
                {SITE.phone}
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------- Lead-gate modal (shown when user requests results) ---------- */}
      <AnimatePresence>
        {showLeadGate && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-gate-title"
          >
            <motion.button
              type="button"
              aria-label="Close"
              onClick={() => setShowLeadGate(false)}
              className="absolute inset-0 bg-on-secondary-fixed/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/12 bg-on-secondary-fixed p-7 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
              />
              <div
                aria-hidden
                className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none"
              />

              <button
                type="button"
                onClick={() => setShowLeadGate(false)}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span aria-hidden className="text-xl leading-none">×</span>
              </button>

              <div className="relative">
                <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-2">
                  One quick step
                </p>
                <h3
                  id="lead-gate-title"
                  className="font-headline text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight leading-tight"
                >
                  Where should we send your results?
                </h3>
                <p className="text-white/65 text-sm leading-relaxed mb-6">
                  Drop your info so we can save your snapshot and keep the
                  conversation going if you want a real advisor to weigh in.
                </p>

                <form onSubmit={handleLeadGateSubmit} className="space-y-3">
                  <LeadInput
                    type="text"
                    placeholder="First name"
                    value={lead.firstName}
                    autoComplete="given-name"
                    required
                    onChange={(v) => setLead({ ...lead, firstName: v })}
                  />
                  <LeadInput
                    type="email"
                    placeholder="Email"
                    value={lead.email}
                    autoComplete="email"
                    required
                    onChange={(v) => setLead({ ...lead, email: v })}
                  />
                  <LeadInput
                    type="tel"
                    placeholder="Phone"
                    value={lead.phone}
                    autoComplete="tel"
                    required
                    onChange={(v) => setLead({ ...lead, phone: v })}
                  />

                  <motion.button
                    type="submit"
                    disabled={leadSubmitting}
                    whileHover={
                      leadSubmitting
                        ? undefined
                        : {
                            scale: 1.02,
                            boxShadow:
                              "0 20px 36px -12px rgba(85, 207, 158, 0.55)",
                          }
                    }
                    whileTap={leadSubmitting ? undefined : { scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 360,
                      damping: 22,
                    }}
                    className="w-full bg-primary text-on-secondary-fixed font-bold text-sm py-3.5 rounded-lg flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {leadSubmitting ? (
                      <>Saving…</>
                    ) : (
                      <>
                        See My Results
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </>
                    )}
                  </motion.button>

                  {leadError && (
                    <p
                      role="alert"
                      className="text-rose-400 text-xs leading-snug text-center"
                    >
                      {leadError}
                    </p>
                  )}
                </form>

                <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/50">
                  <Lock className="h-3 w-3 text-primary shrink-0" />
                  Your info stays with us. No spam.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Pre-reveal teaser sidebar ----------

function TeaserPanel({
  step,
  totalCashIn,
  totalCashNeeded,
  step1HasData,
  step2HasData,
  step3HasData,
  canReveal,
}: {
  step: StepNum;
  totalCashIn: number;
  totalCashNeeded: number;
  step1HasData: boolean;
  step2HasData: boolean;
  step3HasData: boolean;
  canReveal: boolean;
}) {
  const stepRows: Array<{
    num: StepNum;
    label: string;
    hint: string;
    done: boolean;
    value?: string;
  }> = [
    {
      num: 1,
      label: "Cash in",
      hint: "What's on hand, what's owed, & what's coming in",
      done: step1HasData,
      value: step1HasData ? fmtUSD(totalCashIn) : undefined,
    },
    {
      num: 2,
      label: "Cash out",
      hint: "Bills, payroll, debt…the usual suspects",
      done: step2HasData,
      value: step2HasData ? fmtUSD(totalCashNeeded) : undefined,
    },
    {
      num: 3,
      label: "Timing",
      hint: "How soon the gap could turn into an “oh sh*t” moment",
      done: step3HasData,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_24px_48px_-20px_rgba(0,3,33,0.18)]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-outline-variant/30 bg-on-secondary-fixed p-6 text-white">
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative">
          <div className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
            Building your snapshot
          </div>
          <h3 className="font-headline text-2xl font-extrabold tracking-tight leading-tight">
            The numbers are doing{" "}
            <span className="text-primary">the talking now.</span>
          </h3>
          <p className="mt-3 text-sm font-semibold text-white leading-snug">
            Do you have a cash flow gap? Let&rsquo;s find out.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            In three steps, we&rsquo;ll show whether your cash flow needs
            capital, patience, or a stern talking-to.
          </p>
        </div>
      </div>

      {/* Step rows */}
      <ul className="divide-y divide-outline-variant/30">
        {stepRows.map((row) => {
          const isCurrent = row.num === step;
          return (
            <li
              key={row.num}
              className={`flex items-center gap-3 px-6 py-4 transition ${
                isCurrent ? "bg-primary-container/15" : ""
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold tabular-nums ${
                  row.done
                    ? "bg-primary text-on-secondary-fixed"
                    : isCurrent
                    ? "bg-primary/15 text-primary ring-2 ring-primary/40"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {row.done ? <Check className="h-4 w-4" strokeWidth={3} /> : row.num}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-on-secondary-fixed">
                  {row.label}
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  {row.hint}
                </div>
              </div>
              {row.value ? (
                <span className="font-headline text-sm font-extrabold tabular-nums text-on-secondary-fixed">
                  {row.value}
                </span>
              ) : (
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/60">
                  {isCurrent ? "In progress" : "Pending"}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Locked preview */}
      <div className="relative overflow-hidden border-t border-outline-variant/30 bg-surface-container-low p-6">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(135deg,rgba(85,207,158,0.04)_0%,transparent_60%)]"
        />
        <div className="relative">
          <div className="flex items-center gap-2 font-label text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3">
            <Lock className="h-3.5 w-3.5" />
            Locked until you finish
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LockedStat label="Funding target" />
            <LockedStat label="Readiness score" />
            <LockedStat label="Risk read" />
            <LockedStat label="Recommendation" />
          </div>

          {/* Status row — informational, not the action. The actual reveal
              button lives in the step-nav at the bottom of the form so we
              don't ship two side-by-side CTAs that do the same thing. */}
          <div
            className={`mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold ${
              canReveal
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "bg-surface-container-high text-on-surface-variant/60"
            }`}
          >
            {canReveal ? (
              <>
                <Sparkles className="h-4 w-4" />
                Ready — tap reveal below
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                Finish step {Math.max(1, step)} to unlock
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LockedStat({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest/60 px-3 py-2.5">
      <div className="font-label text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant/60">
        {label}
      </div>
      <div className="mt-1.5 h-3 w-2/3 rounded bg-surface-container-high" />
    </div>
  );
}

// ---------- Revealed results (full takeover) ----------

function RevealedResults({
  results,
  inputs,
  riskColors,
  applyUrl,
  onEdit,
  onReset,
}: {
  results: CalculatorResults;
  inputs: CalculatorInputs;
  riskColors: Record<RiskLevel, { bg: string; text: string; ring: string }>;
  applyUrl: string;
  onEdit: () => void;
  onReset: () => void;
}) {
  const color = riskColors[results.risk];
  const [counted, setCounted] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const target =
      results.gap > 0
        ? results.fundingTarget
        : results.surplus > 0
        ? results.surplus
        : 0;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCounted(Math.round(v)),
    });
    return () => controls.stop();
  }, [results.gap, results.surplus, results.fundingTarget]);

  useEffect(() => {
    const controls = animate(0, results.readinessScore, {
      duration: 1.6,
      delay: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setScore(Math.round(v)),
    });
    return () => controls.stop();
  }, [results.readinessScore]);

  const headlineLabel =
    results.gap > 0
      ? "Suggested funding target"
      : results.surplus > 0
      ? "Estimated surplus"
      : "Estimated position";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl mx-auto"
    >
      {/* Collapsed summary bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6 flex flex-wrap items-center gap-3 sm:gap-5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-5 py-3 text-sm"
      >
        <span className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
          Your inputs
        </span>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-on-secondary-fixed font-semibold">
          <span>
            In{" "}
            <span className="font-headline font-extrabold tabular-nums">
              {fmtUSD(results.totalCashIn)}
            </span>
          </span>
          <span className="text-on-surface-variant">·</span>
          <span>
            Out{" "}
            <span className="font-headline font-extrabold tabular-nums">
              {fmtUSD(results.totalCashNeeded)}
            </span>
          </span>
          <span className="text-on-surface-variant">·</span>
          <span>
            Collection{" "}
            <span className="font-headline font-extrabold tabular-nums">
              {inputs.collectionDays}d
            </span>
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high hover:text-on-secondary-fixed transition"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-md px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high hover:text-on-secondary-fixed transition"
          >
            Start over
          </button>
        </div>
      </motion.div>

      {/* Hero number card */}
      <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-on-secondary-fixed text-white shadow-[0_30px_80px_-30px_rgba(0,3,33,0.6)]">
        <motion.div
          aria-hidden
          className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="relative px-7 sm:px-12 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary mb-3"
          >
            {headlineLabel}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-headline text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter leading-none tabular-nums"
          >
            {results.gap > 0 || results.surplus > 0
              ? fmtUSD(counted)
              : fmtUSD(0)}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed"
          >
            {results.meaning}
          </motion.p>

          {/* Pill row: risk + score */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide ring-1 ${color.bg} ${color.text} ${color.ring}`}
            >
              <Gauge className="h-3.5 w-3.5" />
              {results.risk} risk
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/15">
              Readiness <span className="tabular-nums">{score}</span> / 100
            </span>
          </motion.div>
        </div>
      </div>

      {/* Stat grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
        }}
        className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          {
            label: "Cash expected",
            value: fmtUSD(results.totalCashIn),
            tone: "neutral" as const,
          },
          {
            label: "Cash needed",
            value: fmtUSD(results.totalCashNeeded),
            tone: "neutral" as const,
          },
          {
            label: "Estimated gap",
            value: fmtUSD(results.gap),
            tone: results.gap > 0 ? ("down" as const) : ("neutral" as const),
          },
          {
            label: "Cushion surplus",
            value: fmtUSD(results.surplus),
            tone:
              results.surplus > 0 ? ("up" as const) : ("neutral" as const),
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4"
          >
            <Stat label={s.label} value={s.value} tone={s.tone} />
          </motion.div>
        ))}
      </motion.div>

      {/* Readiness score panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="mt-6 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 sm:p-7"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-label text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            <Gauge className="h-3.5 w-3.5" />
            Funding readiness score
          </div>
          <span className="text-sm text-on-surface-variant tabular-nums">
            {score} / 100
          </span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface-container-high">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${results.readinessScore}%` }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
        <p className="mt-3 text-[12px] leading-snug text-on-surface-variant">
          A planning score, not an approval. Use it to decide whether the
          conversation is &ldquo;if&rdquo; or &ldquo;how.&rdquo;
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="mt-6 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary-container/30 via-surface-container-lowest to-surface-container-lowest p-7 sm:p-10"
      >
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl"
        />
        <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] items-center">
          <div>
            <div className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-2">
              Now what?
            </div>
            <h3 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-on-secondary-fixed leading-tight mb-2">
              Talk it through with an advisor.
            </h3>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-xl">
              15 minutes. We bring your calculator summary so we skip the
              warm-up. No pitch deck, no script &mdash;{" "}
              <em className="text-on-secondary-fixed not-italic font-semibold">
                even if the right answer is &ldquo;don&rsquo;t borrow.&rdquo;
              </em>
            </p>
          </div>
          <motion.a
            href={applyUrl}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-on-secondary-fixed px-7 py-4 text-base font-extrabold shadow-[0_22px_40px_-12px_rgba(85,207,158,0.55)] whitespace-nowrap"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
          >
            Schedule My Call
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </motion.a>
        </div>
        <div className="relative mt-5 flex items-center gap-2 text-[11px] text-on-surface-variant">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          No obligation · Your summary travels with you
        </div>
      </motion.div>

      {/* Secondary actions */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-secondary-fixed font-semibold transition"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit my numbers
        </button>
        <span className="text-on-surface-variant/40">·</span>
        <button
          type="button"
          onClick={onReset}
          className="text-on-surface-variant hover:text-on-secondary-fixed font-semibold transition"
        >
          Start over
        </button>
      </div>
    </motion.div>
  );
}

// ---------- Stepper progress bar ----------

function StepperBar({
  step,
  onJump,
}: {
  step: StepNum;
  onJump: (s: StepNum) => void;
}) {
  return (
    <div className="relative border-b border-outline-variant/30 bg-gradient-to-b from-primary-container/15 to-surface-container-lowest px-6 sm:px-8 pt-6 pb-7">
      <ol className="flex items-start justify-between gap-3">
        {STEPS.map((s, i) => {
          const isCompleted = s.num < step;
          const isActive = s.num === step;
          const isUpcoming = s.num > step;
          const isClickable = isCompleted || isActive;

          return (
            <li
              key={s.num}
              className="flex-1 flex flex-col items-center relative min-w-0"
            >
              {/* Connector line to next node (right side of current node) */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-5 left-[calc(50%+22px)] right-[calc(-50%+22px)] h-0.5 bg-outline-variant/40 overflow-hidden rounded-full"
                >
                  <motion.span
                    className="block h-full bg-primary origin-left"
                    initial={false}
                    animate={{ scaleX: s.num < step ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              )}

              <button
                type="button"
                onClick={isClickable ? () => onJump(s.num) : undefined}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${s.num}: ${s.label}`}
                disabled={!isClickable}
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full font-headline text-sm font-extrabold tabular-nums transition-all ${
                  isActive
                    ? "bg-primary text-on-secondary-fixed ring-4 ring-primary/20 scale-110 shadow-[0_10px_24px_-8px_rgba(85,207,158,0.55)]"
                    : isCompleted
                    ? "bg-primary text-on-secondary-fixed hover:scale-105 cursor-pointer"
                    : "bg-surface-container-high text-on-surface-variant ring-1 ring-outline-variant cursor-not-allowed"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" strokeWidth={3} /> : s.num}
              </button>

              <div className="mt-2 text-center min-w-0 w-full">
                <div
                  className={`font-label text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] truncate ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-on-secondary-fixed"
                      : "text-on-surface-variant/60"
                  }`}
                  aria-hidden={isUpcoming ? true : undefined}
                >
                  {s.label}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
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
