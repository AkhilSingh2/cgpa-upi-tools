import type { Metadata } from 'next'
import { absoluteUrl, SITE_NAME } from '@/lib/site'

export function pageMetadata(opts: { title: string; description: string; path: string }): Metadata {
  const url = absoluteUrl(opts.path)
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${opts.title} · ${SITE_NAME}`,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${opts.title} · ${SITE_NAME}`,
      description: opts.description,
    },
  }
}
