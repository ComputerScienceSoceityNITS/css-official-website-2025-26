import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------
   ARCH motion language
   ------------------------------------------------------------------
   Slow, heavily eased, architectural. Nothing bounces except the
   things a finger actually touches.
------------------------------------------------------------------ */

export const ARCH_EASE = 'power4.out'
export const ARCH_EASE_CSS = [0.16, 1, 0.3, 1]

/* Framer Motion presets ------------------------------------------- */

export const archSpring = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }
export const archSpringSoft = { type: 'spring', stiffness: 140, damping: 24, mass: 1 }
export const archTween = { duration: 0.8, ease: ARCH_EASE_CSS }

export const archFadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: archTween,
}

export const archStagger = (i = 0, step = 0.06) => ({ ...archTween, delay: i * step })

/* ------------------------------------------------------------------
   useArchReveal(scopeRef, deps)

   Scans the scope for declarative hooks and wires ScrollTrigger:

     data-arch="mask"      bottom-to-top clip-path unmasking (images)
     data-arch="fade"      slow fade + rise
     data-arch="lines"     line-by-line stagger of child .arch-line-inner
     data-arch="parallax"  slow drift, tuned with data-arch-speed
     data-arch-delay="0.2" optional per-element delay

   Everything is scoped through gsap.context so re-renders and unmounts
   clean up after themselves.
------------------------------------------------------------------ */

export function useArchReveal(scopeRef, deps = []) {
  useLayoutEffect(() => {
    const root = scopeRef?.current
    if (!root) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-arch="mask"]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
          {
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
            duration: 1.4,
            ease: ARCH_EASE,
            delay: parseFloat(el.dataset.archDelay || 0),
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        )
      })

      gsap.utils.toArray('[data-arch="fade"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: ARCH_EASE,
            delay: parseFloat(el.dataset.archDelay || 0),
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          }
        )
      })

      gsap.utils.toArray('[data-arch="lines"]').forEach((el) => {
        const lines = el.querySelectorAll('.arch-line-inner')
        if (!lines.length) return
        gsap.fromTo(
          lines,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: ARCH_EASE,
            stagger: 0.09,
            delay: parseFloat(el.dataset.archDelay || 0),
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          }
        )
      })

      /* count-up numbers */
      gsap.utils.toArray('[data-arch="count"]').forEach((el) => {
        const target = parseFloat(el.dataset.archTo || el.textContent.replace(/[^0-9.]/g, '')) || 0
        const suffix = el.dataset.archSuffix || ''
        const pad = parseInt(el.dataset.archPad || 0, 10)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: ARCH_EASE,
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          onUpdate: () => {
            const n = Math.round(obj.v)
            el.textContent = (pad ? String(n).padStart(pad, '0') : String(n)) + suffix
          },
        })
      })

      /* letter-spacing / scale drift on a pinned heading */
      gsap.utils.toArray('[data-arch="drift"]').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.06, opacity: 0.85 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'top 40%',
              scrub: 1,
            },
          }
        )
      })

      gsap.utils.toArray('[data-arch="parallax"]').forEach((el) => {
        const speed = parseFloat(el.dataset.archSpeed || 0.12)
        gsap.fromTo(
          el,
          { yPercent: -speed * 100 },
          {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          }
        )
      })
    }, root)

    ScrollTrigger.refresh()
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* Convenience: returns a ref to spread on the section root. */
export function useArchScope(deps = []) {
  const scope = useRef(null)
  useArchReveal(scope, deps)
  return scope
}

/* ------------------------------------------------------------------
   useArchProgress(ref) — scrubs a fixed rail across full page scroll.
------------------------------------------------------------------ */

export function useArchProgress(barRef, deps = []) {
  useLayoutEffect(() => {
    const bar = barRef?.current
    if (!bar) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })
    })

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
