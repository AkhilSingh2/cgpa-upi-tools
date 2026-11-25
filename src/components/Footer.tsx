import Link from 'next/link'
import { PRESETS } from '@/data/presets'

export function Footer() {
  return (
    <footer className="site-footer no-print">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">Hundredmark</p>
          <p>Independent calculators. Not affiliated with any university, board, NPCI, or UPI app.</p>
        </div>
        <nav aria-label="Footer">
          <p className="footer-label">Tools</p>
          <ul>
            <li>
              <Link href="/cgpa-to-percentage/">CGPA to percentage</Link>
            </li>
            <li>
              <Link href="/upi-qr-code-generator/">UPI QR code generator</Link>
            </li>
            <li>
              <Link href="/privacy/">Privacy</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Universities and boards">
          <p className="footer-label">Formulas</p>
          <ul>
            {PRESETS.map((preset) => (
              <li key={preset.slug}>
                <Link href={`/cgpa-to-percentage/${preset.slug}/`}>{preset.shortName}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="footer-meta">Formulas reviewed 25 November 2026. Check the linked circular before you submit a percentage on a form.</p>
    </footer>
  )
}
