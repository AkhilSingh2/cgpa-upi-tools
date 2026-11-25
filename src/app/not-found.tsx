import Link from 'next/link'
import { SiteFrame } from '@/components/SiteFrame'

export default function NotFound() {
  return (
    <SiteFrame title="That page is not here" description="The calculator and the QR generator are still available.">
      <p className="hm-prose">
        <Link href="/cgpa-to-percentage/">CGPA to percentage</Link>
        {' · '}
        <Link href="/upi-qr-code-generator/">UPI QR code generator</Link>
      </p>
    </SiteFrame>
  )
}
