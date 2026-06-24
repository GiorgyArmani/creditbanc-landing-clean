import { ImageResponse } from 'next/og';

// Branded 1200×630 share card. File-based metadata: Next auto-wires this as the
// site's og:image (and twitter-image re-exports it), replacing the old SVG logo
// that many scrapers / AI preview cards refuse to render.
export const runtime = 'edge';
export const alt = 'Credit Banc — SBA Loans, Real Estate Financing & Small Business Funding';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #202536 0%, #2a3047 55%, #1f6b4e 100%)',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 18,
              height: 48,
              borderRadius: 6,
              background: '#55cf9e',
            }}
          />
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: -1,
            }}
          >
            Credit Banc
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Credit & capital to grow your business.
          </div>
          <div style={{ fontSize: 30, color: '#c4edda', maxWidth: 920 }}>
            SBA loans, real estate financing, and small business funding — with
            monthly payments and a real Advisor, start to finish.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {['SBA Financing', 'Real Estate', 'Small Business Funding'].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#0c2018',
                  background: '#55cf9e',
                  borderRadius: 999,
                  padding: '10px 26px',
                }}
              >
                {tag}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
