import Link from 'next/link'
import { Logo } from '@inkprint/ui'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-6 max-w-6xl mx-auto w-full">
        <Link href="/" aria-label="Inkprint home">
          <Logo className="h-7" />
        </Link>
      </header>
      {children}
    </div>
  )
}
