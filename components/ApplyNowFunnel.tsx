'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Clock,
  MessageSquare,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { SITE } from '@/lib/site';

interface ApplyForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  loanAmount: string;
  fico: string;
  monthlyRevenue: string;
  timeInBusiness: string;
  notes: string;
}

const LOAN_AMOUNTS = [
  'Under $25,000',
  '$25,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $250,000',
  '$250,000 – $500,000',
  '$500,000 – $1,000,000',
  'Over $1,000,000',
];

const FICO_RANGES = [
  'Below 550',
  '550 – 600',
  '600 – 650',
  '650 – 700',
  '700 – 750',
  '750+',
  'Not sure',
];

const MONTHLY_REVENUE = [
  'Under $10,000',
  '$10,000 – $25,000',
  '$25,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $250,000',
  '$250,000+',
];

const TIME_IN_BUSINESS = [
  'Less than 6 months',
  '6 – 12 months',
  '1 – 2 years',
  '2 – 5 years',
  '5+ years',
];

interface DaySlots {
  date: string;
  slots: string[];
}

interface FreeSlotsResponse {
  days: DaySlots[];
  timezone: string;
}

const fmtUSD = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

export default function ApplyNowFunnel() {
  const params = useSearchParams();

  const [form, setForm] = useState<ApplyForm>({
    firstName: params.get('firstName') || '',
    lastName: params.get('lastName') || '',
    email: params.get('email') || '',
    phone: params.get('phone') || '',
    businessName: params.get('businessName') || '',
    loanAmount: '',
    fico: '',
    monthlyRevenue: '',
    timeInBusiness: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);

  // Slot picker state
  const [days, setDays] = useState<DaySlots[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const timezone = useMemo(() => {
    if (typeof Intl === 'undefined') return 'America/New_York';
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
  }, []);

  const fromCalc = {
    gap: params.get('gap'),
    target: params.get('target'),
    risk: params.get('risk'),
    score: params.get('score'),
  };
  const hasCalcData = !!(fromCalc.gap || fromCalc.target);

  const updateField = <K extends keyof ApplyForm>(
    key: K,
    value: ApplyForm[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const loadSlots = useCallback(async () => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const startDate = Date.now();
      const endDate = startDate + 14 * 24 * 60 * 60 * 1000;
      const qs = new URLSearchParams({
        startDate: String(startDate),
        endDate: String(endDate),
        timezone,
      });
      const res = await fetch(`/api/ghl/free-slots?${qs.toString()}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data && (data as { error?: string }).error) ||
            `Failed to load times (${res.status})`
        );
      }
      const data = (await res.json()) as FreeSlotsResponse;
      const available = (data.days || []).filter((d) => d.slots.length > 0);
      setDays(available);
      if (available.length && !selectedDate) {
        setSelectedDate(available[0].date);
      }
    } catch (e) {
      setSlotsError(e instanceof Error ? e.message : 'Failed to load times');
      setDays([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [timezone, selectedDate]);

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!selectedSlot) {
      setSubmitError('Pick an available time slot to confirm your call.');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);

    if (
      !form.loanAmount ||
      !form.fico ||
      !form.monthlyRevenue ||
      !form.timeInBusiness
    ) {
      setSubmitError('Please answer all qualification questions.');
      return;
    }

    const payload = {
      ...form,
      slot: selectedSlot,
      timezone,
      source: params.get('utm_source') || 'apply-now',
      gap: fromCalc.gap || undefined,
      target: fromCalc.target || undefined,
      risk: fromCalc.risk || undefined,
      score: fromCalc.score || undefined,
    };

    try {
      const res = await fetch('/api/apply-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          (data && (data as { error?: string }).error) ||
          'Something went wrong. Please try again.';
        setSubmitError(msg);
        // If the slot was taken, reload availability so they can pick a new one.
        if (res.status === 409) {
          setSelectedSlot(null);
          loadSlots();
        }
        return;
      }
      if (typeof window !== 'undefined') {
        const w = window as unknown as { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
          event: 'apply_booked',
          source: 'apply_now',
          ...form,
          slot: selectedSlot,
          gap: fromCalc.gap,
          target: fromCalc.target,
          risk: fromCalc.risk,
          score: fromCalc.score,
        });
      }
      setBookedSlot(
        (data as { startTime?: string } | null)?.startTime || selectedSlot
      );
      setSubmitted(true);
    } catch {
      setSubmitError(
        'Could not reach our scheduling service. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentDay = days.find((d) => d.date === selectedDate) || null;

  return (
    <section className="relative overflow-hidden px-6 sm:px-8 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-24 md:pb-28">
      {/* Atmosphere */}
      <motion.div
        aria-hidden
        className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,3,33,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,3,33,0.05) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Hero: value prop + call preview card */}
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
        
          <h1 className="font-headline text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tighter text-on-secondary-fixed leading-[0.95] mb-6">
            {form.firstName ? (
              <>
                Almost there,{' '}
                <span className="relative isolate inline-block px-3 text-on-secondary-fixed">
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-1 left-0 right-0 bg-primary-container rounded-sm z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ originX: 0 }}
                  />
                  <span className="relative z-10">{form.firstName}.</span>
                </span>
              </>
            ) : (
              <>
                Lock in your{' '}
                <span className="relative isolate inline-block px-3 text-on-secondary-fixed">
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-1 left-0 right-0 bg-primary-container rounded-sm z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ originX: 0 }}
                  />
                  <span className="relative z-10">15-min call.</span>
                </span>
              </>
            )}
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl mb-8">
            An advisor will give you a no-pitch read on your numbers in 15
            minutes.{' '}
            {hasCalcData ? (
              <span className="text-primary font-semibold">
                We already have your calculator summary, so we&rsquo;ll skip
                the warm-up.
              </span>
            ) : (
              <em className="text-primary not-italic font-semibold">
                (No pitch deck. No script. We promise.)
              </em>
            )}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl"
          >
            {[
              { stat: '$2B+', label: 'Deployed' },
              { stat: '15k+', label: 'Businesses funded' },
              { stat: '15 min', label: 'Avg. advisor call' },
            ].map((t) => (
              <div
                key={t.label}
                className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3 py-3 sm:px-4 sm:py-3.5"
              >
                <div className="font-headline text-lg sm:text-xl font-extrabold text-primary tracking-tight">
                  {t.stat}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/80 mt-0.5">
                  {t.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-4 bg-primary/8 rounded-[28px] blur-2xl"
            />
            <div className="relative rounded-2xl border border-outline-variant bg-surface-container-lowest backdrop-blur-xl p-7 sm:p-8 shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)] overflow-hidden">
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              />

              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-2">
                    Your call preview
                  </p>
                  <h3 className="font-headline text-xl sm:text-2xl font-extrabold text-on-secondary-fixed tracking-tight leading-tight">
                    15-min, focused.
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary ring-1 ring-primary/30 whitespace-nowrap">
                  <Clock className="h-3 w-3" />
                  Live calendar
                </span>
              </div>

              <p className="text-on-surface-variant text-sm leading-relaxed mb-5">
                What we cover before your time&rsquo;s up:
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  {
                    minutes: '10 min',
                    label: 'Your cash flow numbers',
                    body: 'We walk your real burn, receivables, and pressure.',
                  },
                  {
                    minutes: '3 min',
                    label: 'Right funding structure',
                    body: 'LOC, bridge, SBA, or nothing — we say which fits.',
                  },
                  {
                    minutes: '2 min',
                    label: 'Honest yes / no / wait',
                    body: 'Even if the answer is "don’t borrow right now."',
                  },
                ].map((row) => (
                  <li key={row.label} className="flex gap-3">
                    <div className="shrink-0 w-14 text-right">
                      <span className="font-headline text-xs font-extrabold tabular-nums text-primary tracking-tight">
                        {row.minutes}
                      </span>
                    </div>
                    <div className="min-w-0 border-l border-outline-variant/40 pl-3">
                      <div className="text-sm font-bold text-on-secondary-fixed leading-snug">
                        {row.label}
                      </div>
                      <div className="text-[12px] text-on-surface-variant/80 leading-snug mt-0.5">
                        {row.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['#55cf9e', '#3a9b72', '#7adcb1'].map((c, i) => (
                    <span
                      key={i}
                      className="h-7 w-7 rounded-full ring-2 ring-surface-container-lowest"
                      style={{ background: c }}
                      aria-hidden
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-on-secondary-fixed">
                    Real advisor, not a chatbot.
                  </div>
                  <div className="text-[11px] text-on-surface-variant/70 leading-snug">
                    Avg. response time &lt; 1 business day.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2-col layout: form (left) + summary/trust (right) */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-4 bg-primary/8 rounded-[28px] blur-2xl"
            />
            <div className="relative rounded-2xl border border-outline-variant bg-surface-container-lowest backdrop-blur-xl p-7 sm:p-10 shadow-[0_24px_60px_-25px_rgba(0,3,33,0.18)] overflow-hidden">
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              />

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h2 className="font-headline text-xl sm:text-2xl font-extrabold text-on-secondary-fixed tracking-tight">
                        Your details
                      </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="First name" required>
                        <Input
                          type="text"
                          value={form.firstName}
                          autoComplete="given-name"
                          required
                          onChange={(v) => updateField('firstName', v)}
                          placeholder="Sam"
                        />
                      </FormField>
                      <FormField label="Last name" required>
                        <Input
                          type="text"
                          value={form.lastName}
                          autoComplete="family-name"
                          required
                          onChange={(v) => updateField('lastName', v)}
                          placeholder="Ramirez"
                        />
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Email" required>
                        <Input
                          type="email"
                          value={form.email}
                          autoComplete="email"
                          required
                          onChange={(v) => updateField('email', v)}
                          placeholder="sam@business.com"
                        />
                      </FormField>
                      <FormField label="Phone" required>
                        <Input
                          type="tel"
                          value={form.phone}
                          autoComplete="tel"
                          required
                          onChange={(v) => updateField('phone', v)}
                          placeholder="(555) 555-5555"
                        />
                      </FormField>
                    </div>

                    <FormField label="Business name" required>
                      <Input
                        type="text"
                        value={form.businessName}
                        autoComplete="organization"
                        required
                        onChange={(v) => updateField('businessName', v)}
                        placeholder="Acme Roofing LLC"
                      />
                    </FormField>

                    <div className="pt-2 pb-1 flex items-center gap-3">
                      <div className="h-px flex-1 bg-outline-variant/40" />
                      <span className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                        About your funding need
                      </span>
                      <div className="h-px flex-1 bg-outline-variant/40" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Loan amount requested" required>
                        <SelectField
                          value={form.loanAmount}
                          required
                          onChange={(v) => updateField('loanAmount', v)}
                          placeholder="Amount of funding you need"
                          options={LOAN_AMOUNTS}
                        />
                      </FormField>
                      <FormField label="Estimated FICO score" required>
                        <SelectField
                          value={form.fico}
                          required
                          onChange={(v) => updateField('fico', v)}
                          placeholder="An approximate figure"
                          options={FICO_RANGES}
                        />
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Monthly business revenue" required>
                        <SelectField
                          value={form.monthlyRevenue}
                          required
                          onChange={(v) => updateField('monthlyRevenue', v)}
                          placeholder="Approximate monthly revenue"
                          options={MONTHLY_REVENUE}
                        />
                      </FormField>
                      <FormField label="Time in business" required>
                        <SelectField
                          value={form.timeInBusiness}
                          required
                          onChange={(v) => updateField('timeInBusiness', v)}
                          placeholder="How long you've operated"
                          options={TIME_IN_BUSINESS}
                        />
                      </FormField>
                    </div>

                    <div className="pt-2 pb-1 flex items-center gap-3">
                      <div className="h-px flex-1 bg-outline-variant/40" />
                      <span className="font-label text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                        Schedule the call
                      </span>
                      <div className="h-px flex-1 bg-outline-variant/40" />
                    </div>

                    <SlotPicker
                      days={days}
                      selectedDate={selectedDate}
                      selectedSlot={selectedSlot}
                      timezone={timezone}
                      loading={slotsLoading}
                      error={slotsError}
                      onSelectDate={(d) => {
                        setSelectedDate(d);
                        setSelectedSlot(null);
                      }}
                      onSelectSlot={(s) => {
                        setSelectedSlot(s);
                        setSubmitError(null);
                      }}
                      onRetry={loadSlots}
                      currentDay={currentDay}
                    />

                    <FormField label="Anything we should know? (optional)">
                      <textarea
                        value={form.notes}
                        onChange={(e) => updateField('notes', e.target.value)}
                        placeholder="E.g. 'Need to refi an MCA' or 'Closing on a property in 30 days'"
                        rows={3}
                        className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-sm text-on-secondary-fixed outline-none transition placeholder:text-on-surface-variant/50 hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/25 resize-none"
                      />
                    </FormField>

                    {submitError && (
                      <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={submitting || !selectedSlot}
                      whileHover={
                        submitting || !selectedSlot
                          ? undefined
                          : {
                              scale: 1.02,
                              boxShadow:
                                '0 22px 40px -12px rgba(85,207,158,0.55)',
                            }
                      }
                      whileTap={
                        submitting || !selectedSlot ? undefined : { scale: 0.98 }
                      }
                      transition={{
                        type: 'spring',
                        stiffness: 360,
                        damping: 22,
                      }}
                      className="w-full bg-primary text-on-secondary-fixed font-bold text-base py-4 rounded-lg flex items-center justify-center gap-2 group mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Booking your slot…
                        </>
                      ) : selectedSlot ? (
                        <>
                          Confirm {formatSlotTime(selectedSlot, timezone)}
                          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                        </>
                      ) : (
                        <>
                          Pick a time above
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-xs text-on-surface-variant/60 flex items-center justify-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      Your info stays with us. No spam, no third-party sharing.
                    </p>
                  </motion.form>
                ) : (
                  <SuccessPanel
                    firstName={form.firstName}
                    bookedSlot={bookedSlot}
                    timezone={timezone}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right: summary + trust */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-5"
          >
            {hasCalcData && (
              <div className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-6 relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
                />
                <div className="relative">
                  <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-4">
                    From your calculator
                  </p>
                  <div className="space-y-3">
                    {fromCalc.target && (
                      <SummaryRow
                        label="Suggested funding target"
                        value={fmtUSD(parseFloat(fromCalc.target))}
                        highlight
                      />
                    )}
                    {fromCalc.gap && parseFloat(fromCalc.gap) > 0 && (
                      <SummaryRow
                        label="Estimated cash gap"
                        value={fmtUSD(parseFloat(fromCalc.gap))}
                      />
                    )}
                    {fromCalc.risk && (
                      <SummaryRow
                        label="Risk level"
                        value={`${fromCalc.risk} risk`}
                      />
                    )}
                    {fromCalc.score && (
                      <SummaryRow
                        label="Readiness score"
                        value={`${fromCalc.score} / 100`}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6">
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-4">
                What happens next
              </p>
              <ol className="space-y-4">
                <Step
                  n="1"
                  icon={<Clock className="h-4 w-4" />}
                  title="We reach out within 1 business day"
                  body="No autoresponders. A real advisor reads your details and replies."
                />
                <Step
                  n="2"
                  icon={<Phone className="h-4 w-4" />}
                  title="15-min call at the time you picked"
                  body="On the phone, on Zoom, or by text. Whatever fits your day."
                />
                <Step
                  n="3"
                  icon={<MessageSquare className="h-4 w-4" />}
                  title="Honest read + your real options"
                  body="The right structure for your situation. Even if that means 'don't borrow right now.'"
                />
              </ol>
            </div>

            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 text-center">
              <Phone className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/80 mb-2">
                Need to talk now?
              </p>
              <a
                href={SITE.phoneTel}
                className="text-xl font-extrabold text-on-secondary-fixed hover:text-primary transition-colors tracking-tight"
              >
                {SITE.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- helpers ----------

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant/80 mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}

interface InputProps {
  type: 'text' | 'email' | 'tel';
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

function Input({
  type,
  value,
  onChange,
  required,
  autoComplete,
  placeholder,
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      required={required}
      autoComplete={autoComplete}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-sm text-on-secondary-fixed outline-none transition placeholder:text-on-surface-variant/50 hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/25"
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <select
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-sm outline-none transition hover:border-outline focus:border-primary focus:ring-2 focus:ring-primary/25 ${
        value ? 'text-on-secondary-fixed' : 'text-on-surface-variant/60'
      }`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="text-on-secondary-fixed">
          {opt}
        </option>
      ))}
    </select>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-outline-variant/20 pb-3 last:border-0 last:pb-0">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/80">
        {label}
      </span>
      <span
        className={
          highlight
            ? 'font-headline text-2xl font-extrabold text-primary tabular-nums tracking-tight'
            : 'font-headline text-base font-bold text-on-secondary-fixed tabular-nums'
        }
      >
        {value}
      </span>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <div className="shrink-0 w-9 h-9 rounded-full bg-primary/15 ring-1 ring-primary/30 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">
          Step {n}
        </div>
        <div className="text-sm font-semibold text-on-secondary-fixed leading-snug mb-1">
          {title}
        </div>
        <div className="text-xs text-on-surface-variant/80 leading-relaxed">{body}</div>
      </div>
    </li>
  );
}

function SuccessPanel({
  firstName,
  bookedSlot,
  timezone,
}: {
  firstName: string;
  bookedSlot: string | null;
  timezone: string;
}) {
  const slotDateLabel = bookedSlot ? formatSlotDateLong(bookedSlot, timezone) : null;
  const slotTimeLabel = bookedSlot ? formatSlotTime(bookedSlot, timezone) : null;

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40"
      >
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </motion.div>
      <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-secondary-fixed tracking-tight mb-3">
        You&rsquo;re booked
        {firstName ? `, ${firstName}` : ''}.
      </h2>
      {slotDateLabel && slotTimeLabel ? (
        <div className="mx-auto mb-5 inline-flex flex-col items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 px-5 py-3 text-on-secondary-fixed">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Your 15-min call
          </span>
          <span className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight">
            {slotDateLabel} · {slotTimeLabel}
          </span>
          <span className="text-[11px] text-on-surface-variant/80">
            {formatTimezoneLabel(timezone)}
          </span>
        </div>
      ) : null}
      <p className="text-on-surface-variant text-base leading-relaxed mb-6 max-w-md mx-auto">
        Check your inbox for a confirmation. Your advisor has your calculator
        summary, so we&rsquo;ll skip the warm-up.{' '}
        <em className="text-primary not-italic font-semibold">
          (No pitch deck. We promise.)
        </em>
      </p>
      <a
        href={SITE.phoneTel}
        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
      >
        <Phone className="h-4 w-4" />
        {SITE.phone}
      </a>
    </motion.div>
  );
}

// ---------- Slot picker ----------

function SlotPicker({
  days,
  selectedDate,
  selectedSlot,
  timezone,
  loading,
  error,
  onSelectDate,
  onSelectSlot,
  onRetry,
  currentDay,
}: {
  days: DaySlots[];
  selectedDate: string | null;
  selectedSlot: string | null;
  timezone: string;
  loading: boolean;
  error: string | null;
  onSelectDate: (d: string) => void;
  onSelectSlot: (s: string) => void;
  onRetry: () => void;
  currentDay: DaySlots | null;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant/80">
          Pick a time <span className="text-primary">*</span>
        </span>
        <span className="text-[10px] text-on-surface-variant/50">
          Times shown in {formatTimezoneLabel(timezone)}
        </span>
      </div>

      {loading ? (
        <div className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-4 py-8 text-sm text-on-surface-variant/80 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading available times…
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-4 text-sm text-red-700">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="text-xs font-bold underline hover:text-on-secondary-fixed"
          >
            Try again
          </button>
        </div>
      ) : days.length === 0 ? (
        <div className="rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-4 py-6 text-sm text-on-surface-variant">
          No open slots in the next two weeks. Give us a call at{' '}
          <a
            href={SITE.phoneTel}
            className="text-primary font-bold hover:underline"
          >
            {SITE.phone}
          </a>{' '}
          and we&rsquo;ll get you in.
        </div>
      ) : (
        <>
          <div
            role="tablist"
            aria-label="Pick a day"
            className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x"
            style={{ scrollbarWidth: 'thin' }}
          >
            {days.map((d) => {
              const active = d.date === selectedDate;
              const first = d.slots[0];
              const label = formatDayChip(first || d.date, timezone);
              return (
                <button
                  key={d.date}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectDate(d.date)}
                  className={`shrink-0 snap-start min-w-[78px] rounded-xl border px-3 py-2.5 text-center transition ${
                    active
                      ? 'border-primary bg-primary/15 text-on-secondary-fixed'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline hover:text-on-secondary-fixed'
                  }`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      active ? 'text-primary' : 'text-on-surface-variant/70'
                    }`}
                  >
                    {label.weekday}
                  </div>
                  <div className="font-headline text-lg font-extrabold tracking-tight">
                    {label.day}
                  </div>
                  <div className="text-[10px] text-on-surface-variant/60">{label.month}</div>
                </button>
              );
            })}
          </div>

          {currentDay ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {currentDay.slots.map((iso) => {
                const active = iso === selectedSlot;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => onSelectSlot(iso)}
                    className={`rounded-lg border px-2 py-2.5 text-sm font-semibold tabular-nums transition ${
                      active
                        ? 'border-primary bg-primary text-on-secondary-fixed shadow-[0_8px_24px_-8px_rgba(85,207,158,0.6)]'
                        : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/60 hover:bg-primary/10 hover:text-on-secondary-fixed'
                    }`}
                  >
                    {formatSlotTime(iso, timezone)}
                  </button>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

// ---------- Date/time formatters ----------

function formatSlotTime(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    })
      .format(new Date(iso))
      .replace(' AM', 'a')
      .replace(' PM', 'p');
  } catch {
    return iso;
  }
}

function formatSlotDateLong(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: timezone,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDayChip(
  iso: string,
  timezone: string
): { weekday: string; day: string; month: string } {
  try {
    const d = new Date(iso);
    const weekday = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: timezone,
    }).format(d);
    const day = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      timeZone: timezone,
    }).format(d);
    const month = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      timeZone: timezone,
    }).format(d);
    return { weekday, day, month };
  } catch {
    return { weekday: '', day: iso, month: '' };
  }
}

function formatTimezoneLabel(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date());
    const tz = parts.find((p) => p.type === 'timeZoneName')?.value;
    return tz || timezone;
  } catch {
    return timezone;
  }
}
