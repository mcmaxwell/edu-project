import type { HTMLAttributes } from 'react'
import { cn } from './cn'

export type HighlightProps = HTMLAttributes<HTMLSpanElement>

export function Highlight({ className, children, ...rest }: HighlightProps) {
  return (
    <span
      className={cn(
        'bg-coral-200/60 underline decoration-coral decoration-wavy decoration-2 underline-offset-4',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
