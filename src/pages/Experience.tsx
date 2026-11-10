import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react'

import { TrailPage } from './TrailPage'
import { Polaroid } from '../polaroid'
import {
  categories,
  type Category,
  type CategoryId,
  type Experience as ExperienceEntry,
} from '../data/experience'
import './experience.css'

/** Small, repeating tilts so the polaroids look casually laid down. */
const tilts = [-2, 1.5, -1, 2.5]

/** Initials for a tile with no logo, e.g. "CSIA Level 2" -> "CL". */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/** How long the old view takes to fade out before the new one appears. */
const FADE_MS = 200

export function Experience() {
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null)
  /** True while the current view fades out, just before switching. */
  const [leaving, setLeaving] = useState(false)
  const category = categories.find((c) => c.id === categoryId)

  // Fade out, switch while nothing is visible (so the layout change can't be
  // seen), then the new view fades in on its own (see .xp-fade in the CSS).
  function switchTo(id: CategoryId | null) {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(
      () => {
        setCategoryId(id)
        setLeaving(false)
      },
      reducedMotion() ? 0 : FADE_MS,
    )
  }

  return (
    // Once a category is open, the photos take over: the space that showed
    // you in the background photo closes and they sit right under the title.
    <TrailPage title="work experience" bare compact={!!category}>
      <div
        className={`xp-fade ${category ? 'xp-fade--category' : ''} ${leaving ? 'is-leaving' : ''}`}
        key={categoryId ?? 'picker'}
      >
        {category ? (
          <CategoryView category={category} onBack={() => switchTo(null)} />
        ) : (
          <CategoryPicker onPick={switchTo} />
        )}
      </div>
    </TrailPage>
  )
}

function CategoryPicker({ onPick }: { onPick: (id: CategoryId) => void }) {
  return (
    <section className="xp-picker" aria-label="Choose a kind of experience">
      {categories.map((c, i) => (
        <button
          key={c.id}
          type="button"
          className="xp-choice"
          onClick={() => onPick(c.id)}
        >
          <Polaroid
            photo={c.photo}
            focus={c.photoFocus}
            tint={c.tint}
            placeholder="</>"
            caption={c.label}
            subcaption={c.blurb}
            tilt={i % 2 === 0 ? -4 : 3}
          />
        </button>
      ))}
    </section>
  )
}

function CategoryView({ category, onBack }: { category: Category; onBack: () => void }) {
  const [index, setIndex] = useState(0)
  /** Whether the details card is open over the page. */
  const [open, setOpen] = useState(false)
  const items = category.experiences
  const last = items.length - 1
  const current = items[index]
  const tilt = tilts[index % tilts.length]

  /** The current polaroid in the carousel; the details card grows out of it. */
  const currentRef = useRef<HTMLDivElement>(null)

  const step = (dir: -1 | 1) => setIndex((i) => Math.max(0, Math.min(last, i + dir)))

  // The page is now short enough to fit on screen, so just go to the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Arrow keys step through experiences (also while the details card is open).
  // Escape goes back to the categories; the open card handles its own Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const el = e.target as HTMLElement
      if (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return

      if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'Escape' && !open) onBack()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function openOnKey(e: ReactKeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
    }
  }

  return (
    <section className="xp-view">
      <button type="button" className="xp-back" onClick={onBack}>
        ← categories
      </button>

      <div
        className={`xp-carousel ${open ? 'is-open' : ''}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={category.label}
      >
        <button
          type="button"
          className="xp-arrow xp-arrow--prev"
          onClick={() => step(-1)}
          hidden={index === 0}
          aria-label="Previous experience"
        >
          ←
        </button>

        <div className="xp-track">
          {items.map((xp, k) => {
            const offset = k - index
            const isCurrent = offset === 0
            return (
              <div
                key={xp.org}
                className={`xp-slide xp-slide--${slidePosition(offset)}`}
                style={
                  { '--offset': offset, '--card-tilt': `${tilts[k % tilts.length]}deg` } as CSSProperties
                }
                aria-hidden={!isCurrent}
              >
                <div
                  ref={isCurrent ? currentRef : undefined}
                  className="xp-card"
                  // While the details card is open, it stands in for this one.
                  style={isCurrent && open ? { visibility: 'hidden' } : undefined}
                  role={isCurrent ? 'button' : undefined}
                  tabIndex={isCurrent ? 0 : -1}
                  aria-label={isCurrent ? `${xp.org}: show details` : undefined}
                  onClick={() => (isCurrent ? setOpen(true) : step(offset < 0 ? -1 : 1))}
                  onKeyDown={isCurrent ? openOnKey : undefined}
                >
                  <Front xp={xp} />
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          className="xp-arrow xp-arrow--next"
          onClick={() => step(1)}
          hidden={index === last}
          aria-label="Next experience"
        >
          →
        </button>

        <p className="xp-hint">click for more details</p>
      </div>

      {open && (
        <DetailCard
          xp={current}
          tilt={tilt}
          source={currentRef}
          canPrev={index > 0}
          canNext={index < last}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onClosed={() => {
            setOpen(false)
            currentRef.current?.focus()
          }}
        />
      )}
    </section>
  )
}

/** Where a slide sits relative to the current one. */
function slidePosition(offset: number) {
  if (offset === 0) return 'current'
  return Math.abs(offset) === 1 ? 'neighbour' : 'hidden'
}

/** Front of an experience polaroid: logo (or initials) and a caption. */
function Front({ xp }: { xp: ExperienceEntry }) {
  return (
    <Polaroid
      photo={xp.logo}
      fit="contain"
      tint={xp.tint}
      placeholder={initials(xp.org)}
      caption={xp.org}
      subcaption={xp.dates}
    />
  )
}

/** How long the details card takes to lift out and turn over. Unhurried,
    since you're about to read it. */
const FLIP_MS = 900
/** Closing is quicker: there's nothing to wait for. */
const CLOSE_MS = 450

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type DetailCardProps = {
  xp: ExperienceEntry
  /** Tilt of the polaroid it grows out of, so the hand-off is seamless. */
  tilt: number
  source: RefObject<HTMLDivElement | null>
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  /** Called once the closing animation has finished. */
  onClosed: () => void
}

/**
 * Details for one experience, centred over the page so the page itself never
 * grows or needs scrolling. It lifts out of the polaroid in the carousel and
 * turns over to show the back.
 *
 * The card is laid out at its final size from the very first frame, and the
 * animation only moves, scales and rotates it, so the text never reflows
 * while it flips.
 */
function DetailCard({ xp, tilt, source, canPrev, canNext, onPrev, onNext, onClosed }: DetailCardProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const closing = useRef(false)

  /** Transform that puts the card exactly on top of the carousel polaroid. */
  function sourceTransform() {
    const card = cardRef.current
    const src = source.current
    if (!card || !src) return 'none'
    const from = src.getBoundingClientRect()
    const to = card.getBoundingClientRect()
    const dx = from.left + from.width / 2 - (to.left + to.width / 2)
    const dy = from.top + from.height / 2 - (to.top + to.height / 2)
    const scale = src.offsetWidth / card.offsetWidth
    return `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${tilt}deg)`
  }

  function animate(forward: boolean) {
    const timing: KeyframeAnimationOptions = {
      duration: reducedMotion() ? 0 : forward ? FLIP_MS : CLOSE_MS,
      easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      direction: forward ? 'normal' : 'reverse',
      fill: forward ? 'none' : 'forwards',
    }
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], timing)
    innerRef.current?.animate(
      [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(180deg)' }],
      timing,
    )
    return cardRef.current?.animate(
      [{ transform: sourceTransform() }, { transform: 'none' }],
      timing,
    )
  }

  useLayoutEffect(() => {
    animate(true)
    cardRef.current?.focus({ preventScroll: true })
    // Only on first open; moving between experiences just swaps the text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function close() {
    if (closing.current) return
    closing.current = true
    animate(false)
    // Unmount after the animation. A timer rather than the animation's own
    // "finished" event, which never fires if the tab is in the background.
    window.setTimeout(onClosed, reducedMotion() ? 0 : CLOSE_MS + 10)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="xp-detail" role="dialog" aria-modal="true" aria-label={`${xp.org} details`}>
      <div ref={backdropRef} className="xp-detail__backdrop" onClick={close} />

      <div className="xp-detail__stage">
        <div ref={cardRef} className="xp-detail__card" tabIndex={-1} onClick={close}>
          <div ref={innerRef} className="xp-detail__inner">
            <div className="xp-detail__face xp-detail__front" aria-hidden>
              <Front xp={xp} />
            </div>
            <div className="xp-detail__face xp-detail__back">
              <h2 className="xp-detail__org">{xp.org}</h2>
              <p className="xp-detail__role">{xp.role}</p>
              <p className="xp-detail__meta">
                {xp.location} · {xp.dates}
              </p>
              <ul className="xp-detail__points">
                {xp.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="xp-detail__controls">
          <button
            type="button"
            className="xp-arrow"
            onClick={onPrev}
            hidden={!canPrev}
            aria-label="Previous experience"
          >
            ←
          </button>
          <p className="xp-hint">click to close</p>
          <button
            type="button"
            className="xp-arrow"
            onClick={onNext}
            hidden={!canNext}
            aria-label="Next experience"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
