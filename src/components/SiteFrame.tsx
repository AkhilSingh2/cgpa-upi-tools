'use client'

import { Footer, Header, ThemeSwitcher, ToolLayout, type Crumb, type NavItem, type RelatedTool } from '@sutra-ui/react'
import type { ReactNode } from 'react'
import { PRESETS } from '@/data/presets'
import { withBasePath } from '@/lib/site'

const nav: NavItem[] = [
  { href: withBasePath('/cgpa-to-percentage/'), label: 'CGPA to percentage' },
  { href: withBasePath('/upi-qr-code-generator/'), label: 'UPI QR code' },
]

const footerLinks: NavItem[] = [
  { href: withBasePath('/cgpa-to-percentage/'), label: 'CGPA to percentage' },
  { href: withBasePath('/upi-qr-code-generator/'), label: 'UPI QR code generator' },
  { href: withBasePath('/privacy/'), label: 'Privacy' },
  ...PRESETS.map((preset) => ({
    href: withBasePath(`/cgpa-to-percentage/${preset.slug}/`),
    label: preset.shortName,
  })),
]

export function SiteFrame({
  title,
  description,
  breadcrumb = [],
  related = [],
  children,
}: {
  title: string
  description?: string
  breadcrumb?: { name: string; path: string }[]
  related?: RelatedTool[]
  children: ReactNode
}) {
  const crumbs: Crumb[] = breadcrumb.map((crumb) => ({
    label: crumb.name,
    href: withBasePath(crumb.path),
  }))

  return (
    <ToolLayout
      title={title}
      description={description}
      breadcrumb={crumbs}
      related={related.map((tool) => ({ ...tool, href: tool.href.startsWith('/') ? withBasePath(tool.href) : tool.href }))}
      header={
        <Header title="Hundredmark" href={withBasePath('/')} nav={nav}>
          <ThemeSwitcher />
        </Header>
      }
      footer={
        <Footer
          title="Hundredmark"
          note="Independent calculators. Not affiliated with any university, board, NPCI, or UPI app. Formulas reviewed 25 November 2026. Check the linked circular before you submit a percentage on a form."
          links={footerLinks}
        />
      }
    >
      {children}
    </ToolLayout>
  )
}
