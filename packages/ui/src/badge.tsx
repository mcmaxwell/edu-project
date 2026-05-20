import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-body-sm font-sans font-semibold',
  {
    variants: {
      variant: {
        neutral: 'bg-sand text-ink',
        flagged: 'bg-coral-200 text-coral',
        inconclusive: 'bg-sand text-moss',
        info: 'bg-ink text-parchment',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...rest }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...rest} />
  ),
)
Badge.displayName = 'Badge'

export type FlagPillProps = HTMLAttributes<HTMLSpanElement>

export function FlagPill({ className, children, ...rest }: FlagPillProps) {
  return (
    <Badge variant="flagged" className={className} {...rest}>
      {children}
    </Badge>
  )
}
