'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#10141a' : '#f3f0e8')
}

export function ThemeToggle() {
  const [ready, setReady] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    setTheme(current)
    setReady(true)
    if (localStorage.getItem('hm-theme') === 'light' || localStorage.getItem('hm-theme') === 'dark') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const next = media.matches ? 'dark' : 'light'
      applyTheme(next)
      setTheme(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    localStorage.setItem('hm-theme', next)
    setTheme(next)
  }

  const label = !ready ? 'Toggle colour theme' : theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-pressed={ready ? theme === 'dark' : undefined} aria-label={label}>
      {ready ? (theme === 'dark' ? 'Light' : 'Dark') : 'Theme'}
    </button>
  )
}
