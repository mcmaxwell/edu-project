export const metadata = { title: 'Privacy policy' }

export default function PrivacyPage() {
  return (
    <>
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">Legal</p>
      <h1 className="text-h1 font-display text-ink mb-3">Privacy policy</h1>
      <p className="text-body-sm text-slate mb-12">Last updated: 2026-05-20</p>

      <div className="space-y-6 text-body text-slate">
        <p>
          Inkprint is a writing-process platform for educators. This page describes what we collect,
          why, and what we do — and do not do — with it. Plain language version first; the formal
          terms are below.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">What we collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Account information you provide (name, email, role, institution).</li>
          <li>Submissions you (or your students) upload or paste.</li>
          <li>
            Process traces — keystrokes, paste events, pauses, focus changes — when a student writes
            in our editor or uses our extension.
          </li>
          <li>Standard product telemetry (page views, feature usage, error reports).</li>
        </ul>

        <h2 className="text-h3 font-display text-ink mt-10">What we do not do</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>We do not train any model on your submissions or process traces.</li>
          <li>We do not sell data to third parties.</li>
          <li>We do not log the content of clipboard items in process traces — only their length.</li>
          <li>We do not expose API keys you supply.</li>
        </ul>

        <h2 className="text-h3 font-display text-ink mt-10">Retention</h2>
        <p>
          On the Free and Pro tiers, submissions and traces are retained for 12 months by default
          and can be deleted on demand. Institutions can configure custom retention windows.
        </p>

        <h2 className="text-h3 font-display text-ink mt-10">Your rights</h2>
        <p>
          You can request export or deletion of your data at any time at{' '}
          <a href="mailto:privacy@inkprint.com" className="text-ink underline">
            privacy@inkprint.com
          </a>
          .
        </p>
      </div>
    </>
  )
}
