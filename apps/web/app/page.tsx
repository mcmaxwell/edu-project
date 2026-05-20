export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-6">
          Inkprint
        </p>
        <h1 className="text-display font-display text-ink mb-8">
          See the difference between <em className="italic text-coral">effort</em> and{' '}
          <em className="italic">autocomplete</em>.
        </h1>
        <p className="text-body-lg text-slate mb-10">
          A writing-process platform for educators. Evidence for the AI era — built for teachers,
          not against students.
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
        <p className="mt-16 text-body-sm font-mono text-slate">
          Step 2 — Next.js + Tailwind + brand tokens online.
        </p>
      </div>
    </main>
  )
}
