import Link from 'next/link'
import { Button } from '@inkprint/ui'

export const metadata = {
  title: 'About',
  description: 'Why Inkprint exists, and the principles it’s built on.',
}

const principles = [
  {
    n: '01',
    title: 'Evidence over verdicts.',
    body: 'Every flag is grounded in a specific span. No black-box percentages.',
  },
  {
    n: '02',
    title: 'Pro-student, pro-teacher.',
    body: 'The language and design assume students are not suspects. Our job is to help, not police.',
  },
  {
    n: '03',
    title: 'Honest about uncertainty.',
    body: '"Inconclusive" is a valid output. Refusing to guess is a feature.',
  },
  {
    n: '04',
    title: 'Open methodology.',
    body: 'We publish our accuracy reports. Per language, per grade level. As models drift, the numbers update.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-16 max-w-3xl mx-auto">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-4">About</p>
        <h1 className="text-h1 font-display text-ink mb-6">
          We built Inkprint because the existing tools were getting students hurt.
        </h1>
        <p className="text-body-lg text-slate">
          Every AI-detection vendor in 2026 is selling a black box, optimized for a single
          percentage, with a well-documented false-positive problem that lands hardest on the
          students who can least afford it. The honest answer was a different product, not a better
          classifier.
        </p>
      </section>

      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <h2 className="text-h2 font-display text-ink mb-10">Our principles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {principles.map((p) => (
            <div key={p.n}>
              <p className="font-mono text-body-sm text-coral mb-2">{p.n}</p>
              <h3 className="text-h4 font-sans font-semibold text-ink mb-2">{p.title}</h3>
              <p className="text-body text-slate">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-20 max-w-3xl mx-auto">
          <h2 className="text-h2 font-display text-ink mb-6">Team</h2>
          <p className="text-body-lg text-slate">
            A small team of engineers, educators, and researchers based across North America and
            Europe. We&apos;re hiring — quietly, deliberately. If the mission resonates and you have
            taught a class or shipped a product (ideally both), say hello.
          </p>
        </div>
      </section>

      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <Link href="mailto:hello@inkprint.com">
          <Button size="lg" variant="secondary">
            Say hello
          </Button>
        </Link>
      </section>
    </>
  )
}
