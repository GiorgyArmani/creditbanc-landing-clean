// Server-safe pieces of the GHL course form (no 'use client'), so server
// pages can use them for their Suspense fallback.
export const COURSE_FORMS = {
  original: {
    id: 'AT5ZqbMvaRSJDU0yHWsb',
    name: 'Credit Builder Course - NEW FORM',
    height: 555,
  },
  optIn: {
    id: 'wFKzbMgstCN3eeYgEQPY',
    name: 'Business Credit Builder Course Opt-in',
    // Rendered height reported by GHL's resizer at desktop width.
    height: 722,
  },
} as const;

// Shown while the GHL iframe loads. Also used as the page's Suspense fallback
// so the card holds the same height from first paint to form ready.
export function CourseFormLoading({ height }: { height: number }) {
  return (
    <div
      className="flex w-full items-center justify-center gap-2.5"
      style={{ minHeight: `${height}px` }}
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      <span className="text-sm text-on-surface-variant">
        Loading your form…
      </span>
    </div>
  );
}
