// Transactional email sender — server-only. SMTP creds in .env (Mailgun).

import nodemailer, { type Transporter } from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = (process.env.SMTP_USER || '').split('#')[0].trim();
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'info@creditbanc.net';
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Credit Banc';
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://creditbanc.io';

let transporter: Transporter | null = null;
let verifiedOnce = false;

function mask(s: string): string {
  if (!s) return '(empty)';
  if (s.length <= 6) return '***';
  return `${s.slice(0, 3)}…${s.slice(-3)} (len=${s.length})`;
}

export function describeSmtpConfig(): Record<string, string | number | boolean> {
  return {
    host: SMTP_HOST || '(empty)',
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    user: SMTP_USER || '(empty)',
    pass: mask(SMTP_PASS),
    fromName: SMTP_FROM_NAME,
    fromEmail: SMTP_FROM_EMAIL,
  };
}

function getTransporter(): Transporter {
  if (transporter) return transporter;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('[email] SMTP credentials missing', describeSmtpConfig());
    throw new Error('SMTP credentials missing — set SMTP_HOST/USER/PASS');
  }
  console.log('[email] Creating SMTP transporter', describeSmtpConfig());
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    logger: true,
    debug: true,
  });
  return transporter;
}

export async function verifyTransporter(): Promise<{
  ok: boolean;
  error?: string;
  config: Record<string, string | number | boolean>;
}> {
  try {
    const tx = getTransporter();
    await tx.verify();
    console.log('[email] transporter.verify() OK');
    verifiedOnce = true;
    return { ok: true, config: describeSmtpConfig() };
  } catch (err) {
    console.error('[email] transporter.verify() failed:', err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      config: describeSmtpConfig(),
    };
  }
}

export interface CashflowResultEmailInput {
  firstName: string;
  email: string;
  businessName?: string;
  results: {
    gap?: string | number;
    surplus?: string | number;
    target?: string | number;
    totalCashIn?: string | number;
    totalCashNeeded?: string | number;
    risk?: string;
    score?: string | number;
  };
}

function toNum(value: string | number | undefined): number {
  if (value === undefined || value === null || value === '') return 0;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function fmtUSD(value: string | number | undefined): string {
  const n = toNum(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtScore(value: string | number | undefined): string {
  if (value === undefined || value === null || value === '') return '— / 100';
  return `${value} / 100`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHtml(input: CashflowResultEmailInput): string {
  const { firstName, results } = input;
  const safeName = escape(firstName);
  const targetN = toNum(results.target);
  const surplusN = toNum(results.surplus);
  const isSurplusMode = targetN <= 0 && surplusN > 0;

  const heroLabel = isSurplusMode ? 'Estimated surplus' : 'Funding target';
  const heroValue = isSurplusMode
    ? fmtUSD(surplusN)
    : fmtUSD(targetN > 0 ? targetN : 0);
  const heroSubcopy = isSurplusMode
    ? 'Look at you, financially hydrated. You may not need outside capital right now — but keep an eye on slow-paying customers and upcoming costs.'
    : 'Working capital amount most likely to cover the gap without overborrowing.';

  const cashIn = fmtUSD(results.totalCashIn);
  const cashNeeded = fmtUSD(results.totalCashNeeded);
  const gap = fmtUSD(results.gap);
  const surplus = fmtUSD(results.surplus);
  const risk = results.risk ? escape(results.risk) : '—';
  const score = fmtScore(results.score);
  const thirdCardLabel = isSurplusMode ? 'Cushion surplus' : 'Estimated gap';
  const thirdCardValue = isSurplusMode ? surplus : gap;

  const applyUrl = `${SITE_ORIGIN}/apply-now?firstName=${encodeURIComponent(
    firstName
  )}&email=${encodeURIComponent(input.email)}`;

  // Inline styles — email clients are merciless about stylesheets.
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Your cash-flow gap report</title>
</head>
<body style="margin:0;padding:0;background:#f3f1ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#202536;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${safeName}, here&rsquo;s what your numbers say about your funding fit.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ec;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 16px 36px -20px rgba(0,3,33,0.18);">
          <tr>
            <td style="background:#202536;padding:28px 32px;">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#55cf9e;">Credit Banc</div>
              <div style="font-size:14px;color:#cfd0d4;margin-top:4px;">Cash-Flow Gap Report</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 8px;">
              <h1 style="margin:0 0 12px;font-size:28px;line-height:1.15;font-weight:800;letter-spacing:-0.02em;color:#202536;">
                ${safeName}, the calculator has spoken.
              </h1>
              <p style="margin:0;font-size:15px;line-height:1.55;color:#4b4f5c;">
                We&rsquo;ll spare you the lender tap dance. Here&rsquo;s what the numbers may suggest and what might be worth reviewing next.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5df;border-radius:14px;background:#f8f7f3;">
                <tr>
                  <td style="padding:22px 24px;">
                    <div style="font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#55cf9e;">${heroLabel}</div>
                    <div style="font-size:38px;line-height:1;font-weight:800;color:#202536;letter-spacing:-0.02em;margin-top:8px;">${heroValue}</div>
                    <div style="font-size:13px;color:#4b4f5c;margin-top:8px;">${heroSubcopy}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" valign="top" style="padding:10px 6px 10px 0;">
                    <div style="border:1px solid #e7e5df;border-radius:12px;padding:14px 14px;background:#ffffff;">
                      <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#939598;">Cash expected</div>
                      <div style="font-size:20px;font-weight:800;color:#202536;margin-top:6px;letter-spacing:-0.01em;">${cashIn}</div>
                    </div>
                  </td>
                  <td width="33%" valign="top" style="padding:10px 6px;">
                    <div style="border:1px solid #e7e5df;border-radius:12px;padding:14px 14px;background:#ffffff;">
                      <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#939598;">Cash needed</div>
                      <div style="font-size:20px;font-weight:800;color:#202536;margin-top:6px;letter-spacing:-0.01em;">${cashNeeded}</div>
                    </div>
                  </td>
                  <td width="33%" valign="top" style="padding:10px 0 10px 6px;">
                    <div style="border:1px solid #e7e5df;border-radius:12px;padding:14px 14px;background:#ffffff;">
                      <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#939598;">${thirdCardLabel}</div>
                      <div style="font-size:20px;font-weight:800;color:${isSurplusMode ? '#55cf9e' : '#202536'};margin-top:6px;letter-spacing:-0.01em;">${thirdCardValue}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 32px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 8px 0 0;">
                    <span style="display:inline-block;background:#eaf9f1;color:#1d6c4a;border:1px solid #c8ecd9;border-radius:999px;padding:6px 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${risk} risk</span>
                  </td>
                  <td>
                    <span style="display:inline-block;background:#ffffff;color:#202536;border:1px solid #e7e5df;border-radius:999px;padding:6px 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Readiness ${score}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <h2 style="margin:0 0 8px;font-size:18px;font-weight:800;color:#202536;">So, what happens now?</h2>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#4b4f5c;">
                Need funding now? Planning ahead? Just trying to avoid future financial nonsense? Good. That&rsquo;s the point.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#4b4f5c;">
                When you&rsquo;re ready, fill out the quick prequalification form and book a call. It takes less than 2 minutes. An Advisor will help you look at what may be available, what may fit, and whether capital makes sense now, later, or as backup.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 32px 32px;">
              <a href="${applyUrl}" style="display:inline-block;background:#55cf9e;color:#202536;text-decoration:none;font-weight:800;font-size:15px;letter-spacing:0.01em;padding:14px 28px;border-radius:10px;">
                Let&rsquo;s Talk Funding
              </a>
              <div style="font-size:12px;color:#939598;margin-top:14px;">No pitch deck. No script. We promise.</div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#f8f7f3;border-top:1px solid #ece9e2;">
              <p style="margin:0;font-size:12px;line-height:1.55;color:#76798a;">
                You&rsquo;re getting this because you used the Credit Banc cash-flow gap calculator. If that&rsquo;s news to you, ignore this and we&rsquo;ll go bother someone else.
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#a3a5ad;">Credit Banc &middot; ${SITE_ORIGIN.replace(/^https?:\/\//, '')}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderText(input: CashflowResultEmailInput): string {
  const { firstName, results } = input;
  const targetN = toNum(results.target);
  const surplusN = toNum(results.surplus);
  const isSurplusMode = targetN <= 0 && surplusN > 0;
  const heroLabel = isSurplusMode ? 'Estimated surplus' : 'Funding target';
  const heroValue = isSurplusMode
    ? fmtUSD(surplusN)
    : fmtUSD(targetN > 0 ? targetN : 0);
  const cashIn = fmtUSD(results.totalCashIn);
  const cashNeeded = fmtUSD(results.totalCashNeeded);
  const gap = fmtUSD(results.gap);
  const surplus = fmtUSD(results.surplus);
  const risk = results.risk || '—';
  const score = fmtScore(results.score);
  const applyUrl = `${SITE_ORIGIN}/apply-now?firstName=${encodeURIComponent(
    firstName
  )}&email=${encodeURIComponent(input.email)}`;
  return [
    `${firstName}, the calculator has spoken.`,
    '',
    "We'll spare you the lender tap dance. Here's what the numbers may suggest and what might be worth reviewing next.",
    '',
    'Cash-Flow Gap Report — Credit Banc',
    '',
    `${heroLabel}: ${heroValue}`,
    `Cash expected: ${cashIn}`,
    `Cash needed: ${cashNeeded}`,
    isSurplusMode ? `Cushion surplus: ${surplus}` : `Estimated gap: ${gap}`,
    `Risk: ${risk}`,
    `Readiness: ${score}`,
    '',
    'So, what happens now?',
    "Need funding now? Planning ahead? Just trying to avoid future financial nonsense? Good. That's the point.",
    '',
    "When you're ready, fill out the quick prequalification form and book a call. It takes less than 2 minutes. An Advisor will help you look at what may be available, what may fit, and whether capital makes sense now, later, or as backup.",
    '',
    "Let's Talk Funding:",
    applyUrl,
    '',
    'No pitch deck. No script. We promise.',
    '',
    '— Credit Banc',
  ].join('\n');
}

export async function sendCashflowResultEmail(
  input: CashflowResultEmailInput
): Promise<void> {
  const tx = getTransporter();

  // Verify creds on first call so auth failures surface clearly in the log
  // instead of buried inside the sendMail error.
  if (!verifiedOnce) {
    console.log('[email] Verifying SMTP connection before first send...');
    try {
      await tx.verify();
      verifiedOnce = true;
      console.log('[email] SMTP verify OK');
    } catch (verifyErr) {
      console.error('[email] SMTP verify FAILED:', verifyErr);
      throw verifyErr;
    }
  }

  console.log(
    `[email] sendMail → to=${input.email} from="${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`
  );
  const info = await tx.sendMail({
    from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
    to: input.email,
    subject: `${input.firstName}, your cash-flow gap report is ready`,
    text: renderText(input),
    html: renderHtml(input),
  });
  console.log('[email] sendMail OK', {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  });
}
