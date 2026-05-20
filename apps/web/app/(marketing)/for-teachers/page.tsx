import Link from 'next/link'
import { Button, Card, CardTitle, CardBody } from '@inkprint/ui'

export const metadata = {
  title: 'For teachers',
  description: 'Built around grading-night reality, not flag-and-punish.',
}

export default function ForTeachersPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto">
        <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-4">
          For teachers
        </p>
        <h1 className="text-h1 font-display text-ink mb-6">
          You shouldn&apos;t need a CS degree to know if a student wrote their essay.
        </h1>
        <p className="text-body-lg text-slate max-w-2xl">
          Inkprint is built around the way teachers actually grade — fast, often after dinner, with
          the goal of having better conversations with students, not catching them.
        </p>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <Card>
          <CardTitle>It&apos;s 9pm, I have 80 essays.</CardTitle>
          <CardBody>
            Drop the folder. Inkprint sorts them by what warrants the closest look. No false-alarm
            spam — &ldquo;inconclusive&rdquo; is a valid output, and we use it.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>This passage doesn&apos;t sound like Marisol.</CardTitle>
          <CardBody>
            We agree — and we show you the specific span, what indicators triggered the flag, and
            how it diverges from her prior eight submissions.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>I need to have a conversation with this student.</CardTitle>
          <CardBody>
            Print the one-page evidence sheet. It&apos;s written in supportive, evidence-based
            language — and it includes two suggested questions to open the conversation.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>My LMS owns my life.</CardTitle>
          <CardBody>
            Canvas, Google Classroom, Moodle, Schoology — pull rosters and submissions in, push
            reports back. Inkprint doesn&apos;t want to be your new tab.
          </CardBody>
        </Card>
      </section>

      <section className="bg-paper border-y border-sand">
        <div className="px-6 py-20 max-w-3xl mx-auto text-center">
          <h2 className="text-h2 font-display text-ink mb-6">
            We assume students aren&apos;t suspects.
          </h2>
          <p className="text-body-lg text-slate">
            Every word in our product UI is written that way. &ldquo;Flagged for review,&rdquo; not
            &ldquo;caught.&rdquo; &ldquo;Warrants a closer look,&rdquo; not &ldquo;guilty.&rdquo;
            The product&apos;s job is to help you have a better conversation — that&apos;s it.
          </p>
        </div>
      </section>

      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <Link href="/signup">
          <Button size="lg">Start a free pilot</Button>
        </Link>
      </section>
    </>
  )
}
