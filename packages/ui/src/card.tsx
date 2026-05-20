import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-md border border-sand bg-paper p-6 transition-colors duration-state',
        'hover:border-ink-300',
        className,
      )}
      {...rest}
    />
  ),
)
Card.displayName = 'Card'

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...rest }, ref) => (
    <h3
      ref={ref}
      className={cn('text-h4 font-sans font-semibold text-ink mb-2', className)}
      {...rest}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

export const CardBody = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...rest }, ref) => (
    <p ref={ref} className={cn('text-body text-slate', className)} {...rest} />
  ),
)
CardBody.displayName = 'CardBody'
