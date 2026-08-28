import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ARCH_EASE } from '../hooks/useArchAnim'
import { ArchChars } from './ArchType'

/**
 * ArchPageLoader — the route-level loading panel.
 *
 * Entrance: hairline rails draw out from the centre, the page title rises
 * character by character, a measure rail ticks in.
 * Idle:     the counter creeps to 92 on an easing ramp — never a fake finish.
 * Exit:     the panel is a grid of beige cells that collapse in a diagonal
 *           wave from the top-left, so the page behind is uncovered in a
 *           sweep rather than by a single sliding block. Distinct from the
 *           home intro's curtains on purpose — routes and entrances should
 *           not use the same gesture.
 */
const COLS = 7
const ROWS = 4
const CELLS = COLS * ROWS

const ArchPageLoader = ({
  title = 'Loading',
  label = 'Computer Science Society',
  steps = ['Fetching records', 'Composing layout', 'Ready'],
  ready = false,
  onDone,
}) => {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const cellsRef = useRef([])
  const barRef = useRef(null)
  const countRef = useRef(null)
  const stepRef = useRef(null)
  const progressRef = useRef({ v: 0 })
  const doneRef = useRef(false)

  const [stepIndex, setStepIndex] = useState(0)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const paint = () => {
    const n = Math.round(progressRef.current.v)
    if (countRef.current) countRef.current.textContent = String(n).padStart(3, '0')
    if (barRef.current) gsap.set(barRef.current, { scaleX: n / 100 })
  }

  /* ---- entrance + idle ramp --------------------------------------- */
  useLayoutEffect(() => {
    if (reduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from('[data-loader-rail]', {
        scaleX: 0,
        duration: 0.9,
        ease: ARCH_EASE,
        stagger: 0.06,
      })
        .from(
          '.arch-char-inner',
          { yPercent: 118, duration: 1.05, ease: ARCH_EASE, stagger: 0.028 },
          '-=0.6'
        )
        .from(
          '[data-loader-meta]',
          { opacity: 0, y: 14, duration: 0.65, ease: ARCH_EASE, stagger: 0.07 },
          '-=0.75'
        )

      gsap.to(progressRef.current, {
        v: 92,
        duration: 6,
        ease: 'power2.out',
        onUpdate: paint,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  /* ---- status manifest -------------------------------------------- */
  useEffect(() => {
    if (steps.length < 2) return
    const id = setInterval(() => setStepIndex((i) => (i + 1) % steps.length), 950)
    return () => clearInterval(id)
  }, [steps.length])

  useEffect(() => {
    if (reduced || !stepRef.current) return
    gsap.fromTo(
      stepRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: ARCH_EASE }
    )
  }, [stepIndex, reduced])

  /* ---- exit: diagonal cell wave ------------------------------------ */
  useEffect(() => {
    if (!ready || doneRef.current) return
    doneRef.current = true

    if (reduced) {
      onDone?.()
      return
    }

    const tl = gsap.timeline({ onComplete: () => onDone?.() })

    tl.to(progressRef.current, {
      v: 100,
      duration: 0.4,
      ease: ARCH_EASE,
      onUpdate: paint,
    })
      .to(stageRef.current, { opacity: 0, y: -16, duration: 0.45, ease: ARCH_EASE }, '-=0.12')
      .to(
        cellsRef.current,
        {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 0.75,
          ease: 'power3.inOut',
          stagger: {
            grid: [ROWS, COLS],
            from: 'start',
            axis: null,
            amount: 0.55,
          },
        },
        '-=0.1'
      )

    return () => tl.kill()
  }, [ready, reduced, onDone])

  return (
    <div ref={rootRef} className="fixed inset-0 z-[150] overflow-hidden">
      {/* Collapsing cells */}
      <div
        className="arch-cells"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: CELLS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              cellsRef.current[i] = el
            }}
            className="arch-cell"
          />
        ))}
      </div>

      {/* Panel content */}
      <div
        ref={stageRef}
        className="relative flex h-full flex-col justify-between px-6 pb-10 pt-[76px] md:px-10"
      >
        {/* Top rail */}
        <div>
          <div data-loader-rail className="h-px w-full origin-center bg-arch-line" />
          <div className="flex items-center justify-between py-5">
            <span className="arch-label">{label}</span>
            <span className="arch-label hidden sm:block">NIT Silchar</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-1 items-center">
          <h1 className="arch-display text-[clamp(3rem,13vw,11rem)]">
            <ArchChars text={title} />
          </h1>
        </div>

        {/* Bottom rail */}
        <div>
          <div className="flex items-end justify-between pb-5">
            <div data-loader-meta className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-arch-ink" />
              <span ref={stepRef} className="arch-label">
                {steps[stepIndex]}
              </span>
            </div>

            <span
              data-loader-meta
              ref={countRef}
              className="arch-num text-[clamp(1.75rem,5vw,3rem)] font-medium leading-none tracking-tight text-arch-ink"
            >
              000
            </span>
          </div>

          <div data-loader-rail className="h-px w-full origin-center bg-arch-line">
            <div ref={barRef} className="h-px w-full origin-left scale-x-0 bg-arch-ink" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ArchPageLoader)
