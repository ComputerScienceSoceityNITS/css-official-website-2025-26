import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ARCH_EASE } from '../hooks/useArchAnim'

/**
 * ArchPageLoader — the route-level loading panel.
 *
 * Four beige columns fill the viewport under the navbar. The page title
 * rises out of a mask, a status manifest ticks through, and a counter
 * ramps toward 100. When `ready` flips, the columns lift away in
 * sequence like a blind, revealing the page already rendered behind.
 *
 * Presentational only — the caller owns the actual loading state.
 */
const COLUMNS = 4

const ArchPageLoader = ({
  title = 'Loading',
  label = 'Computer Science Society',
  steps = ['Fetching records', 'Composing layout', 'Ready'],
  ready = false,
  onDone,
}) => {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const colsRef = useRef([])
  const titleRef = useRef(null)
  const barRef = useRef(null)
  const countRef = useRef(null)
  const stepRef = useRef(null)
  const progressRef = useRef({ v: 0 })
  const doneRef = useRef(false)

  const [stepIndex, setStepIndex] = useState(0)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---- entrance + idle ramp --------------------------------------- */
  useLayoutEffect(() => {
    if (reduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(colsRef.current, {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.55,
        ease: ARCH_EASE,
        stagger: 0.05,
      })
        .from(
          '[data-loader-rail]',
          { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: ARCH_EASE, stagger: 0.08 },
          '-=0.25'
        )
        .from(
          titleRef.current,
          { yPercent: 115, duration: 1.05, ease: ARCH_EASE },
          '-=0.5'
        )
        .from(
          '[data-loader-meta]',
          { opacity: 0, y: 14, duration: 0.7, ease: ARCH_EASE, stagger: 0.08 },
          '-=0.7'
        )

      /* Creep toward 92% while we wait — never fake a finish. */
      gsap.to(progressRef.current, {
        v: 92,
        duration: 6,
        ease: 'power2.out',
        onUpdate: () => {
          const n = Math.round(progressRef.current.v)
          if (countRef.current) countRef.current.textContent = String(n).padStart(3, '0')
          if (barRef.current) gsap.set(barRef.current, { scaleX: n / 100 })
        },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  /* ---- status manifest -------------------------------------------- */
  useEffect(() => {
    if (steps.length < 2) return
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length)
    }, 900)
    return () => clearInterval(id)
  }, [steps.length])

  useEffect(() => {
    if (reduced || !stepRef.current) return
    gsap.fromTo(
      stepRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: ARCH_EASE }
    )
  }, [stepIndex, reduced])

  /* ---- exit -------------------------------------------------------- */
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
      onUpdate: () => {
        const n = Math.round(progressRef.current.v)
        if (countRef.current) countRef.current.textContent = String(n).padStart(3, '0')
        if (barRef.current) gsap.set(barRef.current, { scaleX: n / 100 })
      },
    })
      .to(stageRef.current, { opacity: 0, y: -20, duration: 0.45, ease: ARCH_EASE }, '-=0.1')
      .to(
        colsRef.current,
        {
          yPercent: -100,
          duration: 1.05,
          ease: 'power4.inOut',
          stagger: 0.07,
        },
        '-=0.15'
      )

    return () => tl.kill()
  }, [ready, reduced, onDone])

  return (
    <div ref={rootRef} className="fixed inset-0 z-[150] overflow-hidden">
      {/* Lifting columns */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              colsRef.current[i] = el
            }}
            className="h-full flex-1 border-r border-arch-line/70 bg-arch-bg last:border-r-0"
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
          <div data-loader-rail className="h-px w-full origin-left bg-arch-line" />
          <div className="flex items-center justify-between py-5">
            <span className="arch-label">{label}</span>
            <span className="arch-label hidden sm:block">NIT Silchar</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex-1 flex items-center">
          <div>
            <div className="arch-split-line">
              <h1
                ref={titleRef}
                className="arch-line-inner arch-display text-[clamp(3rem,13vw,11rem)]"
              >
                {title}
              </h1>
            </div>
          </div>
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

          <div data-loader-rail className="h-px w-full origin-left bg-arch-line">
            <div ref={barRef} className="h-px w-full origin-left scale-x-0 bg-arch-ink" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ArchPageLoader)
