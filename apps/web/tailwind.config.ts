import type { Config } from 'tailwindcss'
import { colors, fontFamily, radii, easings, durations } from '@inkprint/tokens'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        background: colors.parchment,
        foreground: colors.charcoal,
        border: colors.sand,
        ring: colors.ink,
        muted: colors.sand,
        'muted-foreground': colors.slate,
        accent: colors.coral,
        'accent-foreground': colors.paper,
      },
      fontFamily: {
        display: [...fontFamily.display],
        sans: [...fontFamily.sans],
        mono: [...fontFamily.mono],
      },
      borderRadius: {
        sm: radii.sm,
        md: radii.md,
        lg: radii.lg,
      },
      transitionTimingFunction: {
        brand: easings.brand,
      },
      transitionDuration: {
        state: durations.state.replace('ms', ''),
        enter: durations.enter.replace('ms', ''),
        hero: durations.hero.replace('ms', ''),
      },
      fontSize: {
        display: ['60px', { lineHeight: '64px', letterSpacing: '-0.015em' }],
        h1: ['44px', { lineHeight: '52px', letterSpacing: '-0.01em' }],
        h2: ['32px', { lineHeight: '40px' }],
        h3: ['24px', { lineHeight: '32px' }],
        h4: ['20px', { lineHeight: '28px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        body: ['16px', { lineHeight: '26px' }],
        'body-sm': ['14px', { lineHeight: '22px' }],
        eyebrow: ['12px', { lineHeight: '16px', letterSpacing: '0.08em' }],
      },
    },
  },
  plugins: [],
}

export default config
