export const colors = {
  ink: '#1B2A4E',
  'ink-700': '#2A3B66',
  'ink-300': '#8C97B5',
  parchment: '#F6F1E7',
  paper: '#FFFFFF',
  coral: '#E26D5A',
  'coral-200': '#F7C9C0',
  slate: '#6B7280',
  moss: '#3F6B4E',
  sand: '#EADFC6',
  charcoal: '#111827',
} as const

export const fontFamily = {
  display: ['"Newsreader"', 'Georgia', 'serif'],
  sans: ['"Inter"', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
} as const

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
} as const

export const easings = {
  brand: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const

export const durations = {
  state: '150ms',
  enter: '250ms',
  hero: '400ms',
} as const

export type Color = keyof typeof colors
