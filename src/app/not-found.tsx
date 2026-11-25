import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="content" className="page" tabIndex={-1}>
      <header className="page-intro">
        <h1>That page is not here</h1>
        <p className="lede">The calculator and the QR generator are still available.</p>
      </header>
      <p>
        <Link href="/cgpa-to-percentage/">CGPA to percentage</Link>
        {' · '}
        <Link href="/upi-qr-code-generator/">UPI QR code generator</Link>
      </p>
    </main>
  )
}
