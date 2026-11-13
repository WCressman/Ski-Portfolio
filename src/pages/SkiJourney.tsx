import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Polaroid } from '../polaroid'
import { PageNav } from './TrailPage'
import { journey } from '../data/skiJourney'
import './journey.css'

/*
  How it works
  ------------
  The section is much taller than the screen, but everything you see sits in
  a `position: sticky` stage that stays pinned while you scroll through it. So
  the page never appears to move: scrolling only moves a progress value, and
  that progress draws the dashed trail, develops the next polaroid and glides
  the "camera" down the trail. Scrolling back up plays it all in reverse.
  Once the last polaroid is in, the section ends and normal scrolling resumes.

  Progress is counted in steps: step i is "draw trail i, then reveal stop i+1".
*/

/** Scroll distance for one step, as a fraction of the window height. */
const STEP = 0.8
/** Extra steps of scrolling at the end, so the last polaroid can settle. */
const END_HOLD = 0.4
/** Within a step: the trail draws over this much of it... */
const DRAW_END = 0.7
/** ...and the next polaroid appears over this window. It's solid well before
    the trail reaches it (see .journey__stop opacity), so the trail's end is
    always hidden underneath it, even when scrolling slowly. */
const REVEAL_START = 0.3
const REVEAL_LEN = 0.4

/** Small, alternating tilts so the polaroids look casually pinned. */
const tilts = [-3, 2.5, -2, 3, -1.5, 2]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (t: number) => t * t * (3 - 2 * t)

/** w/h: the stage the trail is seen through; top: the title's height. */
type Size = { w: number; h: number; top: number; win: number }

/** Where every polaroid, trail segment and the closing note go, for a given
    viewport size. `noteH` is the note's measured height. */
function layout(n: number, size: Size, ratio: number, noteH: number) {
  const { w: vw, top } = size
  const vh = size.h - top
  const W = Math.round(Math.min(270, Math.max(150, Math.min(vw * 0.34, vh * 0.5))))
  const H = W * ratio
  const off = Math.max(0, Math.min(vw * 0.2, 240, vw / 2 - W / 2 - 16))
  // Room between a left and a right polaroid? Then trails leave from the
  // side and carve a turn down to the next one; otherwise (phones) they run
  // from the bottom of one to the top of the next.
  const side = 2 * off - W >= 40
  const dy = side ? H * 0.62 + 90 : H + 80

  const stops = Array.from({ length: n }, (_, i) => ({
    x: vw / 2 + (i % 2 === 0 ? -off : off),
    y: top + 20 + H / 2 + i * dy,
  }))

  const trails = stops.slice(1).map((b, i) => {
    const a = stops[i]
    const ex = b.x
    // Both ends tuck under the polaroids (which sit on top of the trail), so
    // the line runs right up to each photo instead of stopping short.
    const ey = b.y - H / 2 + H * 0.3
    if (side) {
      const dir = Math.sign(b.x - a.x) || 1
      const sx = a.x + dir * W * 0.25
      const sy = a.y + H * 0.1
      return `M ${sx} ${sy} C ${sx + (ex - sx) * 0.7} ${sy}, ${ex} ${ey - (ey - sy) * 0.55}, ${ex} ${ey}`
    }
    const sx = a.x
    const sy = a.y + H * 0.25
    const k = (ey - sy) * 0.6
    return `M ${sx} ${sy} C ${sx} ${sy + k}, ${ex} ${ey - k}, ${ex} ${ey}`
  })

  // The closing note sits centred under the last polaroid; the camera glides
  // down to it as one final step.
  const noteY = stops[n - 1].y + H / 2 + 70 + noteH / 2
  // Room under the note: the viewport's 56px bottom fade (journey.css) plus
  // slack for its tilt, so it ends fully clear of the fade.
  const height = noteY + noteH / 2 + 120
  // Where the camera centres at each step: every polaroid, then the note.
  const focus = [...stops.map((s) => s.y), noteY]
  return { W, H, stops, trails, noteY, focus, height }
}

export function SkiJourney() {
  const n = journey.length
  // One step per trail between polaroids, plus one to glide to the note.
  const steps = n

  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<SVGCircleElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const firstStopRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLElement>(null)
  const stopRefs = useRef<(HTMLDivElement | null)[]>([])
  const maskRefs = useRef<(SVGPathElement | null)[]>([])

  const [size, setSize] = useState<Size>({ w: 1000, h: 800, top: 120, win: 800 })
  /** Polaroid height / width, measured from the first one. */
  const [ratio, setRatio] = useState(1.22)
  /** Closing note height, measured (it depends on the text wrapping). */
  const [noteH, setNoteH] = useState(300)

  // Track the space the trail has, and the real polaroid proportions.
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const first = firstStopRef.current
    if (!viewport || !first) return
    const update = () => {
      // A hidden tab can report 0 sizes; keep the last good ones then.
      if (!window.innerHeight || !viewport.clientWidth) return
      setSize({
        w: viewport.clientWidth,
        h: viewport.clientHeight,
        top: headerRef.current?.offsetHeight ?? 0,
        win: window.innerHeight,
      })
      if (first.offsetWidth) setRatio(first.offsetHeight / first.offsetWidth)
      if (noteRef.current?.offsetHeight) setNoteH(noteRef.current.offsetHeight)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(viewport)
    ro.observe(first)
    if (noteRef.current) ro.observe(noteRef.current)
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const geo = layout(n, size, ratio, noteH)
  const stepPx = size.win * STEP
  const sectionHeight = size.win + (steps + END_HOLD) * stepPx

  // Scroll -> progress -> trail, polaroids and camera. Runs outside React
  // (straight onto the elements) so it stays smooth at 60fps.
  useEffect(() => {
    const section = sectionRef.current
    const world = worldRef.current
    if (!section || !world) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let shown = -1
    let target = 0
    let frame = 0
    let last = 0

    const readTarget = () => {
      const scrolled = -section.getBoundingClientRect().top
      target = Math.min(steps + END_HOLD, Math.max(0, scrolled / stepPx || 0))
    }

    const apply = (p: number) => {
      // trails
      let head: DOMPoint | null = null
      maskRefs.current.forEach((path, i) => {
        if (!path) return
        const draw = clamp01((p - i) / DRAW_END)
        path.style.strokeDashoffset = String(1 - draw)
        if (draw > 0 && draw < 1) head = path.getPointAtLength(path.getTotalLength() * draw)
      })
      const dot = headRef.current
      if (dot) {
        const pt = head as DOMPoint | null
        dot.style.opacity = pt ? '1' : '0'
        if (pt) {
          dot.setAttribute('cx', String(pt.x))
          dot.setAttribute('cy', String(pt.y))
        }
      }

      // polaroids (the first one is there from the start)
      stopRefs.current.forEach((el, i) => {
        if (!el || i === 0) return
        const r = clamp01((p - (i - 1) - REVEAL_START) / REVEAL_LEN)
        el.style.setProperty('--r', r.toFixed(3))
      })

      // closing note: fades in during the last step, like a polaroid
      const note = noteRef.current
      if (note) {
        const r = clamp01((p - (n - 1) - REVEAL_START) / REVEAL_LEN)
        note.style.setProperty('--r', r.toFixed(3))
      }

      // camera: glide from one stop to the next as the trail is drawn,
      // and finally from the last polaroid down to the note
      const i = Math.max(0, Math.min(Math.floor(p), steps - 1)) || 0
      const t = smooth(clamp01((p - i) / 0.9))
      const a = geo.focus[i]
      const b = geo.focus[i + 1] ?? a
      if (a === undefined) return
      const focus = a + (b - a) * t
      const maxCam = Math.max(0, geo.height - size.h)
      // keep the focus centred on screen (the title scrolls away with the
      // trail, so the whole height is free once the camera moves)
      const cam = Math.min(maxCam, Math.max(0, focus - size.h * 0.5))
      world.style.transform = `translate3d(0, ${-cam}px, 0)`

      if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp01(p / 0.25))
    }

    // Eases the shown progress toward the scroll position, so wheel clicks
    // glide instead of jumping. Time-based, so it feels the same at any fps.
    const tick = (now = performance.now()) => {
      frame = 0
      const dt = last ? Math.min(100, now - last) : 16
      last = now
      const k = 1 - Math.exp(-dt / 90)
      const next = reduced || shown < 0 ? target : shown + (target - shown) * k
      shown = Math.abs(target - next) < 0.0005 ? target : next
      apply(shown)
      if (shown !== target) frame = requestAnimationFrame(tick)
      else last = 0
    }

    const onScroll = () => {
      readTarget()
      if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    readTarget()
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [geo, n, size.h, stepPx, steps])

  return (
    <>
      <PageNav fixed />
      <section className="journey" ref={sectionRef} style={{ height: sectionHeight }}>
        <div className="journey__stage">
          <div className="journey__viewport" ref={viewportRef}>
            <div
              className="journey__world"
              ref={worldRef}
              style={{ height: geo.height, '--w': `${geo.W}px` } as CSSProperties}
            >
              {/* The title sits at the top of the trail and scrolls away
                  with it, instead of staying pinned to the screen. */}
              <header className="trail-hero trail-hero--compact" ref={headerRef}>
                <h1>the ski journey</h1>
              </header>

              <svg className="journey__trail" width="100%" height={geo.height} aria-hidden="true">
                <defs>
                  {geo.trails.map((d, i) => (
                    <mask key={i} id={`journey-mask-${i}`} maskUnits="userSpaceOnUse"
                      x="0" y="0" width={size.w} height={geo.height}>
                      <path
                        ref={(el) => { maskRefs.current[i] = el }}
                        d={d}
                        pathLength={1}
                        className="journey__mask"
                      />
                    </mask>
                  ))}
                </defs>
                {geo.trails.map((d, i) => (
                  <g key={i} mask={`url(#journey-mask-${i})`}>
                    <path d={d} className="journey__halo" />
                    <path d={d} className="journey__dash" />
                  </g>
                ))}
                <circle ref={headRef} r="5" className="journey__head" />
              </svg>

              {journey.map((stop, i) => (
                <div
                  key={i}
                  className="journey__stop"
                  ref={(el) => {
                    stopRefs.current[i] = el
                    if (i === 0) firstStopRef.current = el
                  }}
                  style={{
                    left: geo.stops[i].x,
                    top: geo.stops[i].y,
                    '--r': i === 0 ? 1 : 0,
                  } as CSSProperties}
                >
                  <Polaroid
                    photo={stop.photo}
                    focus={stop.focus}
                    caption={stop.caption}
                    subcaption={stop.subcaption}
                    tilt={tilts[i % tilts.length]}
                  />
                </div>
              ))}

              {/* Closing note: the camera glides down to it as the last step. */}
              <aside
                className="journey__note"
                ref={noteRef}
                style={{ top: geo.noteY, '--r': 0 } as CSSProperties}
              >
                <p>
                  grateful to lead a life that brings me back to the mountain time and time again.
                  enormous thank you to my wonderful mummy, who taught me to ski, spent thousands of
                  hours driving me every weekend, paid for everything and gave me a passion to
                  look forward to year round.
                </p>
                <p>
                  excited for the winters to come, and hoping to maybe one day become a heli ski
                  instructor. until then, happy shredding!
                </p>
              </aside>
            </div>
          </div>

          <p className="journey__hint" ref={hintRef}>
            scroll to ski down
            <span aria-hidden="true">↓</span>
          </p>
        </div>
      </section>
    </>
  )
}
