import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { archTween, ARCH_EASE_CSS } from '../hooks/useArchAnim'
import { parseInstituteEmail } from '../utils/instituteEmail'

/* ------------------------------------------------------------------
   Welcome story — shown once, straight after onboarding, to the
   incoming Computer Science batch.

   It behaves like a story reel because that is the grammar a first-year
   already reads without instruction: timed chapters, a rail of progress
   bars, tap right to go on and left to go back. Everything else is the
   ARCH language — beige, hairlines, display type, no chrome.

   The timer is driven by rAF rather than setTimeout so that holding the
   screen pauses mid-chapter instead of restarting it, and so a
   backgrounded tab does not silently burn through the whole story.
------------------------------------------------------------------ */

const CHAPTER_MS = 7000

const CHAPTERS = [
  {
    kicker: 'Computer Science Society',
    title: 'Welcome to Silchar.',
    body: 'You have just joined the Department of Computer Science & Engineering at NIT Silchar. This is the society that runs alongside it — student-built, student-run, and yours from today.',
    figure: 'batch',
  },
  {
    kicker: 'What this is',
    title: 'A society, not a club.',
    body: 'CSS is the technical body of the department. We run workshops, contests, talks and build projects together. Nothing here is a spectator sport — every event you see was put together by students a year or two ahead of you.',
    figure: 'rule',
  },
  {
    kicker: 'How it is organised',
    title: 'Seven wings.',
    body: 'Each wing owns a craft. You are not asked to choose today — most people wander through two or three before something sticks.',
    figure: 'wings',
  },
  {
    kicker: 'Your first year',
    title: 'Turn up. That is the whole trick.',
    body: 'First-years are not expected to arrive knowing things. Come to a session, break something in a lab, ask the question you think is too basic. The people running the wings were exactly where you are.',
    figure: 'rule',
  },
  {
    kicker: 'What is ahead',
    title: 'Build in public.',
    body: 'Abacus, Esperanza, the contests, the freshers programme — the calendar fills fast. Registration, certificates and the photo archive all live in your account now.',
    figure: 'rule',
  },
  {
    kicker: 'Start here',
    title: 'See you at the first session.',
    body: 'Have a look at the wings, then at what is coming up. Your dashboard is waiting whenever you are done.',
    figure: 'end',
  },
]

const WINGS = [
  'Executive',
  'Development',
  'Competitive',
  'Machine Learning',
  'Public Relations',
  'Design',
  'Literature',
]

function Figure({ kind, identity }) {
  if (kind === 'batch') {
    return (
      <div className="mt-14 border-t border-arch-line pt-8">
        <p className="arch-label mb-4">Your intake</p>
        <p className="arch-display text-[clamp(3rem,12vw,8rem)] leading-none">
          {identity.admissionYear || '—'}
        </p>
      </div>
    )
  }
  if (kind === 'wings') {
    return (
      <ul className="mt-12 grid grid-cols-1 gap-px border-t border-arch-line bg-arch-line sm:grid-cols-2">
        {WINGS.map((w, i) => (
          <motion.li
            key={w}
            className="flex items-baseline gap-4 bg-arch-bg px-1 py-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...archTween, delay: 0.25 + i * 0.07 }}
          >
            <span className="arch-label text-arch-faint">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[15px] tracking-[-0.01em] text-arch-ink">{w}</span>
          </motion.li>
        ))}
      </ul>
    )
  }
  if (kind === 'end') return null
  return (
    <motion.div
      className="mt-14 h-px origin-left bg-arch-ink"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1.4, ease: ARCH_EASE_CSS, delay: 0.2 }}
    />
  )
}

const WelcomeStory = () => {
  const { user, markWelcomeStorySeen } = useAuth()
  const navigate = useNavigate()

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  const closingRef = useRef(false)
  /* The active bar is written to directly. Putting its width in state
     would re-render the whole story sixty times a second, and this is
     the one number that changes every frame. */
  const barRef = useRef(null)
  const elapsedRef = useRef(0)
  const identity = parseInstituteEmail(user?.email || '')

  useEffect(() => {
    if (!user) navigate('/auth', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  /* Leaving the story is the only place the seen-flag is written, so it
     is written exactly once however the visitor gets out. */
  const close = useCallback(
    async (destination = '/dashboard') => {
      if (closingRef.current) return
      closingRef.current = true
      try {
        await markWelcomeStorySeen?.()
      } catch {
        /* the local mirror already recorded it */
      }
      navigate(destination, { replace: true })
    },
    [markWelcomeStorySeen, navigate]
  )

  const next = useCallback(() => {
    elapsedRef.current = 0
    setIndex((i) => {
      if (i >= CHAPTERS.length - 1) {
        close()
        return i
      }
      return i + 1
    })
  }, [close])

  const prev = useCallback(() => {
    elapsedRef.current = 0
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  /* rAF timer. A held pointer or a hidden tab pauses it where it stands
     rather than restarting the chapter, which is why the elapsed time
     lives in a ref and the effect resumes from it. */
  useEffect(() => {
    const bar = barRef.current
    if (bar) bar.style.width = `${Math.min(1, elapsedRef.current) * 100}%`
    if (reduced || paused) return

    let raf = 0
    let last = performance.now()

    const tick = (now) => {
      const dt = now - last
      last = now
      elapsedRef.current += dt / CHAPTER_MS

      if (elapsedRef.current >= 1) {
        elapsedRef.current = 0
        next()
        return
      }

      if (barRef.current) {
        barRef.current.style.width = `${elapsedRef.current * 100}%`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, paused, next, index])

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, close])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (!user) return null

  const chapter = CHAPTERS[index]

  return (
    <div className="fixed inset-0 z-[220] flex flex-col bg-arch-bg text-arch-ink">
      {/* Progress rail */}
      <div className="flex shrink-0 gap-2 px-6 pt-6 md:px-10 md:pt-8">
        {CHAPTERS.map((c, i) => (
          <span key={c.kicker} className="relative h-[2px] flex-1 bg-arch-line">
            <span
              ref={i === index ? barRef : null}
              className="absolute inset-y-0 left-0 bg-arch-ink"
              style={{ width: i < index ? '100%' : 0 }}
            />
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-6 py-6 md:px-10">
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden bg-black">
            <img
              src="/images/css-logo-mark.png"
              alt=""
              className="h-full w-full object-contain invert"
            />
          </span>
          <span className="arch-label">Computer Science Society</span>
        </span>
        <button type="button" onClick={() => close()} className="arch-link text-sm">
          Skip
        </button>
      </div>

      {/* Chapter */}
      <div
        className="relative flex-1 overflow-y-auto"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
      >
        {/* Tap zones. They sit behind the content so links stay clickable. */}
        <button
          type="button"
          aria-label="Previous"
          onClick={prev}
          className="absolute inset-y-0 left-0 z-0 w-1/3 cursor-w-resize opacity-0"
        />
        <button
          type="button"
          aria-label="Next"
          onClick={next}
          className="absolute inset-y-0 right-0 z-0 w-2/3 cursor-e-resize opacity-0"
        />

        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[900px] px-6 pb-20 pt-6 md:px-10">
          <AnimatePresence mode="wait">
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={archTween}
            >
              <p className="arch-label mb-8">{chapter.kicker}</p>
              <h1 className="arch-display text-[clamp(2.25rem,7.5vw,5.5rem)]">
                {chapter.title}
              </h1>
              <p className="arch-lead mt-10 max-w-2xl">{chapter.body}</p>

              <Figure kind={chapter.figure} identity={identity} />

              {chapter.figure === 'end' && (
                <div className="pointer-events-auto mt-16 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => close('/wings')}
                    className="arch-btn px-8 py-4"
                  >
                    <span>See the wings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => close('/events')}
                    className="arch-btn px-8 py-4"
                  >
                    <span>What&rsquo;s coming up</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => close('/dashboard')}
                    className="arch-btn arch-btn-solid px-8 py-4"
                  >
                    <span>Go to dashboard</span>
                  </button>
                </div>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer rail */}
      <div className="flex shrink-0 items-center justify-between border-t border-arch-line px-6 py-5 md:px-10">
        <span className="arch-label text-arch-faint">
          {String(index + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
        </span>
        <span className="flex items-center gap-6">
          <button
            type="button"
            onClick={prev}
            className="arch-link text-sm disabled:opacity-30"
            disabled={index === 0}
          >
            Back
          </button>
          <button type="button" onClick={next} className="arch-link text-sm">
            {index === CHAPTERS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </span>
      </div>
    </div>
  )
}

export default WelcomeStory
