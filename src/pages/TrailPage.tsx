import type { ReactNode } from 'react'
import returnHomeSkis from '../assets/ReturnHome.webp'
import { navigate } from '../router'

type TrailPageProps = {
  title: string
  children: ReactNode
  /** Render children as-is instead of inside the white text card. */
  bare?: boolean
  /** Shrink the space under the title so the content moves up. */
  compact?: boolean
}

export function TrailPage({ title, children, bare = false, compact = false }: TrailPageProps) {
  return (
    <>
      <nav className="page-nav">
        <button type="button" className="return-home" onClick={() => navigate('home')}>
          <img src={returnHomeSkis} alt="" width={280} height={50}/>
          <span>return home</span>
        </button>
      </nav>
      <header className={`trail-hero ${compact ? 'trail-hero--compact' : ''}`}>
        <h1>{title}</h1>
      </header>
      {bare ? children : <article className="trail-card">{children}</article>}
    </>
  )
}
