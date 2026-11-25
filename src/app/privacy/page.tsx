import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbJsonLd } from '@/lib/schema'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Privacy', path: '/privacy/' },
]

export const metadata: Metadata = pageMetadata({
  title: 'Privacy',
  description:
    'Hundredmark calculates CGPA conversions and UPI QR codes in your browser. Grade values, UPI IDs, names, amounts, notes, and logos are not uploaded.',
  path: '/privacy/',
})

export default function PrivacyPage() {
  return (
    <main id="content" className="page" tabIndex={-1}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <header className="page-intro">
        <h1>Privacy</h1>
        <p className="lede">Both tools run on your device. This site does not ask for an account, and it does not include an analytics script.</p>
      </header>
      <section className="prose">
        <h2>CGPA calculator</h2>
        <p>
          CGPA, percentage, semester marks, and a custom formula are read in the page to do the arithmetic. They are not sent to a server. A shareable result link keeps those numbers in the address itself, so anyone you send the link to can see them. Don’t share a link if the numbers are private.
        </p>
        <h2>UPI QR code</h2>
        <p>
          The UPI ID, payee name, amount, note, and logo are used only to draw the QR code and the poster. Nothing is uploaded. The logo stays in the page’s memory until you remove it or leave. Hundredmark cannot see whether a UPI ID is real, and it does not receive the payment. Your bank and UPI app do that, after a person scans the code.
        </p>
        <p>Hundredmark is not affiliated with NPCI, BHIM, any bank, or any UPI app.</p>
        <h2>What the browser stores</h2>
        <p>
          The theme choice, light or dark, is saved in local storage on your device. Fonts are part of the site download. The page does not call Google Fonts, a QR API, or an advertising network while you use it.
        </p>
        <h2>Formulas</h2>
        <p>
          Conversion rules are copied from the university and board documents linked on each page, and the date they were read is shown. They can change. A percentage on an application should follow the document your institution or employer asks for. Start at the <Link href="/cgpa-to-percentage/">CGPA calculator</Link> or the <Link href="/upi-qr-code-generator/">UPI QR code generator</Link>.
        </p>
      </section>
    </main>
  )
}
