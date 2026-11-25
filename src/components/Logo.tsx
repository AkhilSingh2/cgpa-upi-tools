export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <circle cx="11" cy="11" r="2.3" fill="var(--bg)" />
      <circle cx="21" cy="21" r="2.3" fill="var(--bg)" />
      <path d="M20.2 9.2 L11.6 22.8" stroke="var(--bg)" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  )
}
