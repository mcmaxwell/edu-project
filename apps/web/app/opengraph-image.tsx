import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Inkprint — See the difference between effort and autocomplete.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F6F1E7',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#6B7280',
            fontFamily: 'sans-serif',
            fontWeight: 600,
          }}
        >
          Inkprint
        </div>
        <div
          style={{
            fontSize: 88,
            lineHeight: 1.05,
            color: '#1B2A4E',
            maxWidth: 980,
          }}
        >
          See the difference between{' '}
          <span style={{ color: '#E26D5A', fontStyle: 'italic' }}>effort</span> and{' '}
          <span style={{ fontStyle: 'italic' }}>autocomplete</span>.
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 24,
            color: '#6B7280',
            fontFamily: 'sans-serif',
          }}
        >
          <span>Evidence for the AI era.</span>
          <span>inkprint.com</span>
        </div>
      </div>
    ),
    size,
  )
}
