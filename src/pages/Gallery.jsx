import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DriftWall from '../components/ui/DriftWall'
import OptionWheel from '../components/ui/OptionWheel'
import ArchPageLoader from '../components/ArchPageLoader'
import { ArchChars } from '../components/ArchType'
import { useArchReveal, archSpring, archTween } from '../hooks/useArchAnim'
import { GALLERY_EVENTS, ALL_PHOTOS } from '../constants/gallery'

const Gallery = () => {
  const [ready, setReady] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const scope = useRef(null)

  const event = GALLERY_EVENTS[selected] ?? GALLERY_EVENTS[0]
  const wheelItems = useMemo(() => GALLERY_EVENTS.map((e) => e.name), [])

  useArchReveal(scope, [loaderDone, selected])

  // Warm the first event's photographs, then let the panel lift. The timeout
  // is a hard backstop: the panel holds body scroll, so `ready` must always
  // resolve even if an image 404s or hangs.
  useEffect(() => {
    let live = true
    let settled = 0
    const shots = GALLERY_EVENTS[0].photos
    const done = () => {
      settled += 1
      if (live && settled >= shots.length) setReady(true)
    }
    shots.forEach((src) => {
      const img = new Image()
      img.onload = done
      img.onerror = done
      img.src = src
    })
    const backstop = setTimeout(() => live && setReady(true), 3500)
    return () => {
      live = false
      clearTimeout(backstop)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = loaderDone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [loaderDone])

  // Close the lightbox on Escape.
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <>
      {!loaderDone && (
        <ArchPageLoader
          title="Gallery"
          label="Computer Science Society"
          steps={['Gathering photographs', 'Sorting by event', 'Hanging the wall']}
          ready={ready}
          onDone={() => setLoaderDone(true)}
        />
      )}

      <div ref={scope} className="min-h-screen w-full bg-arch-bg text-arch-ink">
        {/* ── HERO: drifting wall ─────────────────────────────── */}
        <section className="relative h-[76vh] min-h-[520px] w-full overflow-hidden border-b border-arch-line">
          <div className="absolute inset-0">
            <DriftWall
              items={ALL_PHOTOS}
              columns={6}
              tileWidth={220}
              tileHeight={146}
              gap={16}
              radius={0}
              tilt={14}
              turn={-12}
              perspective={1300}
              depth={110}
              speed={34}
              direction="up"
              variance={0.4}
              parallax={0.5}
              lift={56}
              fade={0.55}
              /* Photographs stay bright and in colour — the ARCH rule.
                 The vendor's dim/tint defaults are built for a dark theme. */
              dim={0.9}
              grayscale={false}
              overlayColor="#F4F3EF"
            />
          </div>

          {/* Masthead over the wall */}
          <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-between px-6 pb-10 pt-[104px] md:px-10">
            <p className="arch-label arch-on-liquid">Photographs from the year</p>

            <div>
              <h1
                data-arch="chars"
                className="arch-display arch-on-liquid text-[clamp(3rem,11vw,10rem)]"
              >
                <ArchChars text="Gallery" />
              </h1>
              <p className="arch-lead arch-on-liquid mt-6 max-w-lg">
                Every event the society runs, as it happened — pick one below.
              </p>
            </div>
          </div>
        </section>

        {/* ── EVENT PICKER + GRID ─────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1600px] px-6 py-20 md:px-10 md:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Wheel */}
            <div className="lg:col-span-4">
              <p className="arch-label mb-8">Select an event</p>

              <div className="h-[360px] w-full md:h-[440px]">
                <OptionWheel
                  className="arch-wheel"
                  items={wheelItems}
                  defaultSelected={0}
                  onChange={(index) => setSelected(index)}
                  textColor="#9A968D"
                  activeColor="#1C1C1C"
                  side="left"
                  fontSize={2.4}
                  spacing={1.5}
                  curve={1}
                  tilt={5}
                  blur={1.4}
                  fade={0.28}
                  smoothing={200}
                  inset={0}
                  loop={false}
                  draggable
                />
              </div>

              <div className="mt-8 border-t border-arch-line pt-6">
                <p className="arch-body max-w-sm">{event.blurb}</p>
              </div>
            </div>

            {/* Photographs */}
            <div className="lg:col-span-8">
              <div className="mb-8 flex items-baseline justify-between border-b border-arch-line pb-5">
                <h2 className="arch-title text-[clamp(1.5rem,3vw,2.5rem)]">{event.name}</h2>
                <span className="arch-label">Photographs</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={event.slug}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={archTween}
                  className="grid grid-cols-2 gap-px bg-arch-line sm:grid-cols-3"
                >
                  {event.photos.map((src, i) => {
                    const id = `${event.slug}-${i}`
                    return (
                      <motion.button
                        key={id}
                        layoutId={id}
                        onClick={() => setLightbox({ id, src, index: i })}
                        transition={archSpring}
                        className="group relative aspect-[4/3] overflow-hidden bg-arch-card"
                        aria-label={`Open photograph ${i + 1} from ${event.name}`}
                      >
                        <motion.img
                          src={src}
                          alt={`${event.name}, photograph ${i + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                      </motion.button>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={archTween}
              onClick={() => setLightbox(null)}
              className="absolute inset-0 bg-arch-ink/70"
            />

            <motion.div
              layoutId={lightbox.id}
              transition={archSpring}
              className="relative z-10 max-h-full w-auto overflow-hidden border border-arch-line bg-arch-card"
            >
              <img
                src={lightbox.src}
                alt={`${event.name}, photograph ${lightbox.index + 1}`}
                className="max-h-[78vh] w-auto max-w-full object-contain"
              />
              <div className="flex items-center justify-between border-t border-arch-line px-5 py-4">
                <span className="arch-label">{event.name}</span>
                <button
                  onClick={() => setLightbox(null)}
                  aria-label="Close photograph"
                  className="flex h-8 w-8 items-center justify-center border border-arch-line text-arch-ink transition-colors duration-300 hover:bg-arch-ink hover:text-arch-bg"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Gallery
