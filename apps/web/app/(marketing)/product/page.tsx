import Image from 'next/image'
import Link from 'next/link'
import { Button, Card, Highlight, FlagPill } from '@inkprint/ui'

export const metadata = {
  title: 'Product',
  description: 'A writing-process platform: capture, baseline, and evidence — not verdicts.',
}

export default function ProductPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-4">Product</p>
        <h1 className="text-h1 font-display text-ink mb-6">
          Five things that make Inkprint different from every other detector.
        </h1>
        <p className="text-body-lg text-slate max-w-2xl">
          Inkprint isn&apos;t an AI-text classifier with a coat of paint. It&apos;s a writing-process
          platform — built on the bet that <em>how</em> a student wrote is harder to fake than{' '}
          <em>what</em> they wrote.
        </p>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto space-y-20">
        {[
          {
            title: 'Writing-process capture',
            body: 'A lightweight editor (and Docs/Word add-in) records keystrokes, pauses, revisions, and paste events while a student writes. Pasted AI text leaves an unmistakable trace — and a better model doesn’t help anyone fake a 90-minute writing session.',
            image: '02-open-book-handwritten-notes.jpg',
          },
          {
            title: 'Per-student stylistic baseline',
            body: 'A few verified samples build a baseline of voice, sentence rhythm, vocabulary, and punctuation habits. Every future submission is compared to that baseline — not a global model that systematically mis-flags non-native English speakers and neurodivergent students.',
            image: '03-dictionary-close-up.jpg',
          },
          {
            title: 'AI-collaboration declaration',
            body: 'Students declare what they used AI for (brainstorming, outlining, grammar). Inkprint verifies the declaration matches the captured process. Teachers grade the human contribution — not the absence of AI.',
            image: '04-book-margin-notes.jpg',
          },
          {
            title: 'Provenance certificate',
            body: 'Every submission gets a cryptographically signed record — started at X, edited for Y minutes, N paste events. Auditable, exportable to the LMS, useful in an academic-integrity conversation.',
            image: '05-open-book-on-table.jpg',
          },
          {
            title: 'Evidence sheet, not a score',
            body: 'A one-page document built for the teacher-student conversation, not an automated flag. Flagged passages, indicators, suggested questions. No "97% AI" verdicts.',
            image: '06-open-book-text.jpg',
          },
        ].map((f, i) => (
          <div key={f.title} className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={i % 2 ? 'lg:order-2' : ''}>
              <p className="font-mono text-body-sm text-coral mb-3">0{i + 1}</p>
              <h2 className="text-h2 font-display text-ink mb-4">{f.title}</h2>
              <p className="text-body-lg text-slate">{f.body}</p>
            </div>
            <div className={i % 2 ? 'lg:order-1' : ''}>
              <div className="rounded-lg overflow-hidden border border-sand bg-paper">
                <Image
                  src={`/brand/images/${f.image}`}
                  alt=""
                  width={1200}
                  height={900}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-20 max-w-4xl mx-auto">
          <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
            What you actually see
          </p>
          <h2 className="text-h1 font-display text-ink mb-8">
            An evidence sheet, not a percentage.
          </h2>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <p className="text-body-sm font-sans text-slate">
                Student: <span className="text-ink font-semibold">Marisol P.</span> · Assignment:{' '}
                <span className="text-ink">The Great Gatsby — Chapter 3 response</span>
              </p>
              <FlagPill>Partial concern</FlagPill>
            </div>
            <p className="text-body text-ink leading-relaxed mb-4">
              The essay opens conventionally enough, but{' '}
              <Highlight>the second paragraph shifts register sharply</Highlight> — long, uniform
              sentences with discourse markers that don&apos;t appear in the student&apos;s prior
              eight submissions. The trace shows{' '}
              <Highlight>a 412-character span pasted in a single event</Highlight> with no
              subsequent edits.
            </p>
            <div className="border-t border-sand pt-4 mt-4">
              <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-2">
                Suggested conversation questions
              </p>
              <ul className="list-disc list-inside space-y-1 text-body text-slate">
                <li>Walk me through how you got from the opening to the second paragraph.</li>
                <li>What did you use AI for, if anything, on this draft?</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <h2 className="text-h1 font-display text-ink mb-6">See it in your own classroom.</h2>
        <Link href="/signup">
          <Button size="lg">Start a free pilot</Button>
        </Link>
      </section>
    </>
  )
}
