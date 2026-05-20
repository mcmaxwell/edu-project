import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from './cn'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...rest }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-32 w-full rounded-sm border border-sand bg-paper px-3 py-2 text-body font-sans text-ink placeholder:text-slate transition-colors duration-state',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:border-ink',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  ),
)
Textarea.displayName = 'Textarea'
