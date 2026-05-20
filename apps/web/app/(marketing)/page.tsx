import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, CardTitle, CardBody, FlagPill, Highlight, Badge } from '@inkprint/ui'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-20 pb-24 max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-6">
            Inkprint · Evidence for the AI era
          </p>
          <h1 className="text-display font-display text-ink mb-8">
            See the difference between <em className="italic text-coral">effort</em> and{' '}
            <em className="italic">autocomplete</em>.
          </h1>
          <p className="text-body-lg text-slate mb-10 max-w-xl">
            A writing-process platform for educators. Inkprint captures <em>how</em> a student&apos;s
            work was made — keystrokes, pauses, revisions — and gives teachers evidence, not
            verdicts.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/signup">
              <Button size="lg">Start a free pilot</Button>
            </Link>
            <Link href="/product">
              <Button size="lg" variant="secondary">
                Watch the 60-second demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-lg overflow-hidden border border-sand bg-paper">
            <Image
              src="/brand/images/01-fountain-pen-on-paper.jpg"
              alt="A fountain pen resting on a written page."
              width={1200}
              height={900}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-sand bg-paper">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-body-sm font-sans text-slate">
          <span className="text-eyebrow font-semibold uppercase">Used by educators at</span>
          <span>Riverdale High</span>
          <span>Cascade University</span>
          <span>Northwood Academy</span>
          <span>St. Vincent Day</span>
          <span>Atlas Community College</span>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3 text-center">
          How it works
        </p>
        <h2 className="text-h1 font-display text-ink mb-16 text-center max-w-2xl mx-auto">
          A new kind of evidence — drawn from the writing, not just the result.
        </h2>
        <ol className="grid md:grid-cols-3 gap-8">
          {[
            {
              n: '01',
              title: 'Students write in the Inkprint editor',
              body: 'Or import a Google Doc. Keystrokes, paste events, and pauses are captured silently — never the content of clipboard items.',
            },
            {
              n: '02',
              title: 'We build a per-student baseline',
              body: 'A few verified samples are enough to learn each student’s voice. No global classifier, no one-size-fits-all model.',
            },
            {
              n: '03',
              title: 'You see evidence, not a verdict',
              body: 'Flagged passages, indicators, and suggested conversation questions — printable as a one-page sheet for the meeting.',
            },
          ].map((step) => (
            <li key={step.n}>
              <p className="font-mono text-body-sm text-coral mb-3">{step.n}</p>
              <h3 className="text-h4 font-sans font-semibold text-ink mb-2">{step.title}</h3>
              <p className="text-body text-slate">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Evidence panel demo — the wedge */}
      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-24 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
              The evidence panel
            </p>
            <h2 className="text-h1 font-display text-ink mb-6">
              Every flag is grounded in a span you can point at.
            </h2>
            <p className="text-body-lg text-slate mb-6">
              No black-box percentage. Inkprint shows the passages that warrant a closer look, why
              they were flagged, and how confident we are. You make the judgment.
            </p>
            <ul className="space-y-3 text-body text-slate">
              <li>
                <strong className="text-ink">Span-level highlights</strong> with confidence per
                passage.
              </li>
              <li>
                <strong className="text-ink">Baseline divergence</strong> against the student&apos;s
                prior work.
              </li>
              <li>
                <strong className="text-ink">Process signals</strong>: paste events, edit ratio,
                pause distribution.
              </li>
            </ul>
          </div>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="info">Baseline · 8 samples</Badge>
              <FlagPill>3 passages flagged</FlagPill>
            </div>
            <p className="text-body text-ink leading-relaxed">
              The essay opens conventionally enough, but{' '}
              <Highlight>the second paragraph shifts register sharply</Highlight> — long, uniform
              sentences with discourse markers (&ldquo;Furthermore,&rdquo; &ldquo;Moreover&rdquo;)
              that don&apos;t appear in the student&apos;s prior work. Toward the end,{' '}
              <Highlight>a 412-character span was pasted in a single event</Highlight>, with no
              subsequent edits.
            </p>
            <p className="text-body-sm font-mono text-slate mt-6">
              process_signals · pastes: 2 · largest: 412 · edit_ratio: 0.04
            </p>
          </Card>
        </div>
      </section>

      {/* Built for the classroom workflow */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
          Built for grading night
        </p>
        <h2 className="text-h1 font-display text-ink mb-12 max-w-3xl">
          Drops into the workflow you already have.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardTitle>LMS integrations</CardTitle>
            <CardBody>
              Sync rosters and submissions from Canvas, Google Classroom, Moodle, or Schoology.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Bulk class scan</CardTitle>
            <CardBody>
              Drop a folder of essays. Get a class-wide report sorted by what warrants the closest
              look.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>One-page PDF reports</CardTitle>
            <CardBody>
              Print or share an evidence sheet built for the teacher-student conversation, not an
              automated flag.
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Privacy & ethics */}
      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-24 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
              Privacy & ethics
            </p>
            <h2 className="text-h1 font-display text-ink mb-6">
              Pro-student. Pro-teacher. Never punitive.
            </h2>
          </div>
          <ul className="space-y-5 text-body text-slate">
            <li>
              <strong className="text-ink">No training on submissions.</strong> Your students&apos;
              work is not used to improve any model.
            </li>
            <li>
              <strong className="text-ink">Process traces stay private.</strong> Encrypted at rest,
              scoped to the teacher of record, deletable on demand.
            </li>
            <li>
              <strong className="text-ink">EU and US data regions.</strong> FERPA-friendly defaults,
              signed DPA for institutions, no cross-region data flow.
            </li>
            <li>
              <strong className="text-ink">Public accuracy reports.</strong> We publish our
              false-positive rates per language and grade level. No black box.
            </li>
          </ul>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3 text-center">
          Pricing
        </p>
        <h2 className="text-h1 font-display text-ink mb-12 text-center max-w-2xl mx-auto">
          Free for individual teachers. Honest for institutions.
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              tier: 'Free',
              price: '$0',
              line: '20 submissions per month, single teacher.',
            },
            {
              tier: 'Teacher Pro',
              price: '$12/mo',
              line: 'Unlimited submissions, PDF reports, history.',
            },
            {
              tier: 'Institution',
              price: 'Talk to us',
              line: 'SSO, admin dashboard, signed DPA, custom retention.',
            },
          ].map((t) => (
            <Card key={t.tier}>
              <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
                {t.tier}
              </p>
              <p className="text-h2 font-display text-ink mb-3">{t.price}</p>
              <CardBody>{t.line}</CardBody>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/pricing">
            <Button variant="tertiary">See full pricing →</Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-24 max-w-3xl mx-auto">
          <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
            Common questions
          </p>
          <h2 className="text-h1 font-display text-ink mb-10">Asked by teachers, answered here.</h2>
          <div className="divide-y divide-sand border-y border-sand">
            {[
              {
                q: 'What about false positives?',
                a: 'Every detector has them. Inkprint mitigates them three ways: per-student baseline (not a global classifier), process-trace evidence that can’t be faked easily, and "inconclusive" as a valid output. We publish our false-positive rates.',
              },
              {
                q: 'Will students need to install something?',
                a: 'For the strongest evidence, they write in our editor or use a lightweight Docs/Word add-in. For legacy submissions you can also paste in finished text — you just get less evidence.',
              },
              {
                q: 'How is this different from Turnitin or GPTZero?',
                a: 'Those analyze the finished text against a global AI-vs-human model. Inkprint analyzes the writing process against the student’s own baseline. Different category, structurally different defensibility.',
              },
              {
                q: 'Is this FERPA / GDPR compliant?',
                a: 'Yes. EU and US data regions, no training on submissions, signed DPA for institutions, configurable retention.',
              },
            ].map((item) => (
              <details key={item.q} className="py-5 group">
                <summary className="cursor-pointer text-h4 font-sans font-semibold text-ink list-none flex items-center justify-between">
                  {item.q}
                  <span className="font-mono text-coral group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-body text-slate">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <h2 className="text-h1 font-display text-ink mb-6">
          Start with one class. See it for yourself.
        </h2>
        <p className="text-body-lg text-slate mb-10 max-w-xl mx-auto">
          Free pilot. No credit card. Bring your own API key or use our pooled tier.
        </p>
        <Link href="/signup">
          <Button size="lg">Start a free pilot</Button>
        </Link>
      </section>
    </>
  )
}
