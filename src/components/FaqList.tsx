import type { Faq } from '@/data/presets'

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="prose" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Questions</h2>
      <div className="faq-list">
        {faqs.map((faq) => (
          <article key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
