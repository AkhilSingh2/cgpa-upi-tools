'use client'

import { Accordion, AccordionItem } from '@sutra-ui/react'
import type { Faq } from '@/data/presets'

/**
 * Sutra's `Faq` component also injects a FAQPage JSON-LD script. These pages
 * already emit that graph through `faqJsonLd`, so the accordion is used on
 * its own and the existing structured data stays the only copy.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="hm-prose" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Questions</h2>
      <Accordion type="multiple" defaultValue={faqs.map((faq) => faq.question)}>
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question} title={faq.question}>
            <p>{faq.answer}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
