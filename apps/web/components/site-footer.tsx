import Link from 'next/link'
import { LogoMark } from '@inkprint/ui'

const columns = [
  {
    heading: 'Product',
    links: [
      { href: '/product', label: 'Overview' },
      { href: '/for-teachers', label: 'For teachers' },
      { href: '/for-institutions', label: 'For institutions' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/research', label: 'Research' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/legal/privacy', label: 'Privacy' },
      { href: '/legal/terms', label: 'Terms' },
      { href: '/legal/dpa', label: 'Data Processing Agreement' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-ink text-parchment mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <LogoMark className="h-8 w-8 mb-4 invert" />
          <p className="text-body-sm text-parchment/80 max-w-xs">
            Evidence for the AI era. Built for teachers, not against students.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="text-eyebrow font-sans font-semibold uppercase text-parchment/60 mb-4">
              {col.heading}
            </p>
            <ul className="space-y-2 text-body-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-parchment/90 hover:text-parchment transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-parchment/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-body-sm text-parchment/60">
          <span>© {new Date().getFullYear()} Inkprint</span>
          <span className="font-mono">See the difference between effort and autocomplete.</span>
        </div>
      </div>
    </footer>
  )
}
