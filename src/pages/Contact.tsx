import { useEffect, useRef, useState } from 'react'
import { TrailPage } from './TrailPage'
import './contact.css'

// TODO: replace with your real address and profile URL.
const EMAIL = 'cressmanwn@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/william-cressman/'

/** Copies text, falling back to a hidden textarea where the Clipboard API
    is missing (older browsers, or pages not served over HTTPS). */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

/** Contact: one paper card with an email and a LinkedIn link. */
export function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Copy the address on click, then let the mailto: link open as usual.
  // If no mail app is set up, the address is still on the clipboard.
  const handleEmailClick = () => {
    void copyText(EMAIL).then((ok) => {
      if (!ok) return
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 4000)
    })
  }

  return (
    <TrailPage title="chairlift chat" bare compact>
      <div className="ct-view">
      <section className="ct-card">
        <h2 className="ct-card__heading">say hi!</h2>
        <ul className="ct-links">
          <li>
            <a href={`mailto:${EMAIL}`} onClick={handleEmailClick}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
              </svg>
              <span>
                <span className="ct-links__label">Gmail</span>
                <span className="ct-links__value" aria-live="polite">
                  {copied ? 'copied to clipboard!' : EMAIL}
                </span>
              </span>
            </a>
          </li>
          <li>
            <a href={LINKEDIN} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M8 10.5V16M8 7.75v.01M11.5 16v-5.5M11.5 13c0-1.5 1-2.5 2.25-2.5S16 11.25 16 13v3" />
              </svg>
              <span>
                <span className="ct-links__label">LinkedIn</span>
                <span className="ct-links__value">connect with me ↗</span>
              </span>
            </a>
          </li>
        </ul>
      </section>
      </div>
    </TrailPage>
  )
}
