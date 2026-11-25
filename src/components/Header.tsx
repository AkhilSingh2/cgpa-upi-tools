import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Header() {
  return (
    <header className="site-header no-print">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <div className="header-bar">
        <Link href="/" className="brand">
          <Logo />
          <span className="brand-name">Hundredmark</span>
        </Link>
        <nav className="main-nav" aria-label="Tools">
          <Link href="/cgpa-to-percentage/">CGPA to percentage</Link>
          <Link href="/upi-qr-code-generator/">UPI QR code</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
