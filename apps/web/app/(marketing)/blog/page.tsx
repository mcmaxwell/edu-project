export const metadata = {
  title: 'Blog',
  description: 'Field notes on AI, writing, and the classroom.',
}

export default function BlogIndexPage() {
  return (
    <section className="px-6 pt-20 pb-24 max-w-3xl mx-auto">
      <p className="text-eyebrow font-sans font-semibold uppercase text-slate mb-4">Blog</p>
      <h1 className="text-h1 font-display text-ink mb-6">Field notes — coming soon.</h1>
      <p className="text-body-lg text-slate">
        We&apos;re writing essays on AI, writing, and the classroom — methodology notes, teacher
        interviews, and accuracy postmortems. First posts land alongside our public beta.
      </p>
    </section>
  )
}
