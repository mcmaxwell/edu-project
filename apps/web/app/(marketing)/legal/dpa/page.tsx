export const metadata = { title: 'Data processing agreement' }

export default function DPAPage() {
  return (
    <>
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">Legal</p>
      <h1 className="text-h1 font-display text-ink mb-3">Data Processing Agreement</h1>
      <p className="text-body-sm text-slate mb-12">Last updated: 2026-05-20</p>

      <div className="space-y-6 text-body text-slate">
        <p>
          This Data Processing Agreement (DPA) supplements the institutional service agreement
          between Inkprint and the institution (&ldquo;Controller&rdquo;). Inkprint acts as a
          Processor for personal data submitted to the platform.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Subject matter</h2>
        <p>
          Provision of the Inkprint writing-process and analysis platform to the Controller&apos;s
          authorized educators and administrators.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Sub-processors</h2>
        <p>
          A current list of sub-processors (hosting, email, error reporting, analytics) is available
          at{' '}
          <a href="mailto:privacy@inkprint.com" className="text-ink underline">
            privacy@inkprint.com
          </a>
          . We provide 30 days notice before adding a new sub-processor.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Data residency</h2>
        <p>
          Controller selects US or EU residency at signup. Inkprint does not transfer personal data
          across the selected region.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Security measures</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>TLS 1.3 in transit. AES-256-GCM at rest for sensitive data.</li>
          <li>Argon2id password hashing.</li>
          <li>Row-level security enforced at the database layer.</li>
          <li>Audit log of all administrative actions.</li>
          <li>Annual third-party penetration test, summary available under NDA.</li>
        </ul>

        <p>
          Full executable DPA available on request:{' '}
          <a href="mailto:legal@inkprint.com" className="text-ink underline">
            legal@inkprint.com
          </a>
          .
        </p>
      </div>
    </>
  )
}
