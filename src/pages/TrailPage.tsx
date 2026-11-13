import type { ReactNode } from 'react'
// Trying the Armada Whitewalkers; the old design is still in ReturnHome.webp.
import returnHomeSkis from '../assets/ReturnHomeWhitewalkers.webp'
import { navigate } from '../router'

type TrailPageProps = {
  title: string
  children: ReactNode
  /** Render children as-is instead of inside the white text card. */
  bare?: boolean
  /** Shrink the space under the title so the content moves up. */
  compact?: boolean
}

/** The "return home" skis in the top-left corner. `fixed` keeps them on
    screen while the page scrolls (used by the ski journey). */
export function PageNav({ fixed = false }: { fixed?: boolean }) {
  return (
    <nav className={`page-nav ${fixed ? 'page-nav--fixed' : ''}`}>
      <button type="button" className="return-home" onClick={() => navigate('home')}>
        <img src={returnHomeSkis} alt="" width={280} height={45}/>
        <span>return home</span>
      </button>
    </nav>
  )
}

export function TrailPage({ title, children, bare = false, compact = false }: TrailPageProps) {
  return (
    <>
      <PageNav />
      <header className={`trail-hero ${compact ? 'trail-hero--compact' : ''}`}>
        <h1>{title}</h1>
      </header>
      {bare ? children : <article className="trail-card">{children}</article>}
    </>
  )
}
