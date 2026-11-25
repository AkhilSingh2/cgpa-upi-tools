import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FaqList } from '@/components/FaqList'
import { JsonLd } from '@/components/JsonLd'
import { UpiGenerator } from '@/components/UpiGenerator'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbJsonLd, faqJsonLd, webAppJsonLd } from '@/lib/schema'

const title = 'Free UPI QR Code Generator'
const description =
  'Create a free UPI QR code in your browser. Enter a UPI ID and payee name, add an optional amount and note, then download PNG or SVG or print a shop poster. No data is uploaded.'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'UPI QR code', path: '/upi-qr-code-generator/' },
]

const faqs = [
  {
    question: 'How do I make a free UPI QR code?',
    answer:
      'Enter the UPI ID, such as shop@okaxis, and the payee name. Add an amount only if every payment should be for that amount, and add a note if you want one. The page builds a upi://pay link and a QR code on your device. Download the PNG or SVG, or print the poster.',
  },
  {
    question: 'Does my UPI ID leave the browser?',
    answer:
      'No. Hundredmark does not send the UPI ID, name, amount, note, or logo to a server. The QR image is drawn locally. Closing the page clears it. There is no account and no payment is collected here.',
  },
  {
    question: 'Is this affiliated with NPCI?',
    answer:
      'No. Hundredmark is not affiliated with NPCI, BHIM, any bank, or any UPI app. The code follows the public upi://pay link format so that UPI apps can read it. Only the payer’s own app, and their bank, can confirm that a UPI ID exists.',
  },
  {
    question: 'What is inside the upi://pay link?',
    answer:
      'The link contains pa (the UPI ID), pn (the payee name), cu=INR, and, only when you typed them, am (the amount) and tn (the note). Empty fields are left out. You can copy the link as well as the image.',
  },
  {
    question: 'How do I print a shop standee?',
    answer:
      'The poster preview shows the name, an optional logo, the QR code, the UPI ID, and the amount if you set one. Choose Print poster and print it on A4. The logo is read on your device and is not uploaded. Keep the QR large and leave the white margin around it so phones can scan it.',
  },
  {
    question: 'Why was my UPI ID rejected?',
    answer:
      'The check is a format check: letters, numbers, dots, hyphens, or underscores, then @, then a handle such as okaxis, ybl, paytm, or upi. Spaces are not allowed. A format that passes can still be an unused address. The payer’s app is what finally accepts or declines it.',
  },
]

export const metadata: Metadata = pageMetadata({ title, description, path: '/upi-qr-code-generator/' })

export default function UpiPage() {
  return (
    <main id="content" className="page" tabIndex={-1}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd({ name: title, description, path: '/upi-qr-code-generator/', category: 'UtilitiesApplication' })} />
      <div className="no-print">
        <Breadcrumbs items={crumbs} />
        <header className="page-intro">
          <h1>Free UPI QR code generator</h1>
          <p className="lede">
            Build a UPI payment QR code without sending the details anywhere. Add a payee name, an optional fixed amount and note, then download a PNG or SVG or print a counter poster. Hundredmark is not part of NPCI.
          </p>
        </header>
      </div>
      <UpiGenerator />
      <section className="prose no-print">
        <h2>How the link is built</h2>
        <p>
          A UPI QR code is a picture of a link that starts with <code>upi://pay</code>. The payee address goes in <code>pa</code>, the name in <code>pn</code>, and the currency is <code>INR</code>. An amount goes in <code>am</code> only when you want the payer’s app to open with that amount filled in. A note goes in <code>tn</code>. This page percent-encodes those values and stops there. It does not add a merchant code, and it does not talk to a bank.
        </p>
        <p>
          Leave the amount blank for a shop where every bill is different. Set it when the price is fixed, such as a ₹50 entry. Amounts above ₹1,00,000 are still encoded, with a warning, because many banks cap a single UPI payment at one lakh even when a QR asks for more.
        </p>
      </section>
      <section className="prose no-print">
        <h2>Printing the poster</h2>
        <p>
          The preview on this page is the poster. It is always black on white, including in dark mode, because a dark QR code on a light ground is what phones expect to scan. Put the logo beside the code, not on top of it. Print at actual size, on A4, and do not shrink the quiet margin around the code.
        </p>
      </section>
      <div className="no-print">
        <FaqList faqs={faqs} />
        <section className="prose">
          <h2>Also on Hundredmark</h2>
          <p>
            Looking up a grade instead? Use the <Link href="/cgpa-to-percentage/">CGPA to percentage calculator</Link>, including the <Link href="/cgpa-to-percentage/vtu/">VTU</Link> and <Link href="/cgpa-to-percentage/cbse/">CBSE</Link> formulas. Read how the site handles data on the <Link href="/privacy/">privacy page</Link>.
          </p>
        </section>
      </div>
    </main>
  )
}
