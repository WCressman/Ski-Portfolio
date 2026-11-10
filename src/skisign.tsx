import type { ReactNode } from 'react'
import './skisign.css'

/** Trail difficulty: sets both the board paint and the badge symbol. */
export type Difficulty = 'green' | 'blue' | 'black' | 'double-black'

const symbols: Record<Difficulty, ReactNode> = {
  green: <circle cx="50" cy="50" r="30" />,
  blue: <rect x="20" y="20" width="60" height="60" />,
  black: <polygon points="50,10 74,50 50,90 26,50" />,
  'double-black': (
    <>
      <polygon points="28,14 47,50 28,86 9,50" />
      <polygon points="72,14 91,50 72,86 53,50" />
    </>
  ),
}

type SkiSignProps = {
  difficulty: Difficulty
  children: ReactNode
  /** Renders the sign as a link when set, otherwise as a button. */
  href?: string
  onClick?: () => void
}

export function SkiSign({ difficulty, children, href, onClick }: SkiSignProps) {
  const content = (
    <>
      <span className="skisign__badge" aria-hidden="true">
        <svg viewBox="0 0 100 100">{symbols[difficulty]}</svg>
      </span>
      <span className="skisign__label">{children}</span>
    </>
  )

  const className = `skisign skisign--${difficulty}`

  return href ? (
    <a className={className} href={href} onClick={onClick}>
      {content}
    </a>
  ) : (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  )
}

/** Vertical stack of signs, like a trail post. */
export function SkiSignPost({ children }: { children: ReactNode }) {
  return <nav className="skisign-post">{children}</nav>
}
