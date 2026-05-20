import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from './cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...rest }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-11 w-full rounded-sm border border-sand bg-paper px-3 py-2 text-body font-sans text-ink placeholder:text-slate transition-colors duration-state',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-0 focus-visible:border-ink',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  ),
)
Input.displayName = 'Input'
