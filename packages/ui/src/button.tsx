import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm font-sans font-semibold transition-colors duration-state ease-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-parchment hover:bg-ink-700',
        secondary: 'border border-ink text-ink bg-transparent hover:bg-paper',
        tertiary: 'text-ink underline-offset-4 hover:underline px-0',
        coral: 'bg-coral text-paper hover:opacity-90',
      },
      size: {
        sm: 'h-9 px-3 text-body-sm',
        md: 'h-11 px-5 text-body-sm',
        lg: 'h-12 px-6 text-body',
      },
    },
    compoundVariants: [{ variant: 'tertiary', class: 'h-auto px-0' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  ),
)
Button.displayName = 'Button'
