import React from 'react'

/**
 * ArchChars — splits a string into per-character masked spans so GSAP can
 * stagger them upward.
 *
 * The split is done in JSX rather than by rewriting innerHTML in the hook:
 * a DOM-level split can be clobbered the next time React reconciles the
 * heading, and these titles sit in components that re-render on load state.
 *
 * Pair with `data-arch="chars"` on an ancestor — the hook animates
 * `.arch-char-inner` inside it.
 */
export const ArchChars = ({ text = '', className = '' }) => (
  <span className={`arch-chars   ${className}`}>
    <span className="sr-only">{text}</span>
    {Array.from(text).map((ch, i) =>
      ch === ' ' ? (
        <span key={i} className="arch-char-space" aria-hidden="true">
          {' '}
        </span>
      ) : (
        <span key={i} className="arch-char" aria-hidden="true">
          <span className="arch-char-inner">{ch}</span>
        </span>
      )
    )}
  </span>
)

export default ArchChars
