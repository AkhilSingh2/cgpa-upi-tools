export function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sutra-sr"> (opens in a new tab)</span>
    </a>
  )
}
