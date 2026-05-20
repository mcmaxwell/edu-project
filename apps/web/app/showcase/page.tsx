import {
  Logo,
  LogoMark,
  Button,
  Input,
  Textarea,
  Card,
  CardTitle,
  CardBody,
  Badge,
  FlagPill,
  ScoreGauge,
  Highlight,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@inkprint/ui'

export const metadata = { title: 'Design system' }

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10 border-b border-sand">
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-6">{title}</p>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

export default function ShowcasePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-h1 font-display text-ink">Design system</h1>
        <p className="text-body-lg text-slate mt-3 max-w-2xl">
          Visual review of every primitive shipped from <code>@inkprint/ui</code>. This is the
          source of truth for what teachers and admins will see across the product.
        </p>
      </header>

      <Row title="Logo">
        <Logo />
        <Logo variant="inverted" className="bg-ink p-3 rounded-sm" />
        <LogoMark />
      </Row>

      <Row title="Buttons">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary link</Button>
        <Button variant="coral">Coral</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
      </Row>

      <Row title="Inputs">
        <Input placeholder="Teacher email" className="max-w-xs" />
        <Input type="password" placeholder="Password" className="max-w-xs" />
        <Textarea placeholder="Paste the student's submission here…" className="max-w-md" />
      </Row>

      <Row title="Cards">
        <Card className="max-w-sm">
          <CardTitle>Single-submission analysis</CardTitle>
          <CardBody>
            Paste or upload an essay. Inkprint compares it against the student&apos;s baseline and
            highlights passages worth a closer look.
          </CardBody>
        </Card>
        <Card className="max-w-sm">
          <CardTitle>Bulk class scan</CardTitle>
          <CardBody>
            Drop a folder or sync from your LMS. Get a class-wide report ready for grading night.
          </CardBody>
        </Card>
      </Row>

      <Row title="Badges">
        <Badge>Neutral</Badge>
        <Badge variant="info">Verified baseline</Badge>
        <Badge variant="inconclusive">Inconclusive</Badge>
        <FlagPill>Flagged for review</FlagPill>
      </Row>

      <Row title="Score gauge">
        <ScoreGauge value={28} label="AI signal" confidence="low" />
        <ScoreGauge value={62} label="AI signal" confidence="medium" />
        <ScoreGauge value={91} label="AI signal" confidence="high" />
      </Row>

      <Row title="Highlight (evidence panel)">
        <p className="text-body text-ink max-w-2xl leading-relaxed">
          The essay opens conventionally enough, but{' '}
          <Highlight>the second paragraph shifts register sharply</Highlight> — long, uniform
          sentences with discourse markers (&ldquo;Furthermore,&rdquo; &ldquo;Moreover&rdquo;) that
          do not appear in the student&apos;s prior work. Toward the end,{' '}
          <Highlight>a 412-character span was pasted in a single event</Highlight>, with no
          subsequent edits.
        </p>
      </Row>

      <Row title="Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Open grant-access dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant pooled-key access</DialogTitle>
              <DialogDescription>
                Lets this teacher run analyses using Inkprint&apos;s pooled OpenAI / Anthropic /
                Gemini account, subject to a monthly token limit.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              <Input placeholder="Monthly token limit (e.g. 100000)" />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary">Cancel</Button>
                <Button>Grant access</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Row>

      <Row title="Tabs">
        <Tabs defaultValue="evidence" className="w-full max-w-2xl">
          <TabsList>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="process">Process trace</TabsTrigger>
            <TabsTrigger value="baseline">Baseline</TabsTrigger>
          </TabsList>
          <TabsContent value="evidence">
            <p className="text-body text-slate">
              Flagged passages, indicators, and the suggested conversation questions.
            </p>
          </TabsContent>
          <TabsContent value="process">
            <p className="text-body text-slate">
              Keystroke timeline, paste events, edit ratio, pause histogram.
            </p>
          </TabsContent>
          <TabsContent value="baseline">
            <p className="text-body text-slate">
              How this submission compares against the student&apos;s prior verified work.
            </p>
          </TabsContent>
        </Tabs>
      </Row>

      <footer className="py-10 text-body-sm font-mono text-slate">
        Step 4 — design system primitives.
      </footer>
    </main>
  )
}
