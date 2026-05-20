import type { Metadata } from 'next'
import { fontDisplay, fontSans, fontMono } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Inkprint — See the difference between effort and autocomplete.',
    template: '%s · Inkprint',
  },
  description:
    'Inkprint is a writing-process platform for educators. Evidence for the AI era.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
