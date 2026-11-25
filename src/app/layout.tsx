import type { Metadata, Viewport } from 'next'
import { Fraunces, Outfit } from 'next/font/google'
import Script from 'next/script'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SITE_NAME, SITE_TAGLINE, siteOrigin } from '@/lib/site'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
})

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: ['600', '700'],
})

const themeBoot = `(function(){try{var s=localStorage.getItem('hm-theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var d=document.documentElement;d.setAttribute('data-theme',t);d.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  applicationName: SITE_NAME,
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_TAGLINE,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  category: 'utilities',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#10141a' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body>
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
