import Link from 'next/link'
import { Button, Card, CardTitle, CardBody, Badge } from '@inkprint/ui'

export const metadata = {
  title: 'For institutions',
  description: 'FERPA-friendly, SSO-ready, signed DPA. Built for procurement.',
}

export default function ForInstitutionsPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-4">
          For institutions
        </p>
        <h1 className="text-h1 font-display text-ink mb-6">
          Assessment integrity without the lawsuits.
        </h1>
        <p className="text-body-lg text-slate max-w-2xl">
          Inkprint is engineered for the institutional reality of 2026: FERPA-compliant by default,
          structurally resistant to the false-positive problem, and explainable enough to defend in
          an academic-integrity hearing.
        </p>
      </section>

      <section className="px-6 pb-20 max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardTitle>FERPA-friendly defaults</CardTitle>
          <CardBody>
            No training on submissions. Encryption at rest. Teacher-scoped access. Signed DPA on the
            Institution plan.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>EU & US data regions</CardTitle>
          <CardBody>
            Choose at signup. Data does not cross regions. EU residency hosted in Frankfurt.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>SSO & SCIM</CardTitle>
          <CardBody>
            Google Workspace and Microsoft 365 out of the box. SAML and SCIM provisioning on the
            Institution plan.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>Audit log</CardTitle>
          <CardBody>
            Every admin mutation is recorded. Append-only. Filterable. Exportable for compliance
            review.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>Bring-your-own model</CardTitle>
          <CardBody>
            Use Azure OpenAI or your own contracted Anthropic / Gemini key for data-residency
            requirements. Or use our pooled tier.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>Open methodology</CardTitle>
          <CardBody>
            We publish accuracy reports per language and grade level. Show your faculty the numbers
            instead of asking them to trust a vendor.
          </CardBody>
        </Card>
      </section>

      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-20 max-w-3xl mx-auto">
          <Badge variant="info" className="mb-4">
            Procurement-ready
          </Badge>
          <h2 className="text-h2 font-display text-ink mb-6">
            We&apos;ll send the security questionnaire before you ask.
          </h2>
          <p className="text-body-lg text-slate">
            SOC 2 Type II in progress. Penetration test reports under NDA. A standard DPA, BAA on
            request, and a security contact who answers email within a business day.
          </p>
        </div>
      </section>

      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <Link href="mailto:institutions@inkprint.com">
          <Button size="lg">Talk to us</Button>
        </Link>
      </section>
    </>
  )
}
