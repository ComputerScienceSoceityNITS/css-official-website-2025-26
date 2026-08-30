import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DriftWall from '../components/ui/DriftWall'
import OptionWheel from '../components/ui/OptionWheel'
import ArchPageLoader from '../components/ArchPageLoader'
import { ArchChars } from '../components/ArchType'
import { useArchReveal, archTween } from '../hooks/useArchAnim'
import { GALLERY_EVENTS, ALL_PHOTOS } from '../constants/gallery'
import { cdnImage, cdnSrcSet, IMG } from '../utils/cdnImage'

/** How many tiles to add each time the sentinel comes into view. */
const PAGE = 24

const Gallery = () => {
  const [ready, setReady] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const [shown, setShown] = useState(PAGE)
  const [heroLive, setHeroLive] = useState(true)

  const scope = useRef(null)
  const heroRef = useRef(null)
  const sentinelRef = useRef(null)
  const gridRef = useRef(null)
  const firstRender = useRef(true)

  // The wall is a fixed-width plane: columns x (tileWidth + gap), scaled and
  // rotated. At a fixed 5 columns it stopped ~560px short of a 1920px
  // viewport, so the count is derived from the width instead.
  const [columns, setColumns] = useState(6)
  const [tileConfig, setTileConfig] = useState({
    width: 220,
    height: 146,
    gap: 16,
  })

  const event = GALLERY_EVENTS[selected] ?? GALLERY_EVENTS[0]
  const wheelItems = useMemo(() => GALLERY_EVENTS.map((e) => e.name), [])

  // Flatten to a render list once per event, carrying the group label along
  // so the grid can show sub-headings without nesting two loops.
  const tiles = useMemo(() => {
    const out = []
    event.groups.forEach((group, gi) => {
      group.photos.forEach((src, i) => {
        out.push({
          id: `${event.slug}-${gi}-${i}`,
          src,
          label: group.label,
          first: i === 0,
          groupIndex: gi,
        })
      })
    })
    return out
  }, [event])

  const visible = tiles.slice(0, shown)
  const hasMore = shown < tiles.length

  useArchReveal(scope, [loaderDone])

  useEffect(() => {
    const calc = () => {
      const isMobile = window.innerWidth < 768
      const width = isMobile ? 130 : 220
      const height = isMobile ? 86 : 146
      const gap = isMobile ? 10 : 16
      const SCALE = 1.12 // plane is scaled 1.18; leave a little margin
      
      setTileConfig({ width, height, gap })
      const need = Math.ceil(window.innerWidth / SCALE / (width + gap)) + 1
      setColumns(Math.min(12, Math.max(4, need)))
    }
    calc()
    window.addEventListener('resize', calc, { passive: true })
    return () => window.removeEventListener('resize', calc)
  }, [])

  // Reset paging when the event changes, and re-anchor the viewport.
  //
  // Switching from an 87-photo event to an 18-photo one collapses the page
  // height; the browser keeps its scrollTop and you land at the bottom of the
  // document. Pulling the view back to the top of the grid keeps the change
  // predictable whichever direction the length moves.
  useEffect(() => {
    setShown(PAGE)

    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const el = gridRef.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const NAV = 96 // fixed navbar plus a little breathing room
    const top = el.getBoundingClientRect().top + window.scrollY - NAV

    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' })
  }, [selected])

  // Wait on only a handful of thumbnails, and count failures as settled —
  // the panel holds body scroll until `ready`.
  useEffect(() => {
    let live = true
    let settled = 0
    const shots = (GALLERY_EVENTS[0]?.photos ?? []).slice(0, 4)
    if (!shots.length) {
      setReady(true)
      return undefined
    }
    const done = () => {
      settled += 1
      if (live && settled >= shots.length) setReady(true)
    }
    shots.forEach((src) => {
      const img = new Image()
      img.onload = done
      img.onerror = done
      img.src = cdnImage(src, IMG.tile)
    })
    const backstop = setTimeout(() => live && setReady(true), 2500)
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

  // Idle the drifting wall once the hero leaves the viewport — its rAF loop
  // transforms every column on every frame and would otherwise run the whole
  // time you are browsing the grid below.
  useEffect(() => {
    const el = heroRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => setHeroLive(entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Reveal more tiles as the sentinel approaches.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown((n) => n + PAGE)
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, selected])

  useEffect(() => {
    if (!lightbox) return undefined
    const onKey = (e) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const onWheelChange = useCallback((index) => setSelected(index), [])

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
        {/* ── HERO ───────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative h-[55vh] min-h-[340px] md:h-[70vh] md:min-h-[460px] w-full overflow-hidden border-b border-arch-line"
        >
          <div className="absolute inset-0">
            <DriftWall
              items={ALL_PHOTOS}
              paused={!heroLive}
              columns={columns}
              tileWidth={tileConfig.width}
              tileHeight={tileConfig.height}
              gap={tileConfig.gap}
              radius={0}
              tilt={14}
              turn={-12}
              perspective={1300}
              depth={110}
              speed={30}
              direction="up"
              variance={0.4}
              parallax={0.5}
              lift={48}
              /* Lower fade = larger solid area before the edge vignette.
                 0.55 left the wall visibly masked well inside the viewport. */
              fade={0.3}
              dim={0.9}
              grayscale={false}
              overlayColor="#F4F3EF"
            />
          </div>

          <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-between px-6 pb-10 pt-[104px] md:px-10">
            <p className="arch-label arch-on-liquid">Photographs from the year</p>
            <div>
              <h1 data-arch="chars" className="arch-display arch-on-liquid text-[clamp(3rem,11vw,10rem)]">
                <ArchChars text="Gallery" />
              </h1>
              <p className="arch-lead arch-on-liquid mt-6 max-w-lg">
                Every event the society runs, as it happened — pick one below.
              </p>
            </div>
          </div>
        </section>

        {/* ── PICKER + GRID ──────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1600px] px-6 py-20 md:px-10 md:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Wheel — sticky so it stays reachable while the grid scrolls */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[100px]">
                <p className="arch-label mb-8">Select an event</p>

                <div className="h-[300px] w-full md:h-[380px]">
                  <OptionWheel
                    className="arch-wheel"
                    items={wheelItems}
                    defaultSelected={0}
                    onChange={onWheelChange}
                    /* Page scroll must stay page scroll — select by click,
                       drag or arrow keys instead. */
                    scrollToSelect={false}
                    textColor="#9A968D"
                    activeColor="#1C1C1C"
                    side="left"
                    fontSize={2.2}
                    spacing={1.5}
                    curve={1}
                    tilt={5}
                    blur={1.2}
                    fade={0.28}
                    smoothing={200}
                    inset={0}
                    loop={false}
                    draggable
                  />
                </div>

                <div className="mt-8 border-t border-arch-line pt-6">
                  <p className="arch-body max-w-sm">
                    {event.year ? `${event.year} · ` : ''}
                    {event.photos.length} photograph{event.photos.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
            </div>

            {/* Photographs */}
            <div ref={gridRef} className="lg:col-span-8 scroll-mt-28">
              <div className="mb-8 flex items-baseline justify-between border-b border-arch-line pb-5">
                <h2 className="arch-title text-[clamp(1.5rem,3vw,2.5rem)]">{event.name}</h2>
                <span className="arch-label">
                  {visible.length} / {tiles.length}
                </span>
              </div>

              {/* Plain elements, not motion.* — a Framer component per tile
                  (and a layoutId each) made a 270-photo event crawl. */}
              <div key={event.slug} className="grid grid-cols-2 gap-px bg-arch-line sm:grid-cols-3">
                {visible.map((tile) => (
                  <React.Fragment key={tile.id}>
                    {tile.label && tile.first && (
                      <p className="arch-label col-span-full bg-arch-bg px-1 pb-3 pt-8 first:pt-0">
                        {tile.label}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setLightbox(tile)}
                      className="arch-tile group relative aspect-[4/3] overflow-hidden bg-arch-card"
                      aria-label={`Open photograph from ${event.name}`}
                    >
                      <img
                        src={cdnImage(tile.src, IMG.tile)}
                        srcSet={cdnSrcSet(tile.src, IMG.tile)}
                        sizes="(min-width: 640px) 30vw, 45vw"
                        alt={`${event.name}${tile.label ? ` — ${tile.label}` : ''}`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          // fall back to the untransformed original
                          if (e.currentTarget.src !== tile.src) {
                            e.currentTarget.srcset = ''
                            e.currentTarget.src = tile.src
                          }
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {hasMore && (
                <div ref={sentinelRef} className="flex justify-center pt-10">
                  <button onClick={() => setShown((n) => n + PAGE)} className="arch-btn">
                    <span>Show more</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── LIGHTBOX ───────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={archTween}
              onClick={() => setLightbox(null)}
              className="absolute inset-0 bg-arch-ink/70 backdrop-blur-[3px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={archTween}
              className="relative z-10 max-h-full overflow-hidden border border-arch-line bg-arch-card"
            >
              <img
                src={cdnImage(lightbox.src, IMG.full)}
                alt={`${event.name}${lightbox.label ? ` — ${lightbox.label}` : ''}`}
                onError={(e) => {
                  if (e.currentTarget.src !== lightbox.src) e.currentTarget.src = lightbox.src
                }}
                className="max-h-[78vh] w-auto max-w-full object-contain"
              />
              <div className="flex items-center justify-between border-t border-arch-line px-5 py-4">
                <span className="arch-label">
                  {event.name}
                  {lightbox.label ? ` · ${lightbox.label}` : ''}
                </span>
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
