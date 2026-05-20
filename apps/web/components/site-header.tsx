import Link from 'next/link'
import { Logo, Button } from '@inkprint/ui'

const nav = [
  { href: '/product', label: 'Product' },
  { href: '/for-teachers', label: 'For teachers' },
  { href: '/for-institutions', label: 'For institutions' },
  { href: '/research', label: 'Research' },
  { href: '/pricing', label: 'Pricing' },
]

export function SiteHeader() {
  return (
    <header className="border-b border-sand bg-parchment">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" aria-label="Inkprint home">
          <Logo className="h-7" />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-body-sm font-sans text-slate">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-body-sm font-sans font-semibold text-ink hover:text-ink-700"
          >
            Log in
          </Link>
          <Link href="/signup">
            <Button size="sm">Start free pilot</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
