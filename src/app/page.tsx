import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { PRESETS } from '@/data/presets'
import { pageMetadata } from '@/lib/metadata'
import { faqJsonLd, webAppJsonLd } from '@/lib/schema'
import { absoluteUrl } from '@/lib/site'

const description =
  'Convert CGPA to percentage with the formula your board or university published, or make a free UPI QR code that never leaves your browser. No ads and no account.'

const faqs = [
  {
    question: 'What is Hundredmark?',
    answer:
      'Hundredmark is two free tools: a CGPA to percentage calculator with cited university and board formulas, and a UPI QR code generator that builds the code in your browser.',
  },
  {
    question: 'Does a CGPA convert with one formula everywhere?',
    answer:
      'No. CBSE’s indicative rule is CGPA × 9.5. VTU’s 2022 regulations use CGPA × 10, while its 2015–2018 schemes use (CGPA − 0.75) × 10. Mumbai University’s circulars use 7.1 × CGPA + 11 or 7.25 × CGPI + 11. Pick the institution that awarded the grade.',
  },
  {
    question: 'Does the UPI QR code generator send my UPI ID anywhere?',
    answer:
      'No. The upi://pay link and the QR image are created on your device. Hundredmark is not affiliated with NPCI, BHIM, or any bank or UPI app.',
  },
]

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'CGPA to percentage calculator and free UPI QR code',
    description,
    path: '/',
  }),
  title: { absolute: 'Hundredmark — CGPA to percentage calculator and free UPI QR code' },
}

export default function HomePage() {
  return (
    <main id="content" className="page" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Hundredmark',
          url: absoluteUrl('/'),
          description,
        }}
      />
      <JsonLd data={webAppJsonLd({ name: 'CGPA to percentage calculator', description, path: '/cgpa-to-percentage/', category: 'EducationalApplication' })} />
      <JsonLd data={faqJsonLd(faqs)} />
      <header className="page-intro">
        <p className="eyebrow">No ads. No account.</p>
        <h1>Convert a CGPA, or print a UPI QR code.</h1>
        <p className="lede">
          Hundredmark is a CGPA to percentage calculator and a free UPI QR code generator. The grade formulas are the ones each board published, with the circular linked beside the result. The QR code is built in your browser.
        </p>
      </header>
      <div className="card-grid">
        <Link className="card" href="/cgpa-to-percentage/">
          <p className="eyebrow">Grade cards</p>
          <h2>CGPA to percentage</h2>
          <p>Convert CGPA, reverse a percentage, or average SGPA across semesters. CBSE, VTU, AKTU, Anna University, Mumbai University, and more.</p>
          <span>Open the calculator</span>
        </Link>
        <Link className="card" href="/upi-qr-code-generator/">
          <p className="eyebrow">Shop counter</p>
          <h2>UPI QR code</h2>
          <p>Enter a UPI ID, a name, and an optional amount. Download a PNG or SVG, copy the upi://pay link, or print a shop poster.</p>
          <span>Make a QR code</span>
        </Link>
      </div>
      <section className="prose">
        <h2>University and board formulas</h2>
        <p>The same CGPA is not the same percentage. Open the institution that printed your grade card.</p>
        <ul className="link-grid">
          {PRESETS.map((preset) => (
            <li key={preset.slug}>
              <Link href={`/cgpa-to-percentage/${preset.slug}/`}>{preset.shortName} CGPA to percentage</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="prose">
        <h2>Questions</h2>
        <div className="faq-list">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
