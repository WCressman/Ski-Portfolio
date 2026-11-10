import type { CSSProperties, ReactNode } from 'react'
import './polaroid.css'

type PolaroidProps = {
  /** Photo or logo; without one, a tile in `tint` shows `placeholder`. */
  photo?: string
  /** 'cover' fills the square (photos); 'contain' fits it with a margin (logos). */
  fit?: 'cover' | 'contain'
  /** Which part of a photo stays in the square crop (CSS object-position). */
  focus?: string
  tint?: string
  placeholder?: ReactNode
  /** Handwritten caption under the photo. */
  caption: ReactNode
  subcaption?: ReactNode
  /** Tilt in degrees, for the casually-pinned look. */
  tilt?: number
  className?: string
  style?: CSSProperties
}

/** White instant-photo frame with a handwritten caption. */
export function Polaroid({
  photo,
  fit = 'cover',
  focus,
  tint = '#333',
  placeholder,
  caption,
  subcaption,
  tilt = 0,
  className = '',
  style,
}: PolaroidProps) {
  return (
    <figure
      className={`polaroid ${className}`}
      style={{ '--tilt': `${tilt}deg`, ...style } as CSSProperties}
    >
      <div className={`polaroid__photo polaroid__photo--${fit}`} style={{ background: tint }}>
        {photo ? (
          <img src={photo} alt="" style={focus ? { objectPosition: focus } : undefined} />
        ) : (
          <span>{placeholder}</span>
        )}
      </div>
      <figcaption className="polaroid__caption">
        <span className="polaroid__title">{caption}</span>
        {subcaption && <span className="polaroid__sub">{subcaption}</span>}
      </figcaption>
    </figure>
  )
}
