// Attribution params (GHL hidden-field query keys like
// `lead_source_(dashboard_control)` and `appointment_source`) arrive on
// whatever page a campaign link points at — usually the landing page — but
// the form that consumes them lives on /apply-now. Internal links don't carry
// the query string, so we stash attribution in sessionStorage on first load
// (see app/providers.tsx) and ApplyNowFunnel falls back to it when the URL
// has no params of its own. sessionStorage scopes this to the tab/visit, so
// attribution never leaks across separate sessions.
const STORAGE_KEY = 'cb-attribution';

function isAttributionKey(key: string) {
  return key.startsWith('lead_source') || key === 'appointment_source';
}

export function captureAttribution() {
  try {
    const incoming = new URLSearchParams(window.location.search);
    const stored = readAttribution();
    let changed = false;
    incoming.forEach((value, key) => {
      if (isAttributionKey(key) && stored[key] !== value) {
        stored[key] = value;
        changed = true;
      }
    });
    if (changed) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // sessionStorage unavailable (strict privacy modes) — attribution simply
    // falls back to the per-page defaults.
  }
}

export function readAttribution(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
