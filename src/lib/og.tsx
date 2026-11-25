import { ImageResponse } from 'next/og'

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

export function renderOg(title: string, kicker: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0f6e56',
          color: '#f4f1ea',
          padding: '72px',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Hundredmark</div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ fontSize: 28, color: '#d7ffe9', marginBottom: 18 }}>{kicker}</div>
          <div style={{ fontSize: 64, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ fontSize: 26 }}>Cited formulas · No account · Stays in your browser</div>
      </div>
    ),
    { ...ogSize },
  )
}
