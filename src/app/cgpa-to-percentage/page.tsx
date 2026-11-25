import type { Metadata } from 'next'
import Link from 'next/link'
import { CgpaCalculator } from '@/components/CgpaCalculator'
import { FaqList } from '@/components/FaqList'
import { JsonLd } from '@/components/JsonLd'
import { SameCgpaTable } from '@/components/SchemeTables'
import { SiteFrame } from '@/components/SiteFrame'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbJsonLd, faqJsonLd, webAppJsonLd } from '@/lib/schema'

const title = 'CGPA to Percentage Calculator'
const description =
  'Convert CGPA to percentage, percentage back to CGPA, or SGPA into CGPA. CBSE uses ×9.5. VTU, AKTU, Anna University, Mumbai University, GTU, KTU, and JNTUH use their own cited formulas.'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'CGPA to percentage', path: '/cgpa-to-percentage/' },
]

const faqs = [
  {
    question: 'How do I convert CGPA to percentage?',
    answer:
      'Use the formula published by the board or university that awarded the CGPA. CBSE’s 2010 circular uses 9.5 × CGPA. Many engineering regulations use CGPA × 10, (CGPA − 0.75) × 10, or (CGPA − 0.5) × 10. This calculator applies the formula you select and shows the source.',
  },
  {
    question: 'How do I convert percentage to CGPA?',
    answer:
      'Choose Percentage to CGPA and enter the percentage. The page reverses the selected formula. For CBSE, 76% ÷ 9.5 is a CGPA of 8. A percentage the formula cannot produce on a 0–10 scale is rejected instead of being clamped.',
  },
  {
    question: 'How do I convert SGPA to CGPA?',
    answer:
      'Add each semester’s SGPA and its credits. CGPA is the credit-weighted average, rounded to two decimal places, the method described in the VTU, AKTU, and Anna University regulations. The page then converts that CGPA with the formula you selected.',
  },
  {
    question: 'Why do CGPA calculators disagree?',
    answer:
      'They often hide which rule they used. A CGPA of 8.5 is 80.75% on the CBSE rule, 85% where the rule is ×10, 77.5% on VTU’s older scheme, and 71% after Mumbai University’s 7.1 × CGPA + 11 formula is rounded up. The institution has to match the grade card.',
  },
  {
    question: 'Can I share a result?',
    answer:
      'Yes. Copy the result link. It reopens the same institution, scheme, and value. For a listed university the link uses that university’s page, such as /cgpa-to-percentage/vtu/.',
  },
]

export const metadata: Metadata = pageMetadata({ title, description, path: '/cgpa-to-percentage/' })

export default function CgpaPage() {
  return (
    <SiteFrame
      title="CGPA to percentage calculator"
      description="Convert CGPA to percentage, turn a percentage back into CGPA, or average SGPA across semesters. Each preset uses one published formula, with the circular linked under the result. The maths runs in your browser."
      breadcrumb={crumbs}
      related={[
        {
          href: '/upi-qr-code-generator/',
          title: 'UPI QR code',
          description: 'Build a upi://pay code in the browser and print a shop poster.',
        },
      ]}
    >
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd({ name: title, description, path: '/cgpa-to-percentage/', category: 'EducationalApplication' })} />
      <noscript>
        <p className="hm-note">Turn on JavaScript to calculate. The tables and cited formulas below are still readable.</p>
      </noscript>
      <CgpaCalculator initialPreset="cbse" navigateOnPresetChange={false} />
      <section className="hm-prose">
        <h2>The same CGPA is not the same percentage</h2>
        <p>
          “CGPA to percentage” is not one sum. A person comparing an 8.5 from CBSE with an 8.5 from VTU or Mumbai University is comparing different scales. The default formula for each institution is below. Where a university changed the rule, the institution page has every scheme we could cite.
        </p>
        <SameCgpaTable />
        <p>
          Need a multiplier that is not in the list? Choose Custom formula. Percentage = multiplier × CGPA + adjustment. VTU’s older scheme is multiplier 10 and adjustment −7.5.
        </p>
      </section>
      <section className="hm-prose" id="percentage-to-cgpa">
        <h2>Percentage to CGPA</h2>
        <p>
          Reverse conversion uses the same formula, solved for CGPA. Multiply rules divide. Offset rules divide and then add the offset back. Mumbai University’s circulars also say to round the percentage up to the next whole number, so the reverse step uses the formula before that rounding. One whole-number percentage can therefore come from a small range of CGPAs.
        </p>
      </section>
      <section className="hm-prose" id="sgpa-to-cgpa">
        <h2>SGPA to CGPA</h2>
        <p>
          SGPA is one semester. CGPA is the whole programme. The regulations used here define it as the credit-weighted average: add credits × SGPA for every semester, divide by the total credits, and round to two decimal places. A transcript computed from individual course grades can differ by a few hundredths from an average of already-rounded SGPAs. Use the CGPA printed on the consolidated grade card when you have it.
        </p>
      </section>
      <FaqList faqs={faqs} />
      <section className="hm-prose">
        <h2>Choose the institution</h2>
        <ul className="hm-links">
          <li>
            <Link href="/cgpa-to-percentage/cbse/">CBSE CGPA to percentage</Link>
          </li>
          <li>
            <Link href="/cgpa-to-percentage/vtu/">VTU CGPA to percentage</Link>
          </li>
          <li>
            <Link href="/cgpa-to-percentage/aktu/">AKTU CGPA to percentage</Link>
          </li>
          <li>
            <Link href="/cgpa-to-percentage/anna-university/">Anna University CGPA to percentage</Link>
          </li>
          <li>
            <Link href="/cgpa-to-percentage/mumbai-university/">Mumbai University CGPA to percentage</Link>
          </li>
          <li>
            <Link href="/cgpa-to-percentage/gtu/">GTU CGPA to percentage</Link>
          </li>
          <li>
            <Link href="/cgpa-to-percentage/ktu/">KTU CGPA to percentage</Link>
          </li>
          <li>
            <Link href="/cgpa-to-percentage/jntuh/">JNTUH CGPA to percentage</Link>
          </li>
        </ul>
        <p>
          Making a payment code instead? Use the <Link href="/upi-qr-code-generator/">free UPI QR code generator</Link>.
        </p>
      </section>
    </SiteFrame>
  )
}
