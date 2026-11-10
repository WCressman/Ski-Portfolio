import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { TrailPage } from './TrailPage'
import { projects, type Project } from '../data/projects'
import './projects.css'

const count = projects.length

/**
 * Shortest signed distance from the selected project to project k, going
 * around the loop: -1 is just left, +1 just right. With 6 projects it's
 * always between -3 and +2.
 */
function loopOffset(k: number, selected: number) {
  const half = Math.floor(count / 2)
  return ((((k - selected + half) % count) + count) % count) - half
}

export function Projects() {
  const [selected, setSelected] = useState(0)
  const swipeStart = useRef<number | null>(null)

  // Wraps around in both directions: left of the first is the last.
  const step = (dir: -1 | 1) => setSelected((i) => (i + dir + count) % count)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const el = e.target as HTMLElement
      if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
      if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Swipe left / right on touch screens.
  function onPointerDown(e: PointerEvent) {
    if (e.pointerType !== 'mouse') swipeStart.current = e.clientX
  }
  function onPointerUp(e: PointerEvent) {
    if (swipeStart.current === null) return
    const dx = e.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
  }

  return (
    // The gallery is the whole page, so it sits right under the title and
    // everything fits on one screen.
    <TrailPage title="projects" bare compact>
      <section className="pj-view">
        <div
          className="pj-gallery"
          role="region"
          aria-roledescription="carousel"
          aria-label="Projects"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          <div className="pj-track">
            {projects.map((p, k) => {
              const offset = loopOffset(k, selected)
              const position =
                offset === 0 ? 'current' : Math.abs(offset) === 1 ? 'side' : 'away'
              return (
                <button
                  key={p.title}
                  type="button"
                  className={`pj-slide pj-slide--${position}`}
                  style={{ '--offset': offset } as CSSProperties}
                  // Only the selected one and its two neighbours are reachable.
                  tabIndex={position === 'away' ? -1 : 0}
                  aria-hidden={position === 'away'}
                  aria-current={offset === 0}
                  aria-label={offset === 0 ? p.title : `Show ${p.title}`}
                  onClick={() => offset !== 0 && setSelected(k)}
                >
                  <Icon project={p} />
                  <span className="pj-slide__title">{p.title}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="pj-arrow pj-arrow--prev"
            onClick={() => step(-1)}
            aria-label="Previous project"
          >
            ←
          </button>
          <button
            type="button"
            className="pj-arrow pj-arrow--next"
            onClick={() => step(1)}
            aria-label="Next project"
          >
            →
          </button>
        </div>

        {/* Every project's details sit stacked in the same spot, with only the
            selected one visible. The box is always as tall as the longest, so
            switching crossfades without anything below jumping around. */}
        <div className="pj-details" aria-live="polite">
          {projects.map((p, k) => (
            <article
              key={p.title}
              className={`pj-detail ${k === selected ? 'is-selected' : ''}`}
              aria-hidden={k !== selected}
            >
              {/* The title is already under the icon, so the details start with
                  the headline number. */}
              {p.highlight && <p className="pj-detail__highlight">{p.highlight}</p>}
              <p className="pj-detail__meta">
                {p.dates}
                {p.stack.map((s) => (
                  <span key={s} className="pj-tag">
                    {s}
                  </span>
                ))}
              </p>
              <ul>
                {p.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
              {p.link && (
                <a
                  className="pj-detail__link"
                  href={p.link.href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={k === selected ? 0 : -1}
                >
                  {p.link.label} ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </TrailPage>
  )
}

/** A project's icon, or a rounded tile with its initials until it has one. */
function Icon({ project }: { project: Project }) {
  if (project.icon) {
    return (
      <span className="pj-icon">
        <img src={project.icon} alt="" />
      </span>
    )
  }
  const initials = project.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return (
    <span className="pj-icon pj-icon--placeholder" style={{ background: project.tint }}>
      {initials}
    </span>
  )
}
