import Image from 'next/image'
import { Logo } from '@inkprint/ui'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="px-6 py-6 max-w-6xl mx-auto flex items-center justify-between">
        <Logo className="h-7" />
        <nav className="flex items-center gap-6 text-body-sm font-sans text-slate">
          <a href="/product" className="hover:text-ink transition-colors">
            Product
          </a>
          <a href="/research" className="hover:text-ink transition-colors">
            Research
          </a>
          <a href="/pricing" className="hover:text-ink transition-colors">
            Pricing
          </a>
          <a
            href="/login"
            className="rounded-sm border border-ink text-ink px-4 py-2 font-semibold hover:bg-paper transition-colors"
          >
            Log in
          </a>
        </nav>
      </header>

      <section className="px-6 pt-16 pb-24 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-6">
            Inkprint · Evidence for the AI era
          </p>
          <h1 className="text-display font-display text-ink mb-8">
            See the difference between <em className="italic text-coral">effort</em> and{' '}
            <em className="italic">autocomplete</em>.
          </h1>
          <p className="text-body-lg text-slate mb-10 max-w-xl">
            A writing-process platform for educators. Inkprint captures{' '}
            <em>how</em> work was made — keystrokes, pauses, revisions — and gives teachers
            evidence, not verdicts.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-sm bg-ink text-parchment px-5 py-3 text-body-sm font-sans font-semibold transition-colors duration-state ease-brand hover:bg-ink-700"
            >
              Start a free pilot
            </button>
            <button
              type="button"
              className="rounded-sm border border-ink text-ink px-5 py-3 text-body-sm font-sans font-semibold transition-colors duration-state ease-brand hover:bg-paper"
            >
              Watch the 60-second demo
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-lg overflow-hidden border border-sand bg-paper shadow-sm">
            <Image
              src="/brand/images/01-fountain-pen-on-paper.jpg"
              alt="A fountain pen resting on a written page — authorship and process, the heart of Inkprint."
              width={1200}
              height={900}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 max-w-6xl mx-auto border-t border-sand flex items-center justify-between text-body-sm text-slate">
        <span className="font-mono">Step 3 — brand assets online.</span>
        <span>© Inkprint</span>
      </footer>
    </main>
  )
}
