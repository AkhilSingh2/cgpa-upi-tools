import type { Metadata, Viewport } from 'next'
import { themeInitScript } from '@sutra-ui/react/theme-script'
import darkTokens from '@sutra-ui/tokens/tokens/dark'
import lightTokens from '@sutra-ui/tokens/tokens/light'
import { Providers } from '@/components/Providers'
import { SITE_NAME, SITE_TAGLINE, siteOrigin } from '@/lib/site'
import '@sutra-ui/react/styles.css'
import '@sutra-ui/tokens/css'
import './globals.css'

/** Keep a saved light/dark choice from before Sutra, then let Sutra read `sutra-theme`. */
const themeBoot = `(function(){try{if(!localStorage.getItem("sutra-theme")){var old=localStorage.getItem("hm-theme");if(old==="light"||old==="dark")localStorage.setItem("sutra-theme",old);}}catch(e){}})();${themeInitScript}`

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
    { media: '(prefers-color-scheme: light)', color: lightTokens['color.bg.canvas'] },
    { media: '(prefers-color-scheme: dark)', color: darkTokens['color.bg.canvas'] },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
