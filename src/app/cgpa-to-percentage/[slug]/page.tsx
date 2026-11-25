import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CgpaCalculator } from '@/components/CgpaCalculator'
import { ExternalLink } from '@/components/ExternalLink'
import { FaqList } from '@/components/FaqList'
import { JsonLd } from '@/components/JsonLd'
import { PresetSchemeTable } from '@/components/SchemeTables'
import { PRESETS, getPreset, getScheme } from '@/data/presets'
import { formatNumber, formulaExpression, formulaSteps, inverseExpression } from '@/lib/cgpa'
import { pageMetadata } from '@/lib/metadata'
import { breadcrumbJsonLd, faqJsonLd, webAppJsonLd } from '@/lib/schema'

export function generateStaticParams() {
  return PRESETS.map((preset) => ({ slug: preset.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const preset = getPreset(slug)
  if (!preset) return {}
  return pageMetadata({
    title: preset.title,
    description: preset.description,
    path: `/cgpa-to-percentage/${preset.slug}/`,
  })
}

export default async function PresetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const preset = getPreset(slug)
  if (!preset) notFound()
  const scheme = getScheme(preset, preset.defaultScheme)
  const example = formulaSteps(scheme.exampleCgpa, scheme.formula)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'CGPA to percentage', path: '/cgpa-to-percentage/' },
    { name: preset.shortName, path: `/cgpa-to-percentage/${preset.slug}/` },
  ]

  return (
    <main id="content" className="page" tabIndex={-1}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(preset.faqs)} />
      <JsonLd
        data={webAppJsonLd({
          name: preset.title,
          description: preset.description,
          path: `/cgpa-to-percentage/${preset.slug}/`,
          category: 'EducationalApplication',
        })}
      />
      <Breadcrumbs items={crumbs} />
      <header className="page-intro">
        <p className="eyebrow">{preset.region}</p>
        <h1>{preset.h1}</h1>
        <p className="lede">{preset.intro}</p>
      </header>
      <noscript>
        <p className="callout">
          The worked example without JavaScript: CGPA {formatNumber(scheme.exampleCgpa)} → {example}.
        </p>
      </noscript>
      <CgpaCalculator initialPreset={preset.slug} navigateOnPresetChange />
      <section className="prose">
        <h2>Worked example</h2>
        <p>
          Under the default rule, {formulaExpression(scheme.formula)}, a CGPA of {formatNumber(scheme.exampleCgpa)} is {example}. The reverse is {inverseExpression(scheme.formula)}.
        </p>
        <PresetSchemeTable preset={preset} />
      </section>
      <section className="prose">
        <h2>What the regulation says</h2>
        {preset.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {preset.schemes.map((item) => (
          <article key={item.id}>
            <h3>{item.label}</h3>
            <p>{formulaExpression(item.formula)}</p>
            <blockquote>
              <p>“{item.source.quote}”</p>
            </blockquote>
            <p>
              <ExternalLink href={item.source.url}>{item.source.title}</ExternalLink>
              {' · '}
              {item.source.publisher}, {item.source.date}. Checked {item.source.accessed}.
            </p>
            {item.supportingSources?.map((source) => (
              <p key={source.url}>
                Also: <ExternalLink href={source.url}>{source.title}</ExternalLink>. {source.quote}
              </p>
            ))}
            <p>{item.caveat}</p>
          </article>
        ))}
        {preset.notices?.map((notice) => (
          <p key={notice.url}>
            <ExternalLink href={notice.url}>{notice.title}</ExternalLink>. {notice.text}
          </p>
        ))}
      </section>
      <section className="prose" id="percentage-to-cgpa">
        <h2>Percentage to CGPA</h2>
        <p>
          Switch the calculator to Percentage to CGPA. {inverseExpression(scheme.formula)}. {scheme.formula.rounding === 'ceil-integer' ? 'Because this circular rounds up to the next whole number, the reverse step uses the unrounded formula.' : 'The reverse is the same rule, solved for CGPA.'}
        </p>
      </section>
      <section className="prose" id="sgpa-to-cgpa">
        <h2>SGPA to CGPA</h2>
        <p>
          Add a row for each semester, with that semester’s SGPA and credits. The CGPA is the credit-weighted average, rounded to two decimals, and then {formulaExpression(scheme.formula).replace('Percentage = ', 'the percentage is ')}.
        </p>
      </section>
      <FaqList faqs={preset.faqs} />
      <section className="prose">
        <h2>Other formulas</h2>
        <ul className="link-grid">
          <li>
            <Link href="/cgpa-to-percentage/">All CGPA formulas</Link>
          </li>
          {PRESETS.filter((item) => item.slug !== preset.slug).map((item) => (
            <li key={item.slug}>
              <Link href={`/cgpa-to-percentage/${item.slug}/`}>{item.shortName} CGPA to percentage</Link>
            </li>
          ))}
          <li>
            <Link href="/upi-qr-code-generator/">Free UPI QR code generator</Link>
          </li>
        </ul>
      </section>
    </main>
  )
}
