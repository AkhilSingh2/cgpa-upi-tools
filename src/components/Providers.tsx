'use client'

import { SutraProvider } from '@sutra-ui/react'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return <SutraProvider defaultTheme="system">{children}</SutraProvider>
}
