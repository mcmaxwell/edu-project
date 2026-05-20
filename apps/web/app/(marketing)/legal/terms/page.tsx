export const metadata = { title: 'Terms of service' }

export default function TermsPage() {
  return (
    <>
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">Legal</p>
      <h1 className="text-h1 font-display text-ink mb-3">Terms of service</h1>
      <p className="text-body-sm text-slate mb-12">Last updated: 2026-05-20</p>

      <div className="space-y-6 text-body text-slate">
        <p>
          By using Inkprint you agree to these terms. They are intentionally short. The longer
          institutional agreement is the DPA, which controls if there is a conflict.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Acceptable use</h2>
        <p>
          You may use Inkprint to evaluate student work that you have a legitimate educational
          relationship with. You may not use it to scrape, harass, or generate verdicts about people
          outside that context.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Outputs are not verdicts</h2>
        <p>
          Inkprint produces evidence, not findings of guilt. You are responsible for the academic-
          integrity decisions you make using our outputs. Inkprint provides no warranty of
          correctness for any individual analysis.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Termination</h2>
        <p>
          Either of us can terminate this agreement at any time. On termination, you can export your
          data for 30 days; afterward, it is permanently deleted from active systems within 90 days.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Contact</h2>
        <p>
          <a href="mailto:legal@inkprint.com" className="text-ink underline">
            legal@inkprint.com
          </a>
        </p>
      </div>
    </>
  )
}
