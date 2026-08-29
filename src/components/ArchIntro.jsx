import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ARCH_EASE } from '../hooks/useArchAnim'

/**
 * ArchIntro — the entrance sequence.
 *
 *   1. a line-drawn workstation draws itself in
 *   2. the screen boots (scan lines + a progress rail)
 *   3. "Welcome to CSS" types out underneath
 *   4. the two halves part like curtains and reveal the page
 *
 * Purely presentational. `ready` says the page behind is loaded;
 * `onDone` unmounts the overlay once the curtains have opened.
 */
const TYPED_TEXT = 'Welcome to CSS'

const ArchIntro = ({ progress = 0, ready = false, onDone }) => {
  const rootRef = useRef(null)
  const artRef = useRef(null)
  const typeRef = useRef(null)
  const caretRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const seamRef = useRef(null)
  const stageRef = useRef(null)
  const barRef = useRef(null)
  const doneRef = useRef(false)

  // The parent passes an inline arrow, so `onDone` has a new identity every
  // render. Holding it in a ref keeps it out of the effect deps below — with
  // it in there, any parent re-render during the curtain animation re-ran the
  // effect, whose cleanup killed the timeline, while the doneRef guard made
  // the re-run bail out. The curtains froze and onDone never fired, leaving
  // the overlay up and body scroll locked. That was the intermittent freeze.
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const [typed, setTyped] = useState(false)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---- draw + type ------------------------------------------------ */
  useLayoutEffect(() => {
    if (reduced) {
      if (typeRef.current) typeRef.current.textContent = TYPED_TEXT
      setTyped(true)
      return undefined
    }

    const ctx = gsap.context(() => {
      const strokes = gsap.utils.toArray('[data-draw]')

      strokes.forEach((el) => {
        const len = el.getTotalLength ? el.getTotalLength() : 400
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
      })

      const tl = gsap.timeline({ onComplete: () => setTyped(true) })

      tl.to(strokes, {
        strokeDashoffset: 0,
        duration: 1.15,
        ease: ARCH_EASE,
        stagger: 0.07,
      })
        .from(
          '[data-scan]',
          { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: ARCH_EASE, stagger: 0.08 },
          '-=0.35'
        )
        .from('[data-cursor]', { opacity: 0, duration: 0.2 }, '-=0.2')

      /* typewriter */
      const counter = { i: 0 }
      tl.to(
        counter,
        {
          i: TYPED_TEXT.length,
          duration: 1.15,
          ease: 'none',
          onUpdate: () => {
            if (typeRef.current) {
              typeRef.current.textContent = TYPED_TEXT.slice(0, Math.round(counter.i))
            }
          },
        },
        '-=0.1'
      )

      /* blinking caret runs until the exit */
      gsap.to(caretRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)',
      })

      /* screen scan sweep, loops while we wait */
      gsap.to('[data-sweep]', {
        yPercent: 900,
        duration: 2.4,
        repeat: -1,
        ease: 'none',
        delay: 1.2,
      })
    }, rootRef)

    // If rAF is throttled (background tab) the timeline can stall and its
    // onComplete never fires, so the sequence would wait forever. Move on.
    const typedFailsafe = setTimeout(() => setTyped(true), 6000)

    return () => {
      clearTimeout(typedFailsafe)
      ctx.revert()
    }
  }, [reduced])

  /* ---- progress rail --------------------------------------------- */
  useEffect(() => {
    if (!barRef.current) return
    gsap.to(barRef.current, {
      scaleX: Math.min(100, progress) / 100,
      duration: 0.5,
      ease: ARCH_EASE,
      overwrite: true,
    })
  }, [progress])

  /* ---- curtains --------------------------------------------------- */
  useEffect(() => {
    if (!typed || !ready || doneRef.current) return
    doneRef.current = true

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      onDone?.()
      return
    }

    const tl = gsap.timeline({
      onComplete: () => onDone?.(),
    })

    tl.to(stageRef.current, {
      opacity: 0,
      y: -18,
      duration: 0.55,
      ease: ARCH_EASE,
    })
      .to(seamRef.current, { opacity: 1, duration: 0.25 }, '-=0.35')
      .to(
        [leftRef.current, rightRef.current],
        {
          xPercent: (i) => (i === 0 ? -100 : 100),
          duration: 1.25,
          ease: 'power4.inOut',
        },
        '-=0.05'
      )
      .to(seamRef.current, { opacity: 0, duration: 0.3 }, '-=1.1')

    // Last resort: the page must never stay locked behind a stalled tween.
    const failsafe = setTimeout(() => onDoneRef.current?.(), 4000)

    return () => {
      clearTimeout(failsafe)
      tl.kill()
    }
    // onDone is intentionally NOT a dependency — it is read through
    // onDoneRef. Adding it back reintroduces the freeze: the parent
    // passes an inline arrow, so every re-render would re-run this
    // effect, its cleanup would kill the exit timeline, and the
    // doneRef guard would stop a replacement ever starting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, ready, reduced])

  return (
    <div ref={rootRef} className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Curtain halves */}
      <div ref={leftRef} className="absolute inset-y-0 left-0 w-1/2 bg-arch-bg" />
      <div ref={rightRef} className="absolute inset-y-0 right-0 w-1/2 bg-arch-bg" />

      {/* Seam hairline */}
      <div
        ref={seamRef}
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-arch-line opacity-0"
      />

      {/* Stage */}
      <div
        ref={stageRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
      >
        {/* Workstation */}
        <svg
          ref={artRef}
          viewBox="0 0 260 200"
          className="w-[220px] md:w-[280px]"
          fill="none"
          stroke="#1C1C1C"
          strokeWidth="1.5"
          strokeLinecap="square"
        >
          {/* screen contents (clipped) */}
          <defs>
            <clipPath id="arch-screen">
              <rect x="31" y="17" width="198" height="112" />
            </clipPath>
          </defs>

          <g clipPath="url(#arch-screen)">
            <rect data-sweep x="31" y="10" width="198" height="2" fill="#1C1C1C" opacity="0.14" stroke="none" />
            <rect data-scan x="46" y="40" width="120" height="2" fill="#1C1C1C" stroke="none" />
            <rect data-scan x="46" y="52" width="86" height="2" fill="#1C1C1C" opacity="0.55" stroke="none" />
            <rect data-scan x="46" y="64" width="140" height="2" fill="#1C1C1C" opacity="0.35" stroke="none" />
            <rect data-scan x="46" y="76" width="64" height="2" fill="#1C1C1C" opacity="0.55" stroke="none" />
            <rect data-cursor x="46" y="94" width="9" height="12" fill="#1C1C1C" stroke="none" />
          </g>

          {/* monitor */}
          <rect data-draw x="30" y="16" width="200" height="114" />
          <path data-draw d="M30 30 H230" opacity="0.45" />
          <circle data-draw cx="40" cy="23" r="2" />

          {/* stand + base */}
          <path data-draw d="M118 130 V150 M142 130 V150" />
          <path data-draw d="M96 152 H164" />

          {/* keyboard */}
          <path data-draw d="M56 170 H204 L214 186 H46 Z" />
          <path data-draw d="M72 178 H188" opacity="0.45" />
        </svg>

        {/* Typewriter */}
        <div className="mt-12 flex items-baseline justify-center">
          <h1
            ref={typeRef}
            className="arch-title text-[clamp(1.75rem,5vw,3.25rem)] text-arch-ink"
          />
          <span
            ref={caretRef}
            className="ml-1.5 inline-block h-[0.95em] w-[3px] translate-y-[0.08em] bg-arch-ink"
          />
        </div>

        {/* Progress rail */}
        <div className="mt-14 w-[220px] md:w-[280px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="arch-label">Computer Science Society</span>
            <span className="arch-label arch-num">
              {String(Math.min(100, Math.round(progress))).padStart(3, '0')}
            </span>
          </div>
          <div className="h-px w-full bg-arch-line">
            <div
              ref={barRef}
              className="h-px w-full origin-left scale-x-0 bg-arch-ink"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ArchIntro)
