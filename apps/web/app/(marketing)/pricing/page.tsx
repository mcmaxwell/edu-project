import Link from 'next/link'
import { Button, Card, CardBody } from '@inkprint/ui'

export const metadata = {
  title: 'Pricing',
  description: 'Free for individual teachers. Honest pricing for institutions.',
}

type Tier = {
  name: string
  price: string
  cadence: string
  description: string
  features: string[]
  cta: { label: string; href: string }
  highlight?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    description: 'For teachers piloting Inkprint solo.',
    features: [
      '20 submissions / month',
      'Per-student baseline',
      'Evidence sheets (PDF)',
      'Bring-your-own API key (OpenAI / Anthropic / Gemini)',
    ],
    cta: { label: 'Start free', href: '/signup' },
  },
  {
    name: 'Teacher Pro',
    price: '$12',
    cadence: 'per teacher / month',
    description: 'For one teacher, one classroom, one school year.',
    highlight: true,
    features: [
      'Unlimited submissions',
      'Bulk class scan',
      'Submission history & search',
      'Pooled API key included (100k tokens / month)',
      'Email support',
    ],
    cta: { label: 'Start Pro trial', href: '/signup?plan=pro' },
  },
  {
    name: 'Institution',
    price: 'Custom',
    cadence: 'site license',
    description: 'For a department, school, or district.',
    features: [
      'Everything in Pro',
      'SSO (Google, Microsoft, SAML)',
      'Admin panel & audit log',
      'Signed DPA, EU/US data residency',
      'SCIM provisioning',
      'Dedicated security contact',
    ],
    cta: { label: 'Talk to us', href: 'mailto:institutions@inkprint.com' },
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto text-center">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-4">Pricing</p>
        <h1 className="text-h1 font-display text-ink mb-6">
          Free for individual teachers. Honest for institutions.
        </h1>
        <p className="text-body-lg text-slate max-w-2xl mx-auto">
          We never charge students. Ever.
        </p>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={
              tier.highlight ? 'border-ink ring-1 ring-ink relative' : undefined
            }
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-6 bg-coral text-paper text-eyebrow font-sans font-semibold uppercase px-2 py-1 rounded-sm">
                Most popular
              </span>
            )}
            <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-3">
              {tier.name}
            </p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-h1 font-display text-ink">{tier.price}</span>
              <span className="text-body-sm text-slate">{tier.cadence}</span>
            </div>
            <CardBody>{tier.description}</CardBody>
            <ul className="space-y-2 my-6 text-body text-slate">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-coral font-mono">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href={tier.cta.href} className="block">
              <Button
                className="w-full"
                variant={tier.highlight ? 'primary' : 'secondary'}
              >
                {tier.cta.label}
              </Button>
            </Link>
          </Card>
        ))}
      </section>

      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-20 max-w-3xl mx-auto">
          <h2 className="text-h2 font-display text-ink mb-6">Pricing FAQ</h2>
          <dl className="space-y-6 text-body text-slate">
            <div>
              <dt className="font-semibold text-ink mb-1">Why is the free tier capped at 20?</dt>
              <dd>
                LLM calls cost real money. 20 / month is enough to evaluate the product on one class
                without us going broke. Bring your own API key for unlimited use on the free plan.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink mb-1">Do you charge students?</dt>
              <dd>No. It would conflict with the mission. We never will.</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink mb-1">Can I switch to BYOK later?</dt>
              <dd>Yes. You can use both — the system prefers your pooled grant, falls back to your BYOK key.</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  )
}
