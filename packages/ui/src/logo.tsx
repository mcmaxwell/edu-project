import type { ImgHTMLAttributes } from 'react'
import { cn } from './cn'

type Variant = 'primary' | 'inverted'

type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  variant?: Variant
  alt?: string
}

export function Logo({ variant = 'primary', className, alt = 'Inkprint', ...rest }: LogoProps) {
  const src = variant === 'inverted' ? '/brand/logo-inverted.svg' : '/brand/logo.svg'
  return (
    <img
      src={src}
      alt={alt}
      className={cn('h-8 w-auto select-none', className)}
      draggable={false}
      {...rest}
    />
  )
}

export function LogoMark({ className, alt = 'Inkprint', ...rest }: LogoProps) {
  return (
    <img
      src="/brand/logo-mark.svg"
      alt={alt}
      className={cn('h-8 w-8 select-none', className)}
      draggable={false}
      {...rest}
    />
  )
}
