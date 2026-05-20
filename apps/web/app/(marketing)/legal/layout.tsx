export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <article className="px-6 pt-16 pb-24 max-w-3xl mx-auto prose-inkprint">
      {children}
    </article>
  )
}
