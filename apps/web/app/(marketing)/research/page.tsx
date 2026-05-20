import { Card, CardTitle, CardBody, Badge } from '@inkprint/ui'

export const metadata = {
  title: 'Research',
  description: 'Methodology, accuracy benchmarks, and our open-methodology commitment.',
}

export default function ResearchPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto">
        <Badge variant="info" className="mb-4">
          Open methodology
        </Badge>
        <h1 className="text-h1 font-display text-ink mb-6">
          The numbers other detectors don&apos;t publish.
        </h1>
        <p className="text-body-lg text-slate max-w-2xl">
          Every detector has false positives. Most vendors won&apos;t tell you their rate, and the
          ones that do measure it on the wrong population. Inkprint publishes ours — by language,
          by grade level, by submission length — and updates them as models drift.
        </p>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardTitle>Methodology</CardTitle>
            <CardBody>
              Held-out gold set of human-written and AI-generated work, hand-labeled across grade
              levels and first languages. Refreshed quarterly.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Two confidence axes</CardTitle>
            <CardBody>
              Per-passage confidence (how much we trust each flag) and overall verdict confidence
              (how the signals add up). Reported separately. Both can be &ldquo;low.&rdquo;
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Refusal as a metric</CardTitle>
            <CardBody>
              We measure how often Inkprint returns &ldquo;inconclusive&rdquo; instead of forcing a
              verdict. High refusal on uncertain cases is a feature, not a failure.
            </CardBody>
          </Card>
        </div>

        <div className="rounded-md border border-sand bg-paper p-8">
          <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-4">
            Reported accuracy · last refresh: q1 2026
          </p>
          <table className="w-full text-body-sm font-sans">
            <thead>
              <tr className="text-left border-b border-sand">
                <th className="py-3 text-ink font-semibold">Population</th>
                <th className="py-3 text-ink font-semibold">True-positive</th>
                <th className="py-3 text-ink font-semibold">False-positive</th>
                <th className="py-3 text-ink font-semibold">Refusal rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand text-slate">
              <tr>
                <td className="py-3">English · grades 9–12 · &gt; 400 words</td>
                <td className="py-3 font-mono tabular-nums">94.2%</td>
                <td className="py-3 font-mono tabular-nums">1.1%</td>
                <td className="py-3 font-mono tabular-nums">8.3%</td>
              </tr>
              <tr>
                <td className="py-3">English · L2 writers · &gt; 400 words</td>
                <td className="py-3 font-mono tabular-nums">91.5%</td>
                <td className="py-3 font-mono tabular-nums">1.8%</td>
                <td className="py-3 font-mono tabular-nums">12.1%</td>
              </tr>
              <tr>
                <td className="py-3">English · undergraduate</td>
                <td className="py-3 font-mono tabular-nums">95.0%</td>
                <td className="py-3 font-mono tabular-nums">0.9%</td>
                <td className="py-3 font-mono tabular-nums">7.0%</td>
              </tr>
              <tr>
                <td className="py-3">Code submissions · Python / JS</td>
                <td className="py-3 font-mono tabular-nums">89.4%</td>
                <td className="py-3 font-mono tabular-nums">2.6%</td>
                <td className="py-3 font-mono tabular-nums">15.5%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-body-sm text-slate mt-4">
            Numbers are illustrative pre-GA placeholders and will be replaced with our pilot
            benchmark in the first public report.
          </p>
        </div>
      </section>

      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-20 max-w-3xl mx-auto">
          <h2 className="text-h2 font-display text-ink mb-6">Why this matters</h2>
          <p className="text-body-lg text-slate mb-4">
            The single biggest harm caused by AI-detection tools has been false positives against
            non-native English speakers and neurodivergent students. Inkprint mitigates that three
            ways:
          </p>
          <ul className="list-disc list-inside space-y-2 text-body text-slate">
            <li>Per-student baseline instead of a global classifier.</li>
            <li>Process-trace evidence that doesn&apos;t depend on writing style.</li>
            <li>&ldquo;Inconclusive&rdquo; as a valid, encouraged output.</li>
          </ul>
        </div>
      </section>
    </>
  )
}
